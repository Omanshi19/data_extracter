import axios from 'axios'

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const api = axios.create({ baseURL: BASE, timeout: 30_000 })

export async function uploadDocument(file: File, docType: string, customSchema?: string) {
  const form = new FormData()
  form.append('file', file)
  form.append('document_type', docType)
  if (customSchema) form.append('custom_schema', customSchema)
  const { data } = await api.post('/extract', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function pollJob(jobId: string) {
  const { data } = await api.get(`/jobs/${jobId}`)
  return data
}

export async function waitForJob(
  jobId: string,
  onStep: (status: string) => void,
  maxWait = 120_000,
): Promise<Record<string, unknown>> {
  const start = Date.now()
  while (Date.now() - start < maxWait) {
    const job = await pollJob(jobId)
    onStep(job.status)
    if (job.status === 'done') return job.result
    if (job.status === 'failed') throw new Error(job.error || 'Extraction failed')
    await new Promise(r => setTimeout(r, 1500))
  }
  throw new Error('Extraction timed out')
}

export async function exportJob(jobId: string, format: 'json' | 'csv') {
  const { data } = await api.get(`/jobs/${jobId}/export/${format}`)
  return data
}
