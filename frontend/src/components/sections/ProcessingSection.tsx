'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const tnr = '"Times New Roman", Times, serif'

const STEPS = [
  { icon: '📤', label: 'Document ingestion' },
  { icon: '🔍', label: 'OCR & text extraction' },
  { icon: '🧠', label: 'LLM analysis' },
  { icon: '🗂️', label: 'Schema validation' },
  { icon: '✅', label: 'Structuring output' },
]

const STEP_LABELS = [
  'Ingesting document...',
  'Running OCR pipeline...',
  'Sending to AI model...',
  'Validating JSON schema...',
  'Finalizing output...',
]

export function ProcessingSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let step = 0
    const tick = () => {
      if (step >= STEPS.length) return
      setActiveStep(step)
      setProgress(Math.round(((step + 1) / STEPS.length) * 100))
      step++
      setTimeout(tick, 900 + Math.random() * 500)
    }
    tick()
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ position: 'relative', zIndex: 1, padding: '80px 24px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}
    >
      {/* Spinner */}
      <div style={{ width: 160, height: 160, margin: '0 auto 28px', position: 'relative' }}>
        {[
          { inset: 0, color: 'var(--pink)', dur: '1.2s' },
          { inset: 10, color: 'var(--purple)', dur: '1.8s' },
          { inset: 20, color: 'var(--cyan)', dur: '2.4s', reverse: true },
        ].map((ring, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: ring.inset,
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: ring.color,
              animation: `spin ${ring.dur} linear ${ring.reverse ? 'reverse' : ''} infinite`,
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            inset: 30,
            borderRadius: '50%',
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            animation: 'coreGlow 2s ease-in-out infinite',
          }}
        >
          🧠
        </div>
      </div>

      <h2 style={{ fontFamily: tnr, fontSize: 26, fontWeight: 700, marginBottom: 8 }}>AI IS THINKING</h2>
      <div style={{ fontFamily: tnr, fontSize: 14, color: 'var(--cyan)', marginBottom: 28, minHeight: 20 }}>
        {STEP_LABELS[activeStep] ?? 'Processing...'}
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'var(--surface2)', marginBottom: 24, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', background: 'linear-gradient(90deg, var(--pink), var(--cyan))', boxShadow: '0 0 10px rgba(0,229,255,0.5)' }}
        />
      </div>

      {/* Steps list */}
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, textAlign: 'left' }}>
        {STEPS.map((s, i) => {
          const done = i < activeStep
          const active = i === activeStep
          return (
            <li
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 16px',
                background: active ? 'rgba(255,45,120,0.08)' : 'var(--surface)',
                borderLeft: `2px solid ${done ? 'var(--cyan)' : active ? 'var(--pink)' : 'var(--border)'}`,
                fontFamily: tnr,
                fontSize: 14,
                color: done ? 'var(--text)' : active ? 'var(--pink)' : 'var(--muted)',
                transition: 'all 0.3s',
              }}
            >
              <span style={{ width: 20, textAlign: 'center' }}>{done ? '✓' : s.icon}</span>
              {s.label}
            </li>
          )
        })}
      </ul>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.section>
  )
}
