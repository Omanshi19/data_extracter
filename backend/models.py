from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel


class DocumentType(str, Enum):
    INVOICE = "invoice"
    CONTRACT = "contract"
    RECEIPT = "receipt"
    ID_DOCUMENT = "id_document"
    BANK_STATEMENT = "bank_statement"
    RESUME = "resume"
    AUTO = "auto"


class ExtractionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    DONE = "done"
    FAILED = "failed"


class ExtractionRequest(BaseModel):
    document_type: DocumentType = DocumentType.AUTO
    custom_schema: Optional[str] = None


class ExtractionResponse(BaseModel):
    job_id: str
    status: ExtractionStatus


class ExtractionJob(BaseModel):
    job_id: str
    filename: str
    document_type: DocumentType
    status: ExtractionStatus
    result: Optional[dict[str, Any]] = None
    error: Optional[str] = None
    confidence: Optional[float] = None
