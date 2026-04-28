# StructurAId 🧠

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TailwindCSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Zustand-State_Management-443E38?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Groq-LLM_API-F55036?style=for-the-badge&logo=groq&logoColor=white" />
  <img src="https://img.shields.io/badge/OCR-Document_Parsing-8A2BE2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Pydantic-Validation-E92063?style=for-the-badge&logo=pydantic&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Redis-Queue_Storage-DC382D?style=for-the-badge&logo=redis&logoColor=white" />
</p>

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
