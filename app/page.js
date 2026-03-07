'use client'
import { useState } from 'react'

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
    <div style={{ minHeight: '100vh', background: NAVY }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(8,8,15,0.85)',
        backdropFilter: 'blur(12px)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>🔥</span>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.3px' }}>
            Roast<span style={{ color: RED }}>In</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#666' }}>Free · No login required</span>
          <a href="#roast-form" style={{
            background: RED, color: 'white', padding: '7px 16px',
            borderRadius: 8, fontSize: 13, fontWeight: 700,
            textDecoration: 'none', display: 'inline-block'
          }}>Get Roasted →</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        maxWidth: 760, margin: '0 auto', padding: '80px 24px 60px',
        textAlign: 'center', position: 'relative'
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: 40, left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(233,69,96,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.25)',
          borderRadius: 100, padding: '5px 14px', fontSize: 12, fontWeight: 600,
          color: RED, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 28
        }}>
          🔥 AI-Powered LinkedIn Analysis
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6.5vw, 68px)', fontWeight: 900,
          lineHeight: 1.05, letterSpacing: '-1.5px', margin: '0 0 24px'
        }}>
          Your LinkedIn profile<br />
          is <span style={{ color: RED }}>costing you deals.</span>
        </h1>

        <p style={{
          fontSize: 18, color: '#8892a4', lineHeight: 1.7,
          maxWidth: 500, margin: '0 auto 48px'
        }}>
          Paste your profile below. Our AI gives you a brutally honest score, a roast that stings, and a concrete fix list — in 60 seconds. Free.
        </p>

        {/* STATS ROW */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 64, flexWrap: 'wrap' }}>
          {[
            { n: '2,400+', label: 'Profiles roasted' },
            { n: '60s', label: 'Analysis time' },
            { n: 'Free', label: 'No credit card' },
          ].map(({ n, label }) => (
            <div key={n}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>{n}</div>
              <div style={{ fontSize: 12, color: '#555', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* EXAMPLE OUTPUT PREVIEW */}
        {!result && (
          <div style={{
            background: CARD, border: `1px solid ${BORDER}`,
            borderRadius: 16, padding: '20px 24px', marginBottom: 48, textAlign: 'left',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              padding: '6px 12px', background: 'rgba(233,69,96,0.08)',
              borderBottom: `1px solid ${BORDER}`,
              fontSize: 11, fontWeight: 700, color: RED, letterSpacing: 1, textTransform: 'uppercase'
            }}>Example output</div>
            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: RED, lineHeight: 1 }}>63</div>
                <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>/100</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Profile Score</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[['Headline', 12, 25], ['About', 16, 25], ['Experience', 20, 25], ['Social Proof', 15, 25]].map(([cat, s, m]) => (
                    <span key={cat} style={{
                      fontSize: 11, padding: '2px 9px', borderRadius: 20,
                      background: s >= 20 ? 'rgba(39,174,96,0.1)' : s >= 15 ? 'rgba(243,156,18,0.1)' : 'rgba(233,69,96,0.1)',
                      color: s >= 20 ? '#27AE60' : s >= 15 ? '#F39C12' : RED,
                      border: `1px solid ${s >= 20 ? 'rgba(39,174,96,0.2)' : s >= 15 ? 'rgba(243,156,18,0.2)' : 'rgba(233,69,96,0.2)'}`
                    }}>{cat}: {s}/{m}</span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(233,69,96,0.05)', borderRadius: 10, borderLeft: `3px solid ${RED}` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: RED, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>🔥 The Roast</div>
              <p style={{ fontSize: 13, color: '#8892a4', margin: 0, lineHeight: 1.6 }}>
                "Your headline is as generic as a LinkedIn template. The About section reads like a press release written by someone who's never met you — impressive-sounding, but says nothing that differentiates you from the other 900 million users."
              </p>
            </div>
            {/* Blur overlay */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
              background: `linear-gradient(to bottom, transparent, ${CARD})`
            }} />
          </div>
        )}
      </section>

      {/* FORM SECTION */}
      {!result && (
        <section id="roast-form" style={{
          maxWidth: 620, margin: '0 auto', padding: '0 24px 80px'
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              background: CARD, border: `1px solid ${BORDER}`,
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
            }}>
              <div style={{
                padding: '14px 20px', borderBottom: `1px solid ${BORDER}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#aaa' }}>Paste your LinkedIn profile text</span>
                <button
                  type="button"
                  onClick={() => setShowInstructions(!showInstructions)}
                  style={{ fontSize: 12, color: RED, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  {showInstructions ? 'Hide' : 'How to copy it?'}
                </button>
              </div>

              {showInstructions && (
                <div style={{ padding: '12px 20px', background: 'rgba(233,69,96,0.04)', borderBottom: `1px solid ${BORDER}`, fontSize: 13, color: '#8892a4', lineHeight: 1.8 }}>
                  1. Go to your LinkedIn profile<br />
                  2. Press <strong style={{ color: '#ccc' }}>Ctrl+A</strong> → <strong style={{ color: '#ccc' }}>Ctrl+C</strong> to copy all text<br />
                  3. Paste below — the AI filters out the noise automatically
                </div>
              )}

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                required
                rows={10}
                placeholder={"Paste your LinkedIn profile here...\n\nThe more you paste (headline, about, experience), the more accurate the roast."}
                style={{
                  width: '100%', padding: '20px', boxSizing: 'border-box',
                  background: 'transparent', border: 'none', color: '#e8eaf6',
                  fontSize: 14, lineHeight: 1.7, resize: 'vertical',
                  fontFamily: 'inherit', outline: 'none', display: 'block'
                }}
              />

              <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}` }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '15px', borderRadius: 10, border: 'none',
                    background: loading ? '#333' : `linear-gradient(135deg, #E94560, #c73652)`,
                    color: 'white', fontSize: 15, fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    letterSpacing: '-0.2px',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(233,69,96,0.4)',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? '🔥 Roasting your profile...' : 'Roast my profile →'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: '#444' }}>🔒 Your text stays private. Never stored or shared.</span>
                </div>
              </div>
            </div>
          </form>

          {error && (
            <div style={{
              marginTop: 16, padding: '14px 20px',
              background: 'rgba(233,69,96,0.08)', border: `1px solid rgba(233,69,96,0.25)`,
              borderRadius: 10, color: RED, fontSize: 14
            }}>
              {error}
            </div>
          )}
        </section>
      )}

      {/* RESULT */}
      {result && <RoastResult result={result} onReset={() => { setResult(null); setText('') }} />}

      {/* HOW IT WORKS */}
      {!result && (
        <section style={{ borderTop: `1px solid ${BORDER}`, padding: '72px 24px', textAlign: 'center' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: RED, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>How it works</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 48, letterSpacing: '-0.5px' }}>Three steps. Sixty seconds.</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
              {[
                { n: '01', title: 'Copy your profile', desc: 'Go to your LinkedIn profile, press Ctrl+A and Ctrl+C. Done.' },
                { n: '02', title: 'AI roasts it', desc: 'GPT-4o analyzes your headline, about, experience and social proof against top-performing profiles.' },
                { n: '03', title: 'Get your action plan', desc: 'Score out of 100, a roast that stings, and 3 fixes you can action today.' },
              ].map(({ n, title, desc }) => (
                <div key={n} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '28px 24px', textAlign: 'left' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: RED, marginBottom: 12, letterSpacing: 1 }}>{n}</div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: '#666', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '24px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: '#333' }}>
          🔥 RoastIn — A <span style={{ color: RED }}>Vibe Ventures</span> product · Built in public
        </span>
      </footer>
    </div>
  )
}

function RoastResult({ result, onReset }) {
  const RED = '#E94560'
  const CARD = '#12121f'
  const BORDER = 'rgba(255,255,255,0.07)'

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* SCORE CARD */}
      <div style={{
        background: CARD, border: `1px solid rgba(233,69,96,0.2)`,
        borderRadius: 16, padding: '28px 32px', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
        boxShadow: '0 0 40px rgba(233,69,96,0.08)'
      }}>
        <div style={{ textAlign: 'center', minWidth: 80 }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: RED, lineHeight: 1, letterSpacing: '-2px' }}>{result.score}</div>
          <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>/ 100</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Your Profile Score</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {result.categoryScores && Object.entries(result.categoryScores).map(([cat, score]) => (
              <span key={cat} style={{
                fontSize: 12, padding: '4px 12px', borderRadius: 20, fontWeight: 600,
                background: score >= 20 ? 'rgba(39,174,96,0.1)' : score >= 15 ? 'rgba(243,156,18,0.1)' : 'rgba(233,69,96,0.1)',
                color: score >= 20 ? '#27AE60' : score >= 15 ? '#F39C12' : RED,
                border: `1px solid ${score >= 20 ? 'rgba(39,174,96,0.25)' : score >= 15 ? 'rgba(243,156,18,0.25)' : 'rgba(233,69,96,0.25)'}`
              }}>
                {cat}: {score}/25
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ROAST */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: 1.5, marginBottom: 14, textTransform: 'uppercase' }}>🔥 The Roast</div>
        <p style={{ fontSize: 15, lineHeight: 1.8, color: '#b0b8c8', margin: 0 }}>{result.roast}</p>
      </div>

      {/* QUICK WINS */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '24px 28px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: 1.5, marginBottom: 18, textTransform: 'uppercase' }}>⚡ Your Top 3 Quick Wins</div>
        {result.quickWins && result.quickWins.map((win, i) => (
          <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < 2 ? 16 : 0 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: RED,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, flexShrink: 0, color: 'white'
            }}>{i + 1}</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#b0b8c8', margin: 0, paddingTop: 4 }}>{win}</p>
          </div>
        ))}
      </div>

      {/* UPSELL */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(233,69,96,0.08), rgba(233,69,96,0.03))',
        border: `1px solid rgba(233,69,96,0.2)`,
        borderRadius: 16, padding: '28px 32px', marginBottom: 20, textAlign: 'center'
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.3px' }}>Want the full breakdown?</div>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 22, lineHeight: 1.6 }}>
          10-point deep-dive report with rewritten examples for every section of your profile. Worth it if you're actively job-hunting or selling.
        </p>
        <button style={{
          padding: '14px 36px', borderRadius: 10, border: 'none',
          background: `linear-gradient(135deg, #E94560, #c73652)`,
          color: 'white', fontSize: 15, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(233,69,96,0.35)'
        }}>
          Get Full Report — €9
        </button>
      </div>

      {/* ACTIONS */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => window.open('https://www.linkedin.com/sharing/share-offsite/?url=https://roastin.me', '_blank')}
          style={{
            padding: '11px 22px', borderRadius: 9, border: '1px solid #0077b5',
            background: 'rgba(0,119,181,0.08)', color: '#0077b5',
            fontSize: 13, fontWeight: 700, cursor: 'pointer'
          }}
        >Share on LinkedIn</button>
        <button
          onClick={onReset}
          style={{
            padding: '11px 22px', borderRadius: 9, border: `1px solid ${BORDER}`,
            background: 'transparent', color: '#555', fontSize: 13, cursor: 'pointer'
          }}
        >← Roast another profile</button>
      </div>
    </div>
  )
}
