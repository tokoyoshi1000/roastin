'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const RED = '#E94560'
const NAVY = '#0f0f1a'
const CARD = '#12121f'
const BORDER = 'rgba(255,255,255,0.07)'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  async function generateReport() {
    if (!text.trim() || text.trim().length < 50) { setError('Please paste your LinkedIn profile text first.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/full-report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, sessionId }) })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setReport(data)
    } catch (err) { setError(err.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }
  return (
    <div style={{ minHeight: '100vh', background: NAVY, color: '#fff', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Payment confirmed!</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>Paste your LinkedIn profile below to generate your Full Report.</p>
        </div>
        {!report && (
          <div style={{ background: CARD, border: '1px solid ' + BORDER, borderRadius: 16, padding: 32 }}>
            <button onClick={() => setShowInstructions(!showInstructions)} style={{ background: 'none', border: '1px solid ' + BORDER, color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', marginBottom: 16 }}>
              {showInstructions ? '▲' : '▼'} How to copy your LinkedIn profile
            </button>
            {showInstructions && (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 16, marginBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                1. Open your LinkedIn profile → Press Ctrl+A → Ctrl+C → Paste below
              </div>
            )}
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your LinkedIn profile text here..."
              style={{ width: '100%', minHeight: 200, background: 'rgba(255,255,255,0.04)', border: '1px solid ' + BORDER, borderRadius: 10, color: '#fff', padding: 16, fontSize: 14, lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            {error && <p style={{ color: RED, marginTop: 8, fontSize: 14 }}>{error}</p>}
            <button onClick={generateReport} disabled={loading} style={{ width: '100%', marginTop: 16, padding: '16px', borderRadius: 10, background: loading ? 'rgba(233,69,96,0.5)' : RED, color: '#fff', border: 'none', fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Generating your Full Report...' : '🔥 Generate Full Report'}
            </button>
          </div>
        )}
        {report && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ background: CARD, border: '1px solid ' + BORDER, borderRadius: 16, padding: 32, textAlign: 'center' }}>
              <div style={{ fontSize: 72, fontWeight: 900, color: report.score >= 70 ? '#4ade80' : report.score >= 50 ? '#facc15' : RED }}>{report.score}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>/100 Profile Score</div>
            </div>
            <div style={{ background: CARD, border: '1px solid ' + BORDER, borderRadius: 16, padding: 28 }}>
              <h3 style={{ color: RED, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>🔥 The Roast</h3>
              <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0, fontSize: 16 }}>{report.roast}</p>
            </div>
            {report.breakdown && (
              <div style={{ background: CARD, border: '1px solid ' + BORDER, borderRadius: 16, padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📊 Detailed Breakdown</h3>
                {Object.entries(report.breakdown).map(([key, val]) => (
                  <div key={key} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid ' + BORDER }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{key === 'socialProof' ? 'Social Proof' : key}</span>
                      <span style={{ color: RED, fontWeight: 800 }}>{val.score}/25</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>{val.analysis}</p>
                    {val.rewrite && <div style={{ background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.2)', borderRadius: 8, padding: 12 }}><div style={{ fontSize: 11, color: RED, fontWeight: 700, marginBottom: 6 }}>✏️ SUGGESTED REWRITE</div><p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>{val.rewrite}</p></div>}
                  </div>
                ))}
              </div>
            )}
            {report.fullImprovements && (
              <div style={{ background: CARD, border: '1px solid ' + BORDER, borderRadius: 16, padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>⚡ 10 Specific Improvements</h3>
                {report.fullImprovements.map((item, i) => (<div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}><span style={{ color: RED, fontWeight: 800, minWidth: 24 }}>{i+1}.</span><span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.6 }}>{item}</span></div>))}
              </div>
            )}
            {report.actionPlan && (
              <div style={{ background: CARD, border: '1px solid ' + BORDER, borderRadius: 16, padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📅 4-Week Action Plan</h3>
                {Object.entries(report.actionPlan).map(([week, actions], wi) => (
                  <div key={week} style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: RED, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Week {wi+1}</div>
                    {actions.map((a, ai) => (<div key={ai} style={{ display: 'flex', gap: 10, marginBottom: 6 }}><span style={{ color: '#4ade80', fontSize: 12, marginTop: 3 }}>✓</span><span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.5 }}>{a}</span></div>))}
                  </div>
                ))}
              </div>
            )}
            {report.keywords && (
              <div style={{ background: CARD, border: '1px solid ' + BORDER, borderRadius: 16, padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔑 Keywords to Add</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {report.keywords.map((kw, i) => (<span key={i} style={{ background: 'rgba(233,69,96,0.12)', border: '1px solid rgba(233,69,96,0.25)', color: RED, borderRadius: 20, padding: '6px 14px', fontSize: 13, fontWeight: 600 }}>{kw}</span>))}
                </div>
              </div>
            )}
            <div style={{ textAlign: 'center', paddingBottom: 40 }}><a href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textDecoration: 'none' }}>← Back to RoastIn</a></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}