'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const RED = '#E94560'
const NAVY = '#0f0f1a'
const CARD = '#12121f'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState('loading')
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setError('No session ID found.')
      return
    }

    fetch('/api/full-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setStatus('error')
          setError(data.error)
        } else {
          setReport(data.report)
          setStatus('done')
        }
      })
      .catch(err => {
        setStatus('error')
        setError('Failed to load your report. Please contact support.')
      })
  }, [sessionId])

  return (
    <div style={{ minHeight: '100vh', background: NAVY, color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* NAV */}
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <span style={{ fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>
          <span style={{ color: RED }}>🔥 Roast</span>In
        </span>
      </nav>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px' }}>
        {status === 'loading' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>⚙️</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Generating your full report…</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>
              Our AI is doing a deep dive on your profile. This takes about 30 seconds.
            </p>
            <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 48, height: 48, border: '4px solid rgba(255,255,255,0.1)',
                borderTopColor: RED, borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === 'error' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>❌</div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>Something went wrong</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, marginBottom: 32 }}>{error}</p>
            <a
              href="/"
              style={{
                display: 'inline-block', padding: '14px 32px', background: RED,
                color: '#fff', borderRadius: 10, fontWeight: 700, fontSize: 16,
                textDecoration: 'none'
              }}
            >
              Back to Home
            </a>
          </div>
        )}

        {status === 'done' && report && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Your Full LinkedIn Report</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18 }}>
                Here is your complete, section-by-section analysis with rewrites and action plan.
              </p>
            </div>

            <div style={{
              background: CARD,
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '40px 40px',
              lineHeight: 1.8,
              fontSize: 16,
              color: 'rgba(255,255,255,0.9)',
              whiteSpace: 'pre-wrap'
            }}>
              {report}
            </div>

            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <a
                href="/"
                style={{
                  display: 'inline-block', padding: '14px 32px',
                  background: 'transparent', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 10, fontWeight: 600, fontSize: 16,
                  textDecoration: 'none'
                }}
              >
                ← Roast another profile
              </a>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ textAlign: 'center', padding: '40px 24px', color: 'rgba(255,255,255,0.3)', fontSize: 14, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        🔥 RoastIn — Vibe Ventures · Your data is never stored.
      </footer>
    </div>
  )
}
