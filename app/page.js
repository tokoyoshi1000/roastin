'use client'
import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
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
        body: JSON.stringify({ text })
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

        <p style={{ fontSize: 18, color: '#8892a4', maxWidth: 500, lineHeight: 1.6, marginBottom: 40 }}>
          Paste your LinkedIn profile text below. Get brutally honest AI feedback + a concrete action plan in 60 seconds. Free.
        </p>

        {/* HOW TO COPY INSTRUCTIONS */}
        {!result && (
          <div style={{
            background: '#16213e', border: '1px solid #ffffff15', borderRadius: 12,
            padding: '16px 20px', maxWidth: 560, width: '100%', marginBottom: 24, textAlign: 'left'
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#E94560', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>How to get your profile text</div>
            <div style={{ fontSize: 13, color: '#8892a4', lineHeight: 1.8 }}>
              1. Go to your LinkedIn profile<br/>
              2. Copy your <strong style={{ color: '#c8cfe0' }}>Headline</strong>, <strong style={{ color: '#c8cfe0' }}>About</strong> section, and top 3 <strong style={{ color: '#c8cfe0' }}>Experience</strong> entries<br/>
              3. Paste it all below — the more you paste, the better the roast 🔥
            </div>
          </div>
        )}

        {/* FORM */}
        {!result && (
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 560 }}>
            <textarea
              placeholder={"Paste your LinkedIn profile here...\n\nHeadline: Sales Manager | Helping B2B companies grow\n\nAbout: I am passionate about sales and...\n\nExperience: Sales Manager at Acme Corp (2021-present)..."}
              value={text}
              onChange={e => setText(e.target.value)}
              required
              rows={10}
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 10,
                border: '1px solid #ffffff20', background: '#16213e', color: '#e8eaf6',
                fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                fontFamily: 'inherit', lineHeight: 1.6, marginBottom: 12
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '16px', borderRadius: 10, border: 'none',
                background: loading ? '#555' : '#E94560', color: 'white',
                fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Roasting... 🔥' : 'Roast my profile →'}
            </button>
            <p style={{ fontSize: 12, color: '#444', marginTop: 8 }}>
              Your text stays private. We only use it to generate your analysis.
            </p>
          </form>
        )}

        {/* ERROR */}
        {error && (
          <div style={{
            marginTop: 24, padding: '16px 24px', background: '#E9456015',
            border: '1px solid #E9456040', borderRadius: 10, color: '#E94560', maxWidth: 560
          }}>
            {error}
          </div>
        )}

        {/* RESULT */}
        {result && <RoastResult result={result} onReset={() => { setResult(null); setText('') }} />}

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

      {/* FOOTER */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid #ffffff10' }}>
        <span style={{ fontSize: 12, color: '#333' }}>
          RoastIn — A <span style={{ color: '#E94560' }}>Vibe Ventures</span> product
        </span>
      </footer>
    </main>
  )
}

function RoastResult({ result, onReset }) {
  return (
    <div style={{ width: '100%', maxWidth: 680, textAlign: 'left', marginTop: 32 }}>

      {/* SCORE */}
      <div style={{
        background: '#16213e', border: '1px solid #E9456040', borderRadius: 14,
        padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, fontWeight: 800, color: '#E94560', lineHeight: 1 }}>{result.score}</div>
          <div style={{ fontSize: 12, color: '#8892a4', marginTop: 4 }}>/ 100</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Your Profile Score</div>
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
        <p style={{ fontSize: 15, lineHeight: 1.7, color: '#c8cfe0', margin: 0 }}>{result.roast}</p>
      </div>

      {/* QUICK WINS */}
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

      {/* SHARE + RESET */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://roastin.me', '_blank')}
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
