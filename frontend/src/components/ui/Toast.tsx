'use client'

import { useExtractionStore } from '@/store/extraction'

export function Toast() {
  const toast = useExtractionStore(s => s.toast)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: 'var(--surface2)',
        border: '1px solid rgba(0,229,255,0.4)',
        color: 'var(--cyan)',
        padding: '12px 20px',
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 13,
        zIndex: 1000,
        boxShadow: 'var(--glow-cyan)',
        transform: toast ? 'translateY(0)' : 'translateY(100px)',
        opacity: toast ? 1 : 0,
        transition: 'all 0.3s',
        pointerEvents: 'none',
      }}
    >
      {toast}
    </div>
  )
}
