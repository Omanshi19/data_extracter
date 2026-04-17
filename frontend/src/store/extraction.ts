import { create } from 'zustand'

export type AppPhase = 'landing' | 'upload' | 'processing' | 'results'
export type DocType = 'invoice' | 'contract' | 'receipt' | 'resume' | 'id_document' | 'bank_statement' | 'auto'

interface ExtractionState {
  phase: AppPhase
  file: File | null
  docType: DocType
  jobId: string | null
  result: Record<string, unknown> | null
  confidence: number
  toast: string

  setPhase: (p: AppPhase) => void
  setFile: (f: File | null) => void
  setDocType: (t: DocType) => void
  setJobId: (id: string | null) => void
  setResult: (r: Record<string, unknown> | null) => void
  setConfidence: (c: number) => void
  showToast: (msg: string) => void
  reset: () => void
}

export const useExtractionStore = create<ExtractionState>((set) => ({
  phase: 'landing',
  file: null,
  docType: 'invoice',
  jobId: null,
  result: null,
  confidence: 0,
  toast: '',

  setPhase: (phase) => set({ phase }),
  setFile: (file) => set({ file }),
  setDocType: (docType) => set({ docType }),
  setJobId: (jobId) => set({ jobId }),
  setResult: (result) => set({ result }),
  setConfidence: (confidence) => set({ confidence }),
  showToast: (toast) => {
    set({ toast })
    setTimeout(() => set({ toast: '' }), 3000)
  },
  reset: () => set({ phase: 'landing', file: null, jobId: null, result: null, confidence: 0 }),
}))
