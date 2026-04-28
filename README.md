# StructurAId 🧠

> Turn unstructured documents into clean, structured JSON using AI.

<img width="1440" height="810" alt="image" src="https://github.com/user-attachments/assets/f83d6176-28af-42a0-b90c-f3d6132ab98d" />
<img width="1440" height="803" alt="image" src="https://github.com/user-attachments/assets/1d66770d-e0ac-47a4-9388-5e3228ff9192" />
<img width="1440" height="810" alt="image" src="https://github.com/user-attachments/assets/bc39bd21-fca1-4c9d-b9ff-af2b56c9b0fe" />



A full-stack document extraction platform powered by Claude AI.
 
```
📄 PDF / Image / Text
        ↓ 
   OCR Pipeline
        ↓ 
  Claude AI Prompt 
        ↓  
  Validated JSON ✅
```   
  
## Project Structure

```
structuraid/
├── backend/               # FastAPI (Python)
│   ├── main.py            # API routes + job queue
│   ├── models.py          # Pydantic schemas
│   ├── services/
│   │   ├── extractor.py   # Claude AI + OCR pipeline
│   │   └── storage.py     # In-memory / Redis job store
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/              # Next.js 14
    ├── src/
    │   ├── app/           # App Router pages + layout
    │   ├── components/    # sections, layout, ui
    │   ├── store/         # Zustand state
    │   └── lib/           # API client
    ├── tailwind.config.js
    └── .env.local.example
```

## Quick Start

**Backend:**
```bash
cd backend
cp .env.example .env          # Add ANTHROPIC_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

## Supported Document Types

| Type | Fields Extracted |
|------|-----------------|
| Invoice | vendor, client, line items, totals, dates |
| Contract | parties, clauses, dates, obligations |
| Receipt | merchant, items, totals, payment method |
| Auto-detect | Any document — generic schema |

## Deployment

| Layer | Service |
|-------|---------|
| Frontend | Vercel (`vercel --prod`) |
| Backend | Railway (connect GitHub repo) |
| Job Queue | Redis add-on on Railway |

## Environment Variables

See `backend/.env.example` and `frontend/.env.local.example`.

The only required variable is `ANTHROPIC_API_KEY` on the backend.
