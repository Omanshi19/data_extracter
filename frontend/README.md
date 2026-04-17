# StructurAId — Frontend

Next.js 14 app with cyberpunk UI, Framer Motion animations, Times New Roman typography.

## Quick Start

```bash
cd frontend
cp .env.local.example .env.local   # Set NEXT_PUBLIC_API_URL
npm install
npm run dev
# → http://localhost:3000
```

## Stack

- **Next.js 14** (App Router)
- **Tailwind CSS** (custom cyberpunk tokens)
- **Framer Motion** (page transitions, micro-interactions)
- **Zustand** (global state: phase, file, result)
- **react-dropzone** (drag-and-drop upload)
- **axios** (API client with polling)

## App Flow

```
landing → upload → processing (polls backend) → results
```

State is managed in `src/store/extraction.ts`.
API calls live in `src/lib/api.ts` — swap `NEXT_PUBLIC_API_URL` to point to any backend.

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
# Add NEXT_PUBLIC_API_URL in Vercel dashboard → Environment Variables
```
