# StructurAId — Backend

FastAPI service that powers document extraction via Claude AI.

## Quick Start

```bash
cd backend
cp .env.example .env        # Fill in ANTHROPIC_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /extract | Upload document, get job_id |
| GET | /jobs/{job_id} | Poll job status + results |
| GET | /jobs/{job_id}/export/json | Export as JSON |
| GET | /jobs/{job_id}/export/csv | Export as CSV |

## Deploy to Railway

1. Push to GitHub
2. Create new Railway project → Connect repo → select `/backend`
3. Add env vars from `.env.example`
4. Railway auto-detects FastAPI and deploys

## OCR Dependencies

For image/PDF OCR, install system dependencies:
```bash
# Ubuntu/Debian
sudo apt-get install tesseract-ocr poppler-utils

# macOS
brew install tesseract poppler
```
