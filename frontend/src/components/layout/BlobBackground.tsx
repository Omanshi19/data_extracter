'use client'

export function BlobBackground() {
  return (
    <div
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}
      aria-hidden
    >
      {[
        { w: 500, h: 500, color: '#a020f0', top: '-200px', left: '-100px', delay: '0s' },
        { w: 400, h: 400, color: '#ff2d78', top: '30%', right: '-150px', delay: '-4s' },
        { w: 300, h: 300, color: '#00e5ff', bottom: '-100px', left: '30%', delay: '-8s' },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: b.w,
            height: b.h,
            borderRadius: '50%',
            background: b.color,
            filter: 'blur(80px)',
            opacity: 0.12,
            top: b.top,
            left: b.left,
            right: b.right,
            bottom: b.bottom,
            animation: `blobFloat 12s ease-in-out ${b.delay} infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-40px) scale(1.08); }
          66% { transform: translate(-20px,30px) scale(0.95); }
        }
      `}</style>
    </div>
  )
}
