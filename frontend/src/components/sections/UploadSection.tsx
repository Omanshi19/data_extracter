'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { useExtractionStore } from '@/store/extraction'
import { uploadDocument, waitForJob } from '@/lib/api'

const tnr = '"Times New Roman", Times, serif'

const DOC_TYPES = [
  { id: 'invoice',       icon: '🧾', label: 'INVOICE' },
  { id: 'contract',      icon: '📜', label: 'CONTRACT' },
  { id: 'receipt',       icon: '🏪', label: 'RECEIPT' },
  { id: 'resume',        icon: '👤', label: 'RESUME' },
  { id: 'id_document',   icon: '🪪', label: 'ID DOC' },
  { id: 'bank_statement',icon: '🏦', label: 'BANK STMT' },
  { id: 'auto',          icon: '🤖', label: 'AUTO-DETECT' },
] as const

export function UploadSection() {
  const { file, docType, setFile, setDocType, setPhase, setJobId, setResult, showToast } = useExtractionStore()
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted[0]) {
      setFile(accepted[0])
      showToast('File loaded: ' + accepted[0].name)
    }
    setIsDragging(false)
  }, [setFile, showToast])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: { 'application/pdf': [], 'image/*': [], 'text/plain': [], 'text/csv': [] },
    multiple: false,
  })

  const fileIcon: Record<string, string> = { pdf: '📄', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', txt: '📝', csv: '📊' }

  async function handleExtract() {
    if (!file) { showToast('Please upload a document first'); return }

    setPhase('processing')
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      const { job_id } = await uploadDocument(file, docType)
      setJobId(job_id)
      const result = await waitForJob(job_id, () => {})
      setResult(result as Record<string, unknown>)
      setPhase('results')
    } catch (err: unknown) {
      showToast('Extraction failed — check console')
      console.error(err)
      setPhase('upload')
    }
  }

  return (
    <section
      id="upload"
      style={{ position: 'relative', zIndex: 1, padding: '48px 24px 60px', maxWidth: 900, margin: '0 auto' }}
    >
      {/* Section tag */}
      <div style={{ fontFamily: tnr, fontSize: 15, color: 'var(--cyan)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8, fontStyle: 'italic' }}>
        <span style={{ color: 'var(--muted)', fontStyle: 'normal' }}>//</span>
        Document Upload
      </div>

      <h2 style={{ fontFamily: tnr, fontSize: 34, fontWeight: 700, marginBottom: 28, letterSpacing: '-0.5px', lineHeight: 1.15 }}>
        Drop the Doc.<br /><span style={{ color: 'var(--pink)' }}>We&apos;ll Do the Rest.</span>
      </h2>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--pink)' : 'var(--purple)'}`,
          padding: '52px 40px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragging ? 'rgba(255,45,120,0.05)' : 'var(--surface)',
          boxShadow: isDragging ? 'inset 0 0 40px rgba(255,45,120,0.05), var(--glow-pink)' : 'none',
          transition: 'all 0.3s',
          clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: 44, marginBottom: 14, animation: 'iconBounce 2s ease-in-out infinite' }}>📄</div>
        <div style={{ fontFamily: tnr, fontSize: 19, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>
          DRAG &amp; DROP OR CLICK TO UPLOAD
        </div>
        <div style={{ fontFamily: tnr, fontSize: 15, color: 'var(--muted)' }}>
          Intelligence kicks in the moment it lands here
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
          {['PDF', 'PNG', 'JPG', 'TXT', 'CSV'].map(t => (
            <span key={t} style={{ padding: '4px 10px', fontFamily: tnr, fontSize: 12, letterSpacing: 1, border: '1px solid var(--border)', color: 'var(--muted)', background: 'var(--surface2)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* File preview */}
      {file && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 16, padding: 16, background: 'var(--surface2)', border: '1px solid rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', gap: 16 }}
        >
          <div style={{ fontSize: 26 }}>{fileIcon[file.name.split('.').pop()?.toLowerCase() ?? ''] ?? '📄'}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: tnr, fontSize: 15, fontWeight: 700, color: 'var(--cyan)' }}>{file.name}</div>
            <div style={{ fontFamily: tnr, fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
              {(file.size / 1048576).toFixed(1)} MB · Ready for extraction
            </div>
          </div>
          <button
            onClick={e => { e.stopPropagation(); setFile(null) }}
            style={{ background: 'none', border: '1px solid rgba(255,45,120,0.3)', color: 'var(--pink)', padding: '6px 12px', cursor: 'pointer', fontFamily: tnr, fontSize: 12, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--pink)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--pink)' }}
          >
            ✕ REMOVE
          </button>
        </motion.div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--purple), var(--pink), var(--cyan), transparent)', margin: '22px 0', opacity: 0.4 }} />

      {/* Doc type */}
      <div style={{ fontFamily: tnr, fontSize: 15, color: 'var(--cyan)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8, fontStyle: 'italic' }}>
        <span style={{ color: 'var(--muted)', fontStyle: 'normal' }}>//</span>
        Document Type
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
        {DOC_TYPES.map(dt => (
          <button
            key={dt.id}
            onClick={() => setDocType(dt.id)}
            style={{
              padding: '14px 8px',
              background: docType === dt.id ? 'rgba(255,45,120,0.08)' : 'var(--surface)',
              border: `1px solid ${docType === dt.id ? 'var(--pink)' : 'var(--border)'}`,
              color: docType === dt.id ? 'var(--pink)' : 'var(--muted)',
              cursor: 'pointer',
              fontFamily: tnr,
              fontSize: 13,
              fontWeight: docType === dt.id ? 700 : 400,
              transition: 'all 0.2s',
              boxShadow: docType === dt.id ? 'var(--glow-pink)' : 'none',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{dt.icon}</div>
            {dt.label}
            {docType === dt.id && (
              <span style={{ position: 'absolute', top: 6, right: 8, fontSize: 11, color: 'var(--pink)' }}>✓</span>
            )}
          </button>
        ))}
      </div>

      {/* Process button */}
      <motion.button
        whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(255,45,120,0.4)' }}
        whileTap={{ scale: 0.98 }}
        onClick={handleExtract}
        style={{
          width: '100%',
          padding: '16px',
          background: 'linear-gradient(135deg, var(--pink), var(--purple))',
          border: 'none',
          color: '#fff',
          fontFamily: tnr,
          fontWeight: 700,
          fontSize: 16,
          cursor: 'pointer',
          letterSpacing: '0.5px',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
      >
        ⚡ EXTRACT STRUCTURED DATA →
      </motion.button>
    </section>
  )
}
