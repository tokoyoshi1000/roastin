'use client'
import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* HERO */}
      <section style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '60px 20px', textAlign: 'center'
      }}>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 3, color: '#E94560', marginBottom: 16, textTransform: 'uppercase' }}>
          🔥 AI-Powered LinkedIn Analysis
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 800, lineHeight: 1.1, maxWidth: 700, marginBottom: 20 }}>
          Your LinkedIn profile is{' '}
          <span style={{ color: '#E94560' }}>costing you deals.</span>
        </h1>

        <p style={{ fontSize: 18, color: '#8892a4', maxWidth: 480, lineHeight: 1.6, marginBottom: 48 }}>
          Paste your LinkedIn URL. Get brutally honest AI feedback + a concrete action plan in 60 seconds. Free.
        </p>

        {/* FORM */}
        {!result && (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 520 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                style={{
                  flex: 1, minWidth: 260, padding: '14px 18px', borderRadius: 10,
                  border: '1px solid #ffffff20', background: '#16213e', color: '#e8eaf6',
                  fontSize: 15, outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px 28px', borderRadius: 10, border: 'none',
                  background: loading ? '#555' : '#E94560', color: 'white',
                  fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {loading ? 'Roasting... 🔥' : 'Roast me →'}
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#555', marginTop: 10 }}>
              No login required. We only read your public profile.
            </p>
          </form>
        )}

        {/* ERROR */}
        {error && (
          <div style={{
            marginTop: 24, padding: '16px 24px', background: '#E9456015',
            border: '1px solid #E9456040', borderRadius: 10, color: '#E94560', maxWidth: 520
          }}>
            {error}
          </div>
        )}

        {/* RESULT */}
        {result && <RoastResult result={result} url={url} onReset={() => { setResult(null); setUrl('') }} />}

        {/* SOCIAL PROOF */}
        {!result && (
          <div style={{ marginTop: 48, display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { stat: '60s', label: 'Average analysis time' },
              { stat: 'Free', label: 'Basic roast' },
              { stat: '€9', label: 'Full report' },
            ].map(({ stat, label }) => (
              <div key={stat} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#E94560' }}>{stat}</div>
                <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      {!result && (
        <section style={{ padding: '60px 20px', background: '#16213e', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 40 }}>How it works</h2>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 800, margin: '0 auto' }}>
            {[
              { step: '1', title: 'Paste your URL', desc: 'Enter your LinkedIn profile URL. We fetch your public profile data.' },
              { step: '2', title: 'AI roasts your profile', desc: 'Our AI analyzes your headline, summary, experience, and social proof.' },
              { step: '3', title: 'Get your action plan', desc: 'Receive a score, a roast, and a concrete list of improvements to make today.' },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{ flex: 1, minWidth: 200, maxWidth: 240 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#E94560', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, margin: '0 auto 16px' }}>{step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#8892a4', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #ffffff10' }}>
        <span style={{ fontSize: 12, color: '#333' }}>
          RoastIn — A <span style={{ color: '#E94560' }}>Vibe Ventures</span> product
        </span>
      </footer>
    </main>
  )
}

function RoastResult({ result, url, onReset }) {
  const shareText = result.shareText || `RoastIn gave my LinkedIn a ${result.score}/100. Time to fix that. 🔥`

  return (
    <div style={{ width: '100%', maxWidth: 680, textAlign: 'left', marginTop: 32 }}>

      {/* SCORE */}
      <div style={{
        background: '#16213e', border: '1px solid #E9456040', borderRadius: 14,
        padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: '#E94560', lineHeight: 1 }}>{result.score}</div>
          <div style={{ fontSize: 12, color: '#8892a4', marginTop: 4 }}>/ 100</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Your Profile Score</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {result.categoryScores && Object.entries(result.categoryScores).map(([cat, score]) => (
              <span key={cat} style={{
                fontSize: 12, padding: '3px 10px', borderRadius: 20,
                background: score >= 20 ? '#27AE6020' : score >= 15 ? '#F39C1220' : '#E9456020',
                color: score >= 20 ? '#27AE60' : score >= 15 ? '#F39C12' : '#E94560',
                border: `1px solid ${score >= 20 ? '#27AE6040' : score >= 15 ? '#F39C1240' : '#E9456040'}`
              }}>
                {cat}: {score}/25
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ROAST */}
      <div style={{ background: '#16213e', border: '1px solid #ffffff10', borderRadius: 14, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#E94560', letterSpacing: 1, marginBottom: 12, textTransform: 'uppercase' }}>🔥 The Roast</div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#c8cfe0' }}>{result.roast}</p>
      </div>

      {/* ACTION PLAN */}
      <div style={{ background: '#16213e', border: '1px solid #ffffff10', borderRadius: 14, padding: '24px 28px', marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#E94560', letterSpacing: 1, marginBottom: 16, textTransform: 'uppercase' }}>⚡ Your Top 3 Quick Wins</div>
        {result.quickWins && result.quickWins.map((win, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E94560', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: '#c8cfe0', margin: 0 }}>{win}</p>
          </div>
        ))}
      </div>

      {/* UPSELL */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        border: '1px solid #E9456040', borderRadius: 14, padding: '24px 28px', marginBottom: 20, textAlign: 'center'
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Want the full breakdown?</div>
        <p style={{ fontSize: 14, color: '#8892a4', marginBottom: 20 }}>
          Get a detailed 10-point report with rewritten examples for every section of your profile.
        </p>
        <button style={{
          padding: '14px 32px', borderRadius: 10, border: 'none',
          background: '#E94560', color: 'white', fontSize: 15, fontWeight: 700, cursor: 'pointer'
        }}>
          Get Full Report — €9
        </button>
      </div>

      {/* SHARE */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=https://roastin.me`, '_blank')}
          style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #0077b5', background: 'transparent', color: '#0077b5', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Share on LinkedIn
        </button>
        <button
          onClick={onReset}
          style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ffffff20', background: 'transparent', color: '#8892a4', fontSize: 13, cursor: 'pointer' }}
        >
          Roast another profile
        </button>
      </div>
    </div>
  )
}
