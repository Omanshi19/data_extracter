from dotenv import load_dotenv
load_dotenv()
"""
StructurAId Backend — FastAPI
Turns document chaos into structured JSON using Claude AI.
"""

import os
import uuid
import logging
import asyncio
from pathlib import Path
from typing import Optional, Literal
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import (
    ExtractionRequest, ExtractionResponse, ExtractionStatus,
    DocumentType, ExtractionJob
)
from services.extractor import ExtractionService
from services.storage import JobStore

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("structuraid")

@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("🚀 StructurAId API starting up")
    os.makedirs("uploads", exist_ok=True)
    yield
    log.info("🛑 StructurAId API shutting down")

app = FastAPI(
    title="StructurAId API",
    description="Turn unstructured documents into clean structured JSON.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

extractor = ExtractionService()
jobs = JobStore()


@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/extract", response_model=ExtractionResponse)
async def extract_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    document_type: DocumentType = Form(DocumentType.AUTO),
    custom_schema: Optional[str] = Form(None),
):
    allowed_types = {"application/pdf", "image/jpeg", "image/png", "text/plain", "text/csv"}
    if file.content_type not in allowed_types:
        raise HTTPException(400, f"Unsupported file type: {file.content_type}")

    MAX_SIZE = int(os.getenv("MAX_FILE_SIZE_MB", 20)) * 1024 * 1024
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(413, "File too large")

    job_id = str(uuid.uuid4())
    file_path = Path(f"uploads/{job_id}_{file.filename}")
    file_path.write_bytes(content)

    job = ExtractionJob(
        job_id=job_id,
        filename=file.filename,
        document_type=document_type,
        status=ExtractionStatus.PENDING,
    )
    jobs.set(job_id, job)

    background_tasks.add_task(run_extraction, job_id, file_path, document_type, custom_schema)

    log.info(f"Job {job_id} queued for {file.filename}")
    return ExtractionResponse(job_id=job_id, status=ExtractionStatus.PENDING)


@app.get("/jobs/{job_id}", response_model=ExtractionJob)
async def get_job(job_id: str):
    job = jobs.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return job


@app.get("/jobs/{job_id}/export/{format}")
async def export_job(job_id: str, format: Literal["json", "csv"]):
    job = jobs.get(job_id)
    if not job or not job.result:
        raise HTTPException(404, "Results not available")

    if format == "json":
        return JSONResponse(content=job.result)

    import csv, io
    output = io.StringIO()
    w = csv.writer(output)
    flat = flatten_dict(job.result)
    w.writerow(flat.keys())
    w.writerow(flat.values())
    return JSONResponse(
        content={"csv": output.getvalue()},
        headers={"Content-Disposition": f'attachment; filename="{job_id}.csv"'}
    )


async def run_extraction(job_id: str, file_path: Path, doc_type: DocumentType, custom_schema: Optional[str]):
    job = jobs.get(job_id)
    job.status = ExtractionStatus.PROCESSING
    jobs.set(job_id, job)

    try:
        result = await extractor.extract(file_path, doc_type, custom_schema)
        job.result = result
        job.status = ExtractionStatus.DONE
        log.info(f"Job {job_id} completed successfully")
    except Exception as e:
        log.error(f"Job {job_id} failed: {e}")
        job.status = ExtractionStatus.FAILED
        job.error = str(e)
    finally:
        jobs.set(job_id, job)
        try:
            file_path.unlink()
        except Exception:
            pass


def flatten_dict(d: dict, prefix="") -> dict:
    items = {}
    for k, v in d.items():
        key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            items.update(flatten_dict(v, key))
        elif isinstance(v, list):
            items[key] = "; ".join(str(i) for i in v)
        else:
            items[key] = v
    return items
