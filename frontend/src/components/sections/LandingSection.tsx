'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

const tnr = '"Times New Roman", Times, serif'

export function LandingSection() {
  const particleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = particleRef.current
    if (!container) return
    const colors = ['#ff2d78', '#a020f0', '#00e5ff', '#ffe500']
    for (let i = 0; i < 28; i++) {
      const p = document.createElement('div')
      const size = Math.random() * 5 + 2
      Object.assign(p.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: colors[Math.floor(Math.random() * colors.length)],
        borderRadius: '50%',
        left: `${Math.random() * 100}%`,
        animation: `particleDrift ${Math.random() * 15 + 10}s linear ${-Math.random() * 20}s infinite`,
        opacity: '0',
      })
      container.appendChild(p)
    }
    return () => { container.innerHTML = '' }
  }, [])

  const scrollToUpload = () =>
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 40px',
        textAlign: 'center',
        zIndex: 1,
      }}
    >
      <div
        ref={particleRef}
        style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
      />

      {/* Mascot */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        style={{ marginBottom: 24, animation: 'mascotFloat 3s ease-in-out infinite' }}
      >
        <Mascot />
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: tnr,
          fontWeight: 700,
          fontSize: 'clamp(38px, 6vw, 72px)',
          lineHeight: 1.05,
          letterSpacing: '-1px',
          maxWidth: 800,
          marginBottom: 18,
        }}
      >
        Turn <span style={{ color: 'var(--pink)' }}>Chaos</span>
        <br />
        into <span style={{ color: 'var(--cyan)' }}>Structure</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontFamily: tnr,
          fontSize: 16,
          color: 'var(--muted)',
          maxWidth: 520,
          lineHeight: 1.7,
          marginBottom: 32,
        }}
      >
        Feed it invoices, contracts, receipts — anything. Watch our AI rip out every
        meaningful piece of data and hand it back as clean, validated JSON.
        No mess. No manual entry. Just signal.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={scrollToUpload}
        style={{
          fontFamily: tnr,
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: '0.5px',
          padding: '14px 36px',
          background: 'transparent',
          border: '2px solid var(--pink)',
          color: 'var(--pink)',
          cursor: 'pointer',
          transition: 'all 0.3s',
          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget
          el.style.background = 'var(--pink)'
          el.style.color = '#fff'
          el.style.boxShadow = 'var(--glow-pink)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget
          el.style.background = 'transparent'
          el.style.color = 'var(--pink)'
          el.style.boxShadow = 'none'
        }}
      >
        ⚡ EXTRACT DATA NOW
      </motion.button>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', gap: 20, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            style={{
              textAlign: 'center',
              padding: '18px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: 2,
                background: 'linear-gradient(90deg, var(--purple), var(--pink))',
              }}
            />
            <div style={{ fontFamily: tnr, fontSize: 28, fontWeight: 700, color: 'var(--pink)' }}>
              {s.value}
            </div>
            {/* Label — larger, brighter */}
            <div style={{ fontFamily: tnr, fontSize: 13, color: 'var(--muted)', marginTop: 6, letterSpacing: '0.5px' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

const STATS = [
  { value: '99.2%', label: 'EXTRACTION ACCURACY' },
  { value: '<3s',   label: 'AVG PROCESSING TIME' },
  { value: '12+',   label: 'DOCUMENT TYPES' },
  { value: '∞',     label: 'SCHEMA FLEXIBILITY' },
]

function Mascot() {
  return (
    <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto' }}>
      {/* Antenna */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 2, height: 20, top: -20, background: 'var(--purple)' }}>
        <div style={{ position: 'absolute', top: -6, left: -5, width: 12, height: 12, borderRadius: '50%', background: 'var(--pink)', boxShadow: 'var(--glow-pink)', animation: 'antennaPulse 1.5s ease-in-out infinite' }} />
      </div>
      {/* Face */}
      <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #13131e 0%, #1a1a2e 100%)', border: '2px solid var(--purple)', boxShadow: 'var(--glow-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Eyes */}
        <div style={{ position: 'absolute', display: 'flex', gap: 18, top: 35 }}>
          {[0, 1].map(i => (
            <div key={i} style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--cyan)', boxShadow: 'var(--glow-cyan)', animation: `blink 4s ease-in-out ${i * 0.2}s infinite`, position: 'relative' }}>
              <div style={{ position: 'absolute', width: 6, height: 6, background: '#050508', borderRadius: '50%', top: 4, left: 4 }} />
            </div>
          ))}
        </div>
        {/* Mouth */}
        <div style={{ position: 'absolute', bottom: 26, width: 30, height: 14, borderBottom: '3px solid var(--pink)', borderRadius: '0 0 15px 15px', boxShadow: '0 0 10px rgba(255,45,120,0.5)' }} />
      </div>
    </div>
  )
}
