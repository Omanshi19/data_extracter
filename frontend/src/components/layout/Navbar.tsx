'use client'

import { useExtractionStore } from '@/store/extraction'

export function Navbar() {
  const phase = useExtractionStore(s => s.phase)

  const scrollToUpload = () => {
    if (phase === 'landing' || phase === 'upload') {
      document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 32px',
        background: 'rgba(5,5,8,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(160,32,240,0.25)',
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.5px' }}>
        struct<span style={{ color: 'var(--pink)' }}>ur</span>a
        <em style={{ color: 'var(--cyan)', fontStyle: 'italic' }}>id</em>
      </div>

      <button
        onClick={scrollToUpload}
        style={{
          background: 'rgba(255,45,120,0.1)',
          border: '1px solid rgba(255,45,120,0.3)',
          color: 'var(--pink)',
          padding: '7px 18px',
          borderRadius: 100,
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: '"Times New Roman", Times, serif',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.background = 'var(--pink)'
          el.style.color = '#fff'
          el.style.boxShadow = 'var(--glow-pink)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.background = 'rgba(255,45,120,0.1)'
          el.style.color = 'var(--pink)'
          el.style.boxShadow = 'none'
        }}
      >
        ↗ START EXTRACTING
      </button>
    </nav>
  )
}
