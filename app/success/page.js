'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const RED = '#E94560'
const NAVY = '#0f0f1a'
const CARD = '#12121f'
const GREEN = '#22c55e'
const AMBER = '#f59e0b'

function ScoreBar({ label, score, max = 25 }) {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 70 ? GREEN : pct >= 45 ? AMBER : RED
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{score}/{max}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
        <div style={{ height: 6, width: pct + '%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState('loading')
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setError('No session ID found. Please try again.')
      return
    }
    const profileText = typeof window !== 'undefined' ? localStorage.getItem('roastin_profile') : null
    if (!profileText) {
      setStatus('error')
      setError('Profile text not found. Please go back and try again.')
      return
    }
    fetch('/api/full-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: profileText, sessionId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) { setStatus('error'); setError(data.error) }
        else { setReport(data); setStatus('done') }
      })
      .catch(() => { setStatus('error'); setError('Failed to generate report. Please contact support.') })
  }, [sessionId])

  if (status === 'loading') return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>⚙️</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Generating your full report…</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginBottom: 40 }}>
        Our AI is doing a deep dive on your profile. This takes about 30 seconds.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)', borderTopColor: RED, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (status === 'error') return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>❌</div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Something went wrong</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginBottom: 32 }}>{error}</p>
      <a href="/" style={{ display: 'inline-block', padding: '14px 32px', background: RED, color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Back to Home</a>
    </div>
  )

  if (status === 'done' && report) {
    const scoreColor = report.score >= 70 ? GREEN : report.score >= 45 ? AMBER : RED
    return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        {/* Score */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 8 }}>Your Full LinkedIn Report</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 32 }}>Section-by-section breakdown with rewrites, 10 improvements, and 4-week action plan</p>
          <div style={{ display: 'inline-block', background: CARD, border: `2px solid ${scoreColor}`, borderRadius: 16, padding: '24px 48px' }}>
            <div style={{ fontSize: 72, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{report.score}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 }}>Profile Score</div>
          </div>
        </div>

        {/* Score Breakdown */}
        {report.breakdown && (
          <div style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '28px', marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: RED }}>📊 Score Breakdown</h2>
            <ScoreBar label="Headline" score={report.breakdown.headline?.score ?? 0} />
            <ScoreBar label="About / Summary" score={report.breakdown.about?.score ?? 0} />
            <ScoreBar label="Experience" score={report.breakdown.experience?.score ?? 0} />
            <ScoreBar label="Social Proof" score={report.breakdown.socialProof?.score ?? 0} />
          </div>
        )}

        {/* Roast */}
        {report.roast && (
          <div style={{ background: 'rgba(233,69,96,0.08)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: 16, padding: '24px 28px', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: RED, letterSpacing: 1, marginBottom: 12 }}>🔥 THE ROAST</div>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', margin: 0 }}>"{report.roast}"</p>
          </div>
        )}

        {/* Section Analysis */}
        {report.breakdown && ['headline', 'about', 'experience', 'socialProof'].map(key => {
          const s = report.breakdown[key]
          if (!s) return null
          const labels = { headline: 'Headline', about: 'About / Summary', experience: 'Experience', socialProof: 'Social Proof' }
          return (
            <div key={key} style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12, color: '#fff' }}>📝 {labels[key]}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 16 }}>{s.analysis}</p>
              {s.rewrite && (
                <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '12px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, letterSpacing: 1, marginBottom: 6 }}>✅ SUGGESTED REWRITE</div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6 }}>{s.rewrite}</p>
                </div>
              )}
              {(s.improvements || s.suggestions) && (
                <ul style={{ margin: '12px 0 0', paddingLeft: 20 }}>
                  {(s.improvements || s.suggestions).map((item, i) => (
                    <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 4 }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}

        {/* 10 Improvements */}
        {report.fullImprovements?.length > 0 && (
          <div style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: RED }}>⚡ 10 Specific Improvements</h2>
            {report.fullImprovements.map((imp, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <span style={{ color: RED, fontWeight: 700, minWidth: 24, fontSize: 14 }}>{i + 1}.</span>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{imp}</span>
              </div>
            ))}
          </div>
        )}

        {/* 4-Week Action Plan */}
        {report.actionPlan && (
          <div style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: RED }}>📅 4-Week Action Plan</h2>
            {[1, 2, 3, 4].map(w => {
              const actions = report.actionPlan['week' + w]
              if (!actions?.length) return null
              return (
                <div key={w} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: AMBER, marginBottom: 8 }}>WEEK {w}</div>
                  {actions.map((a, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
                      <span style={{ color: AMBER, fontSize: 14, marginTop: 2 }}>→</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{a}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {/* Keywords */}
        {report.keywords?.length > 0 && (
          <div style={{ background: CARD, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '24px 28px', marginBottom: 40 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: RED }}>🔑 Keywords to Add</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {report.keywords.map((kw, i) => (
                <span key={i} style={{ background: 'rgba(233,69,96,0.12)', border: '1px solid rgba(233,69,96,0.3)', borderRadius: 20, padding: '6px 14px', fontSize: 13, color: RED, fontWeight: 600 }}>{kw}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ display: 'inline-block', padding: '14px 32px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: 'none' }}>← Roast another profile</a>
        </div>
      </div>
    )
  }
  return null
}

export default function SuccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: NAVY, color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>
          <span style={{ color: RED }}>🔥 Roast</span>In
        </span>
      </nav>
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '80px 24px', color: 'rgba(255,255,255,0.5)' }}>Loading…</div>}>
        <SuccessContent />
      </Suspense>
      <footer style={{ textAlign: 'center', padding: '40px 24px', color: 'rgba(255,255,255,0.3)', fontSize: 14, borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 40 }}>
        🔥 RoastIn — Vibe Ventures · Your data is never stored.
      </footer>
    </div>
  )
}
