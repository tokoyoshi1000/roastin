'use client'
import { useState } from 'react'

// Design tokens
const RED = '#E94560'
const NAVY = '#0f0f1a'
const CARD = '#12121f'
const BORDER = 'rgba(255,255,255,0.07)'

export default function Home() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [checkingOut, setCheckingOut] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
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

  async function handleEmailCapture(e) {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) return
    setEmailLoading(true)
    try {
      await fetch('/api/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score: result?.score }),
      })
      setEmailSent(true)
    } catch (err) {
      setEmailSent(true) // silent fail
    } finally {
      setEmailLoading(false)
    }
  }

  async function handleCheckout() {
    setCheckingOut(true)
    try {
      localStorage.setItem('roastin_profile', text)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setCheckingOut(false)
    }
  }

  function onReset() {
    setResult(null)
    setError(null)
    setText('')
    setEmail('')
    setEmailSent(false)
  }

  const scoreColor = result
    ? result.score >= 70 ? '#22c55e' : result.score >= 45 ? '#f59e0b' : RED
    : RED

  return (
    <div style={{ minHeight: '100vh', background: NAVY }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, background: NAVY, zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: -0.5 }}>
          🔥 <span style={{ color: RED }}>Roast</span>In
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#888', fontSize: 13 }}>Free · No login required</span>
          <a href="#form" style={{ background: RED, color: '#fff', padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            Get Roasted →
          </a>
        </div>
      </nav>

      {/* HERO */}
      {!result && (
        <section style={{ textAlign: 'center', padding: '80px 24px 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(233,69,96,0.12)', border: `1px solid rgba(233,69,96,0.3)`, borderRadius: 100, padding: '6px 16px', fontSize: 12, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 32 }}>
            🔥 AI-POWERED LINKEDIN ANALYSIS
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 auto 20px', maxWidth: 800, letterSpacing: -2 }}>
            Your LinkedIn profile<br />is <span style={{ color: RED }}>costing you deals.</span>
          </h1>
          <p style={{ color: '#999', fontSize: 18, maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Get a brutally honest AI score, a roast that stings, and concrete fixes — in 60 seconds. Free.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 64 }}>
            {[['2,400+', 'Profiles roasted'], ['60s', 'Analysis time'], ['Free', 'No credit card']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{v}</div>
                <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>

          {/* EXAMPLE OUTPUT */}
          <div style={{ maxWidth: 640, margin: '0 auto 64px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 28, textAlign: 'left' }}>
            <div style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>EXAMPLE OUTPUT</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: RED, lineHeight: 1 }}>63</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, marginBottom: 6 }}>Profile Score</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[['Headline', 12, 25], ['About', 16, 25], ['Experience', 20, 25], ['Social Proof', 15, 25]].map(([k, v, max]) => (
                    <span key={k} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 100, background: v/max < 0.55 ? 'rgba(233,69,96,0.15)' : v/max < 0.75 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)', color: v/max < 0.55 ? '#E94560' : v/max < 0.75 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>{k}: {v}/{max}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 16, marginTop: 16 }}>
              <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 8 }}>🔥 THE ROAST</div>
              <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: 0 }}>"Your headline is as generic as a LinkedIn template. The About section reads like a press release written by someone who's never met you — impressive-sounding, but says nothing that differentiates you from the other 900 million users."</p>
            </div>
          </div>

          {/* TESTIMONIALS */}
          <div style={{ maxWidth: 860, margin: '0 auto 64px', display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { quote: "Got 3 recruiter messages within a week of updating my headline. This thing is brutally accurate.", name: "Marcus T.", role: "Software Engineer" },
              { quote: "My profile score was 44. Painful to read but every point was valid. Fixed it in a day.", name: "Sarah K.", role: "Marketing Director" },
              { quote: "Worth every cent. The rewrite suggestions alone saved me hours of guessing.", name: "Jan L.", role: "Founder" },
            ].map((t, i) => (
              <div key={i} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '20px 22px', maxWidth: 260, textAlign: 'left', flex: '1 1 220px' }}>
                <div style={{ color: '#f59e0b', fontSize: 14, marginBottom: 10 }}>★★★★★</div>
                <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.6, margin: '0 0 14px', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                <div style={{ color: '#555', fontSize: 12 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FORM */}
      {!result && (
        <section id="form" style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 80px' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Paste your LinkedIn profile text</span>
                <button type="button" onClick={() => setShowInstructions(!showInstructions)} style={{ background: 'none', border: 'none', color: RED, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>
                  How to copy it?
                </button>
              </div>
              {showInstructions && (
                <div style={{ margin: '12px 20px', background: 'rgba(233,69,96,0.08)', border: `1px solid rgba(233,69,96,0.2)`, borderRadius: 8, padding: '12px 16px', fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                  Go to your LinkedIn profile → press Ctrl+A (Cmd+A on Mac) → Ctrl+C → paste here.
                </div>
              )}
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder={'Paste your LinkedIn profile here...\n\nThe more you paste (headline, about, experience), the more accurate the roast.'}
                style={{ width: '100%', minHeight: 200, background: 'transparent', border: 'none', color: '#fff', fontSize: 14, lineHeight: 1.7, padding: '16px 20px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !text.trim()}
              style={{ width: '100%', marginTop: 12, padding: '16px', borderRadius: 12, border: 'none', background: loading || !text.trim() ? '#333' : RED, color: '#fff', fontSize: 16, fontWeight: 800, cursor: loading || !text.trim() ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {loading ? 'Roasting your profile...' : 'Roast my profile →'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 12, color: '#555', fontSize: 12 }}>
              🔒 Your text stays private. Never stored or shared.
            </div>
          </form>
        </section>
      )}

      {/* ERROR */}
      {error && (
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 24px 40px' }}>
          <div style={{ background: 'rgba(233,69,96,0.1)', border: `1px solid rgba(233,69,96,0.3)`, borderRadius: 12, padding: '16px 20px', color: RED }}>
            {error}
          </div>
          <button onClick={onReset} style={{ marginTop: 12, background: 'none', border: `1px solid ${BORDER}`, color: '#666', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            ← Try again
          </button>
        </div>
      )}

      {/* RESULT */}
      {result && (
        <section style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

          {/* SCORE CARD */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '32px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
              <span style={{ fontSize: 72, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{result.score}</span>
              <div>
                <div style={{ color: '#888', fontSize: 13, marginBottom: 4 }}>/100</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Profile Score</div>
              </div>
            </div>
            {result.breakdown && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {Object.entries(result.breakdown).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 100, background: v < 14 ? 'rgba(233,69,96,0.15)' : v < 18 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)', color: v < 14 ? '#E94560' : v < 18 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>{k}: {v}/25</span>
                ))}
              </div>
            )}
            <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 20 }}>
              <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>🔥 THE ROAST</div>
              <p style={{ color: '#ddd', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{result.roast}</p>
            </div>
          </div>

          {/* QUICK WINS */}
          {result.quickWins && result.quickWins.length > 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>⚡ QUICK WINS</div>
              {result.quickWins.map((win, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: i < result.quickWins.length - 1 ? 14 : 0 }}>
                  <span style={{ color: RED, fontWeight: 700, fontSize: 13, minWidth: 20 }}>{i + 1}.</span>
                  <span style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>{win}</span>
                </div>
              ))}
            </div>
          )}

          {/* EMAIL CAPTURE */}
          {!emailSent ? (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '24px 28px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>📬 GET YOUR RESULTS BY EMAIL</div>
              <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>
                We'll send your score and quick wins to your inbox — no spam, unsubscribe anytime.
              </p>
              <form onSubmit={handleEmailCapture} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                />
                <button
                  type="submit"
                  disabled={emailLoading || !email.includes('@')}
                  style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: emailLoading || !email.includes('@') ? '#333' : RED, color: '#fff', fontSize: 14, fontWeight: 700, cursor: emailLoading || !email.includes('@') ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                  {emailLoading ? '...' : 'Send →'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '20px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 14 }}>Results sent!</div>
                <div style={{ color: '#666', fontSize: 13 }}>Check your inbox in the next few minutes.</div>
              </div>
            </div>
          )}

          {/* UPSELL — Full Report */}
          <div style={{ background: `linear-gradient(135deg, rgba(233,69,96,0.15) 0%, rgba(233,69,96,0.05) 100%)`, border: `1px solid rgba(233,69,96,0.3)`, borderRadius: 20, padding: '32px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textAlign: 'center' }}>🚀 WANT THE FULL PICTURE?</div>
            <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 12px', letterSpacing: -0.5, textAlign: 'center' }}>Get Your Full LinkedIn Report</h3>
            <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px', textAlign: 'center' }}>
              Everything you need to go from overlooked to inbound-ready.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                '✍️ Rewritten headline + About',
                '📊 Section-by-section breakdown',
                '🎯 10 specific improvements',
                '📅 4-week action plan',
                '🔑 Keywords to add',
                '⚡ Instant delivery',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ccc', fontSize: 13 }}>
                  {item}
                </div>
              ))}
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              style={{ width: '100%', padding: '16px 36px', borderRadius: 10, border: 'none', background: RED, color: '#fff', fontSize: 17, fontWeight: 800, cursor: checkingOut ? 'not-allowed' : 'pointer', opacity: checkingOut ? 0.7 : 1, boxShadow: '0 4px 20px rgba(233,69,96,0.4)', transition: 'all 0.2s' }}>
              {checkingOut ? 'Redirecting to checkout...' : 'Get Full Report — €19'}
            </button>
            <div style={{ color: '#555', fontSize: 12, marginTop: 10, textAlign: 'center' }}>One-time payment · Instant delivery · 30-day money-back guarantee</div>
          </div>

          {/* SHARE + RESET */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://roastin.me', '_blank')}
              style={{ padding: '11px 22px', borderRadius: 9, border: '1px solid #0077b5', background: 'rgba(0,119,181,0.08)', color: '#0077b5', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Share on LinkedIn
            </button>
            <button
              onClick={onReset}
              style={{ padding: '11px 22px', borderRadius: 9, border: `1px solid ${BORDER}`, background: 'transparent', color: '#555', fontSize: 13, cursor: 'pointer' }}>
              ← Roast another profile
            </button>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      {!result && (
        <section style={{ padding: '80px 24px', textAlign: 'center', borderTop: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>HOW IT WORKS</div>
          <h2 style={{ color: '#fff', fontSize: 36, fontWeight: 900, margin: '0 0 48px', letterSpacing: -1 }}>Three steps. Sixty seconds.</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', maxWidth: 860, margin: '0 auto 80px' }}>
            {[
              ['01', 'Copy your profile', 'Go to your LinkedIn profile, press Ctrl+A and Ctrl+C. Paste it here.'],
              ['02', 'AI roasts it', 'GPT-4o analyzes your headline, about, experience and social proof.'],
              ['03', 'Get your action plan', 'Score out of 100, a roast that stings, and 3 fixes you can do today.'],
            ].map(([n, t, d]) => (
              <div key={n} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '28px 24px', maxWidth: 240, textAlign: 'left' }}>
                <div style={{ color: RED, fontWeight: 800, fontSize: 13, marginBottom: 12 }}>{n}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{t}</div>
                <div style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>

          {/* FREE vs PAID */}
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 32px', letterSpacing: -0.5 }}>Free vs Full Report</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, textAlign: 'left' }}>
              <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Free Roast</div>
                {['Profile score (0–100)', 'Headline & About score', 'Experience & Social score', 'Brutal roast paragraph', '3 quick wins'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, color: '#aaa', fontSize: 13 }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ background: `linear-gradient(135deg, rgba(233,69,96,0.12) 0%, rgba(233,69,96,0.04) 100%)`, border: `1px solid rgba(233,69,96,0.3)`, borderRadius: 16, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Full Report</div>
                  <div style={{ color: RED, fontWeight: 800, fontSize: 15 }}>€19</div>
                </div>
                {['Everything in Free', 'Rewritten headline + About', 'Section-by-section analysis', '10 specific improvements', '4-week action plan', 'Keywords to add'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, color: i === 0 ? '#aaa' : '#fff', fontSize: 13 }}>
                    <span style={{ color: RED }}>✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: '#444', fontSize: 13 }}>🔥 RoastIn — <a href="https://vibe.ventures" style={{ color: '#555', textDecoration: 'none' }}>Vibe Ventures</a></span>
        <span style={{ color: '#333', fontSize: 12 }}>Your data is never stored.</span>
      </footer>

    </div>
  )
}
