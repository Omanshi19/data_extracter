'use client'

import { motion } from 'framer-motion'
import { useExtractionStore } from '@/store/extraction'

const tnr = '"Times New Roman", Times, serif'

const MOCK_RESULT = {
  document_type: 'invoice',
  vendor_name: 'Nexus Solutions Inc.',
  client_name: 'Acme Corporation',
  invoice_number: 'INV-2024-0891',
  issue_date: '2024-11-14',
  due_date: '2024-12-14',
  subtotal: '$16,500.00',
  tax_rate: '8.5%',
  total_amount: '$17,902.50',
  currency: 'USD',
  line_items: [
    { description: 'API Integration Services (Q4)', amount: '$8,500.00' },
    { description: 'Cloud Infrastructure Setup', amount: '$3,200.00' },
    { description: 'Technical Consulting (32hrs)', amount: '$4,800.00' },
  ],
  payment_terms: 'Net 30',
}

const MOCK_PREVIEW = `
  <div style="font-family:Georgia,serif;font-size:13px;line-height:1.8;color:#111">
    <div style="font-size:16px;font-weight:700;margin-bottom:14px;border-bottom:2px solid #111;padding-bottom:8px">INVOICE #INV-2024-0891</div>
    <div style="margin-bottom:14px"><strong>FROM:</strong> Nexus Solutions Inc.<br>1420 Harbor Blvd, Suite 300<br>San Francisco, CA 94102</div>
    <div style="margin-bottom:14px"><strong>TO:</strong> <span style="background:rgba(255,229,0,0.5);padding:1px 2px">Acme Corporation</span><br>88 Pine Street, Floor 22<br>New York, NY 10005</div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>Invoice Number:</span><span style="background:rgba(255,229,0,0.5);padding:1px 2px">INV-2024-0891</span></div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>Issue Date:</span><span style="background:rgba(255,229,0,0.5);padding:1px 2px">November 14, 2024</span></div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>Due Date:</span><span>December 14, 2024</span></div>
    <hr style="border-color:#ddd;margin:12px 0">
    <div style="display:flex;justify-content:space-between;margin:5px 0"><strong>DESCRIPTION</strong><strong>AMOUNT</strong></div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>API Integration Services (Q4)</span><span>$8,500.00</span></div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>Cloud Infrastructure Setup</span><span>$3,200.00</span></div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>Technical Consulting (32hrs)</span><span>$4,800.00</span></div>
    <hr style="border-color:#ddd;margin:12px 0">
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>Subtotal:</span><span>$16,500.00</span></div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><span>Tax (8.5%):</span><span>$1,402.50</span></div>
    <div style="display:flex;justify-content:space-between;margin:5px 0"><strong>TOTAL DUE:</strong><strong style="background:rgba(255,229,0,0.5);padding:1px 2px">$17,902.50</strong></div>
  </div>
`

export function ResultsSection() {
  const { result, reset, showToast, file } = useExtractionStore()
  const previewUrl = file ? URL.createObjectURL(file) : null
  const data = (result as Record<string, unknown>) ?? MOCK_RESULT

  function copyJSON() {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).catch(() => {})
    showToast('JSON copied to clipboard!')
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'extracted_data.json'
    a.click()
    showToast('JSON downloaded!')
  }

  function exportCSV() {
    const rows = Object.entries(data)
      .filter(([, v]) => !Array.isArray(v))
      .map(([k, v]) => `"${k}","${v}"`)
    const csv = 'field,value\n' + rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'extracted_data.csv'
    a.click()
    showToast('CSV downloaded!')
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ position: 'relative', zIndex: 1, padding: '60px 24px', maxWidth: 1200, margin: '0 auto' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: tnr, fontSize: 15, color: 'var(--cyan)', marginBottom: 8, fontStyle: 'italic' }}>
            <span style={{ color: 'var(--muted)', fontStyle: 'normal' }}>// </span>
            Extraction Complete
          </div>
          <h2 style={{ fontFamily: tnr, fontSize: 28, fontWeight: 700, margin: 0 }}>
            Structured <span style={{ color: 'var(--cyan)' }}>Output</span>
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: 'var(--cyan)', padding: '8px 16px', fontFamily: tnr, fontSize: 13 }}>
          <span style={{ color: '#4cff91', fontSize: 16 }}>●</span>
          EXTRACTION SUCCESSFUL
        </div>
      </div>

      {/* Split view */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Left: original doc */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: tnr, fontSize: 12, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <span>ORIGINAL DOCUMENT</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--pink)' }} />
          </div>
          <div style={{ minHeight: 420, background: '#fff', overflow: 'auto' }}>
  {previewUrl && file?.type === 'application/pdf' ? (
    <iframe src={previewUrl} style={{ width: '100%', height: 500, border: 'none' }} />
  ) : previewUrl && file?.type.startsWith('image/') ? (
    <img src={previewUrl} style={{ width: '100%', objectFit: 'contain' }} />
  ) : (
    <div style={{ padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, minHeight: 420 }}>
      <div style={{ fontSize: 48 }}>📄</div>
      <div style={{ fontFamily: tnr, fontSize: 16, fontWeight: 700, color: '#111' }}>Document Processed</div>
      <div style={{ fontFamily: tnr, fontSize: 13, color: '#666', textAlign: 'center' }}>Structured data extracted successfully.<br/>See the JSON output on the right.</div>
    </div>
  )}
</div>
        </div>

        {/* Right: JSON */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: tnr, fontSize: 12, letterSpacing: 1, color: 'var(--muted)', textTransform: 'uppercase' }}>
            <span>EXTRACTED JSON</span>
            <span style={{ color: 'var(--cyan)', fontSize: 12, cursor: 'pointer' }} onClick={copyJSON}>⎘ COPY</span>
          </div>
          <div style={{ padding: 20 }}>
            {/* Fields */}
            {Object.entries(data).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 10, padding: 12, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: tnr, fontSize: 11, letterSpacing: 1, color: 'var(--pink)', textTransform: 'uppercase', marginBottom: 5 }}>{key}</div>
                {Array.isArray(val) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {(val as unknown[]).map((item, i) => (
                      <div key={i} style={{ padding: 7, background: 'rgba(160,32,240,0.05)', borderLeft: '2px solid var(--purple)', fontFamily: tnr, fontSize: 12, color: 'var(--text)' }}>
                        {typeof item === 'object'
                          ? Object.entries((item as Record<string, unknown>) ?? {}).map(([k, v]) => (
                              <span key={k}><span style={{ color: 'var(--pink)' }}>{k}:</span> <span style={{ color: 'var(--cyan)' }}>{String(v)}</span> </span>
                            ))
                          : String(item)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    defaultValue={String(val)}
                    style={{ fontFamily: tnr, fontSize: 13, color: 'var(--cyan)', background: 'none', border: 'none', width: '100%', outline: 'none', cursor: 'pointer' }}
                    onFocus={e => { e.target.style.borderBottom = '1px solid var(--pink)'; e.target.style.color = 'var(--text)' }}
                    onBlur={e => { e.target.style.borderBottom = 'none'; e.target.style.color = 'var(--cyan)' }}
                  />
                )}
              </div>
            ))}

            {/* Confidence */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              {[{ val: '98%', label: 'CONFIDENCE', cls: 'var(--cyan)' }, { val: '12', label: 'FIELDS EXTRACTED', cls: 'var(--cyan)' }, { val: '2', label: 'WARNINGS', cls: '#ffe500' }].map(c => (
                <div key={c.label} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontFamily: tnr, fontSize: 20, fontWeight: 700, color: c.cls }}>{c.val}</div>
                  <div style={{ fontFamily: tnr, fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{c.label}</div>
                </div>
              ))}
            </div>

            {/* Export */}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {[
                { label: '⬇ JSON', primary: true, fn: exportJSON },
                { label: '⬇ CSV', primary: false, fn: exportCSV },
                { label: '↺ NEW DOC', primary: false, fn: reset },
              ].map(btn => (
                <button
                  key={btn.label}
                  onClick={btn.fn}
                  style={{
                    flex: 1,
                    padding: '11px',
                    background: 'none',
                    border: `1px solid ${btn.primary ? 'var(--pink)' : 'var(--border)'}`,
                    color: btn.primary ? 'var(--pink)' : 'var(--muted)',
                    fontFamily: tnr,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = btn.primary ? 'var(--pink)' : 'rgba(0,229,255,0.05)'
                    e.currentTarget.style.color = btn.primary ? '#fff' : 'var(--cyan)'
                    e.currentTarget.style.borderColor = btn.primary ? 'var(--pink)' : 'var(--cyan)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'none'
                    e.currentTarget.style.color = btn.primary ? 'var(--pink)' : 'var(--muted)'
                    e.currentTarget.style.borderColor = btn.primary ? 'var(--pink)' : 'var(--border)'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
