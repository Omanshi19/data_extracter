"""
ExtractionService — StructurAId backend.
Pipeline: detect MIME → OCR → Groq LLaMA → parse JSON → retry on failure
"""

import os
import re
import json
import logging
import asyncio
from pathlib import Path
from typing import Optional, Any

import httpx
from dotenv import load_dotenv

load_dotenv()

from models import DocumentType

log = logging.getLogger("structuraid.extractor")

MAX_RETRIES = int(os.getenv("EXTRACTION_MAX_RETRIES", 3))
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = "llama-3.3-70b-versatile"

SCHEMAS: dict[DocumentType, dict] = {
    DocumentType.INVOICE: {
        "document_type": "invoice",
        "vendor_name": "string",
        "vendor_address": "string",
        "client_name": "string",
        "client_address": "string",
        "invoice_number": "string",
        "issue_date": "YYYY-MM-DD",
        "due_date": "YYYY-MM-DD",
        "subtotal": "string with currency symbol",
        "tax_rate": "percentage string",
        "tax_amount": "string with currency symbol",
        "total_amount": "string with currency symbol",
        "currency": "ISO 4217 code",
        "payment_terms": "string",
        "line_items": [{"description": "string", "quantity": "number", "unit_price": "string", "amount": "string"}],
    },
    DocumentType.CONTRACT: {
        "document_type": "contract",
        "contract_title": "string",
        "parties": [{"name": "string", "role": "string", "address": "string"}],
        "effective_date": "YYYY-MM-DD",
        "expiration_date": "YYYY-MM-DD or null",
        "governing_law": "string",
        "key_obligations": ["string"],
        "payment_terms": "string or null",
        "termination_conditions": "string",
        "confidentiality_clause": "boolean",
        "non_compete_clause": "boolean",
    },
    DocumentType.RECEIPT: {
        "document_type": "receipt",
        "merchant_name": "string",
        "merchant_address": "string",
        "transaction_date": "YYYY-MM-DD",
        "transaction_time": "HH:MM",
        "items": [{"description": "string", "quantity": "number", "unit_price": "string", "total": "string"}],
        "subtotal": "string with currency",
        "tax": "string with currency",
        "tip": "string with currency or null",
        "total": "string with currency",
        "payment_method": "string",
        "last_four_digits": "string or null",
    },
    DocumentType.ID_DOCUMENT: {
        "document_type": "id_document",
        "full_name": "string",
        "date_of_birth": "YYYY-MM-DD",
        "id_number": "string",
        "issue_date": "YYYY-MM-DD",
        "expiry_date": "YYYY-MM-DD",
        "issuing_country": "string",
        "issuing_authority": "string",
        "address": "string or null",
    },
    DocumentType.BANK_STATEMENT: {
        "document_type": "bank_statement",
        "bank_name": "string",
        "account_holder": "string",
        "account_number": "string (masked)",
        "statement_period": "string",
        "opening_balance": "string with currency",
        "closing_balance": "string with currency",
        "transactions": [{"date": "YYYY-MM-DD", "description": "string", "amount": "string", "type": "credit/debit"}],
    },
    DocumentType.RESUME: {
    "document_type": "resume",
    "full_name": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "string or null",
    "github": "string or null",
    "summary": "string or null",
    "skills": ["string"],
    "experience": [{"company": "string", "role": "string", "duration": "string", "responsibilities": ["string"]}],
    "education": [{"institution": "string", "degree": "string", "duration": "string"}],
    "projects": [{"name": "string", "tech_stack": "string", "description": "string"}],
    "certifications": ["string"],
    "hackathons": [{"name": "string", "result": "string"}],
    "languages": ["string"],
},
}


class ExtractionService:
    def __init__(self):
        if not GROQ_API_KEY:
            log.warning("GROQ_API_KEY not set — extraction will fail")
        self.client = httpx.AsyncClient(timeout=60)

    async def extract(self, file_path: Path, doc_type: DocumentType, custom_schema: Optional[str] = None) -> dict[str, Any]:
        text = await self._get_text(file_path)
        if not text.strip():
            raise ValueError("No extractable text found in document")

        schema = self._get_schema(doc_type, custom_schema)

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                result = await self._call_llm(text, schema, doc_type)
                log.info(f"Extraction succeeded on attempt {attempt}")
                return result
            except (json.JSONDecodeError, ValueError) as e:
                log.warning(f"Attempt {attempt}/{MAX_RETRIES} failed: {e}")
                if attempt == MAX_RETRIES:
                    raise
                await asyncio.sleep(1.5 * attempt)

    async def _get_text(self, file_path: Path) -> str:
        suffix = file_path.suffix.lower()
        if suffix in {".txt", ".csv", ".md"}:
            return file_path.read_text(errors="replace")
        if suffix == ".pdf":
            return await self._ocr_pdf(file_path)
        if suffix in {".jpg", ".jpeg", ".png", ".webp"}:
            return await self._ocr_image(file_path)
        raise ValueError(f"Unsupported file type: {suffix}")

    async def _ocr_pdf(self, path: Path) -> str:
        try:
            import pdfplumber
            with pdfplumber.open(path) as pdf:
                pages = [p.extract_text() or "" for p in pdf.pages]
            text = "\n\n".join(pages).strip()
            if text:
                return text
        except ImportError:
            pass
        return await self._ocr_image_from_pdf(path)

    async def _ocr_image(self, path: Path) -> str:
        try:
            import pytesseract
            from PIL import Image
            img = Image.open(path)
            return pytesseract.image_to_string(img)
        except ImportError:
            return f"[IMAGE_FILE:{path.name}]"

    async def _ocr_image_from_pdf(self, path: Path) -> str:
        try:
            import fitz
            import pytesseract
            from PIL import Image
            import io
            doc = fitz.open(path)
            texts = []
            for page in doc:
                mat = fitz.Matrix(2, 2)
                pix = page.get_pixmap(matrix=mat)
                img = Image.open(io.BytesIO(pix.tobytes("png")))
                texts.append(pytesseract.image_to_string(img))
            return "\n\n".join(texts)
        except ImportError:
            return f"[PDF_FILE:{path.name}]"

    async def _call_llm(self, text: str, schema: dict, doc_type: DocumentType) -> dict[str, Any]:
        prompt = self._build_prompt(text, schema, doc_type)

        resp = await self.client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are a precise document data extraction specialist. "
                            "You extract structured data from documents and return ONLY valid JSON. "
                            "Never include markdown code fences, explanations, or any text outside the JSON object. "
                            "If a field cannot be found, use null."
                        ),
                    },
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.1,
                "max_tokens": 4096,
            },
        )

        if resp.status_code != 200:
            raise ValueError(f"Groq API error {resp.status_code}: {resp.text}")

        content = resp.json()["choices"][0]["message"]["content"].strip()
        content = re.sub(r"^```(?:json)?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
        return json.loads(content)

    def _build_prompt(self, text: str, schema: dict, doc_type: DocumentType) -> str:
        schema_str = json.dumps(schema, indent=2)
        doc_hint = "" if doc_type == DocumentType.AUTO else f"Document type: {doc_type.value}\n"
        return f"""{doc_hint}Extract all structured data from the following document text.
Return a single JSON object that matches this schema exactly:

{schema_str}

Rules:
- Use null for any field not found in the document
- Preserve original formatting for amounts (e.g. "$1,234.56")
- Dates must be YYYY-MM-DD format
- Return ONLY the JSON object, nothing else

Document text:
---
{text[:8000]}
---"""

    def _get_schema(self, doc_type: DocumentType, custom_schema: Optional[str]) -> dict:
        if custom_schema:
            try:
                return json.loads(custom_schema)
            except json.JSONDecodeError:
                log.warning("Invalid custom schema JSON, using default")

        if doc_type == DocumentType.AUTO:
            return {
                "document_type": "string (detected type)",
                "title": "string",
                "date": "YYYY-MM-DD",
                "parties": ["string"],
                "amounts": ["string with currency"],
                "reference_numbers": ["string"],
                "key_fields": {"field_name": "value"},
                "summary": "brief string summary",
            }

        return SCHEMAS.get(doc_type, SCHEMAS[DocumentType.INVOICE])