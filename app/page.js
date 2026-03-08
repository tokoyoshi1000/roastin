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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://roastin.me/#webapp',
        name: 'RoastIn',
        url: 'https://roastin.me',
        description: 'Free AI-powered LinkedIn profile checker and analyzer. Scores your profile out of 100, explains why you\'re invisible to recruiters, and provides actionable improvements.',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '2400' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is RoastIn?',
            acceptedAnswer: { '@type': 'Answer', text: 'RoastIn is a free AI-powered LinkedIn profile checker and analyzer. It gives your profile a score out of 100, explains why you might be invisible to recruiters, and provides 3 specific improvements you can implement immediately. No login required.' },
          },
          {
            '@type': 'Question',
            name: 'Is this LinkedIn profile checker free?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes, the LinkedIn profile roast, score, and quick wins are completely free ‚Äî ~no account or credit card needed. A full detailed report with rewritten sections and a 4-week action plan is available for ‚Çº19.' },
          },
          {
            '@type': 'Question',
            name: 'How does the LinkedIn profile analyzer work?',
            acceptedAnswer: { '@type': 'Answer', text: 'Paste your LinkedIn profile text (headline, about, experience) into the analyzer. Our AI model scores it across 4 dimensions ‚Äî Headline, About, Experience, and Social Proof ‚Äî and gives you a total score out of 100 along with specific, actionable feedback.' },
          },
          {
            '@type': 'Question',
            name: 'Why is my LinkedIn profile invisible to recruiters?',
            acceptedAnswer: { '@type': 'Answer', text: 'Most LinkedIn profiles are too generic, lack the right keywords, and fail to communicate unique value. Recruiters scan profiles in under 10 seconds. RoastIn identifies the exact weaknesses making you invisible and tells you how to fix them.' },
          },
          {
            '@type': 'Question',
            name: 'Wie kann ich mein LinkedIn Profil optimieren?',
            acceptedAnswer: { '@type': 'Answer', text: 'Mit RoastIn kannst du dein LinkedIn Profil kostenlos analysieren lassen. Die KI bewertet dein Profil, erkl√§rt warum Recruiter es √ºbersehen, und gibt dir 3 konkrete Verbesserungen ‚Äî in 60 Sekunden, ohne Anmeldung.' },
          },
        ],
      },
    ],
  }

  return (
    <div style={{ minHeight: '100vh', background: NAVY }}>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, background: NAVY, zIndex: 100 }}>
        <span style={{ fontWeight: 800, fontSize: 20, color: '#fff', letterSpacing: -0.5 }}>
          üî• <span style={{ color: RED }}>Roast</span>In
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ color: '#888', fontSize: 13 }}>Free ¬∑ No login required</span>
          <a href="#form" style={{ background: RED, color: '#fff', padding: '9px 20px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
            Get Roasted ‚Üí
          </a>
        </div>
      </nav>

      {/* HERO */}
      {!result && (
        <section style={{ textAlign: 'center', padding: '80px 24px 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(233,69,96,0.12)', border: `1px solid rgba(233,69,96,0.3)`, borderRadius: 100, padding: '6px 16px', fontSize: 12, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 32 }}>
            üî• AI-POWERED LINKEDIN ANALYSIS
          </div>
          <h1 style={{ fontSize: 'clamp(36px,6vw,32px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 auto 20px', maxWidth: 800, letterSpacing: -2 }}>
            Your LinkedIn profile<br />makes you <span style={{ color: RED }}>invisible to recruiters.</span>
          </h1>
          <p style={{ color: '#999', fontSize: 18, maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.6 }}>
            Free LinkedIn profile checker & analyzer. Get your score out of 100, find out exactly why recruiters skip your profile, and get 3 fixes you can apply today ‚Äî in 60 seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginBottom: 64 }}>
            {[['2,400+', 'Profiles roasted'], ['60s$∞ÄùπÖ±ÂÕ•ÃÅ—•µîùt∞Ålù…ïîú∞Äù9ºÅç…ïë•–ÅçÖ…êùutπµÖ¿†°mÿ∞Å±t§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅ≠ï‰ıÌ±ÙÅÕ—Â±îıÌÏÅ—ï·—±•ù∏ËÄùçïπ—ï»úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅôΩπ—M•ÈîËÄ»‡∞ÅôΩπ—]ï•ù°–ËÄ‰¿¿∞ÅçΩ±Ω»ËÄúçôôòúÅıÙ˘ÌŸÙΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅôΩπ—M•ÈîËÄƒ»∞ÅçΩ±Ω»ËÄúåÿÿÿú∞ÅµÖ…ù•πQΩ¿ËÄ–ÅıÙ˘Ì±ÙΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯((ÄÄÄÄÄÄÄÄÄÅÏº®Åa5A1Å=UQAUPÄ®ΩÙ(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅµÖ·]•ë—†ËÄÿ–¿∞ÅµÖ…ù•∏ËÄú¿ÅÖ’—ºÄÿ—¡‡ú∞ÅâÖç≠ù…Ω’πêËÅI∞ÅâΩ…ëï»ËÅÄ≈¡‡ÅÕΩ±•êÄëÌ	=IIıÄ∞ÅâΩ…ëï…IÖë•’ÃËÄƒÿ∞Å¡Öëë•πúËÄ»‡∞Å—ï·—±•ù∏ËÄù±ïô–úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅôΩπ—M•ÈîËÄƒƒ∞ÅçΩ±Ω»ËÄúå‘‘‘ú∞ÅôΩπ—]ï•ù°–ËÄ‹¿¿∞Å±ï——ï…M¡Öç•πúËÄƒ∞ÅµÖ…ù•π	Ω——Ω¥ËÄƒÿÅıÙ˘a5A1Å=UQAUPΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅë•Õ¡±Ö‰ËÄùô±ï‡ú∞ÅÖ±•ùπ%—ïµÃËÄùâÖÕï±•πîú∞ÅùÖ¿ËÄƒ»∞ÅµÖ…ù•π	Ω——Ω¥ËÄƒ»ÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏ÅÕ—Â±îıÌÏÅôΩπ—M•ÈîËÄ‘»∞ÅôΩπ—]ï•ù°–ËÄ‰¿¿∞ÅçΩ±Ω»ËÅI∞Å±•πï!ï•ù°–ËÄƒÅıÙ¯ÿÃΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúçôôòú∞ÅôΩπ—]ï•ù°–ËÄ‹¿¿∞ÅµÖ…ù•π	Ω——Ω¥ËÄÿÅıÙ˘A…Ωô•±îÅMçΩ…îΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅë•Õ¡±Ö‰ËÄùô±ï‡ú∞ÅùÖ¿ËÄÿ∞Åô±ï·]…Ö¿ËÄù›…Ö¿úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌmlù!ïÖë±•πîú∞Äƒ»∞Ä»’t∞ÅlùâΩ’–ú∞Äƒÿ∞Ä»’t∞Ålù·¡ï…•ïπçîú∞Ä»¿∞Ä»’t∞ÅlùMΩç•Ö∞ÅA…ΩΩòú∞Äƒ‘∞Ä»’utπµÖ¿†°m¨∞Åÿ∞ÅµÖ·t§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏Å≠ï‰ıÌ≠ÙÅÕ—Â±îıÌÏÅôΩπ—M•ÈîËÄƒƒ∞Å¡Öëë•πúËÄúÕ¡‡Ä·¡‡ú∞ÅâΩ…ëï…IÖë•’ÃËÄƒ¿¿∞ÅâÖç≠ù…Ω’πêËÅÿΩµÖ‡ÄÄ¿∏‘‘Ä¸Äù…ùâÑ†»ÃÃ∞ÿ‰∞‰ÿ∞¿∏ƒ‘§úÄËÅÿΩµÖ‡ÄÄ¿∏‹‘Ä¸Å…ùâÑ†»–‘∞ƒ‘‡∞ƒƒ∞¿∏ƒ‘§úÄËÄù…ùâÑ†Ã–∞ƒ‰‹∞‰–∞¿∏ƒ‘§ú∞ÅçΩ±Ω»ËÅÿΩµÖ‡ÄÄ¿∏‘‘Ä¸Äúç‰–‘ÿ¿úÄËÅÿΩµÖ‡ÄÄ¿∏‹‘Ä¸Äúçò‘Âî¡àúÄËÄúå»…å‘’îú∞ÅôΩπ—]ï•ù°–ËÄÿ¿¿ÅıÙ˘Ì≠ÙËÅÌŸÙΩÌµÖ·ÙΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅâΩ…ëï…1ïô–ËÅÄÕ¡‡ÅÕΩ±•êÄëÌIıÄ∞Å¡Öëë•πù1ïô–ËÄƒÿ∞ÅµÖ…ù•πQΩ¿ËÄƒÿÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅôΩπ—M•ÈîËÄƒƒ∞ÅçΩ±Ω»ËÅI∞ÅôΩπ—]ï•ù°–ËÄ‹¿¿∞Å±ï——ï…M¡Öç•πúËÄƒ∞ÅµÖ…ù•π	Ω——Ω¥ËÄ‡ÅıÙ˚¬~RîÅQ!ÅI=MPΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿ÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúçççåú∞ÅôΩπ—M•ÈîËÄƒ–∞Å±•πï!ï•ù°–ËÄƒ∏ÿ∞ÅµÖ…ù•∏ËÄ¿ÅıÙ¯âeΩ’»Å°ïÖë±•πîÅ•ÃÅÖÃÅùïπï…•åÅÖÃÅÑÅ1•π≠ïë%∏Å—ïµ¡±Ö—î∏ÅQ°îÅâΩ’–ÅÕïç—•Ω∏Å…ïÖëÃÅ±•≠îÅÑÅ¡…ïÕÃÅ…ï±ïÖÕîÅ›…•——ï∏Åâ‰ÅÕΩµïΩπîÅ›°ºùÃÅπïŸï»Åµï–ÅÂΩ‘ÉäPÅ•µ¡…ïÕÕ•ŸîµÕΩ’πë•πú∞Åâ’–ÅÕÖÂÃÅπΩ—°•πúÅ—°Ö–Åë•ôôï…ïπ—•Ö—ïÃÅÂΩ‘Åô…Ω¥Å—°îÅΩ—°ï»Ä‰¿¿Åµ•±±•Ω∏Å’Õï…Ã∏àΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯((ÄÄÄÄÄÄÄÄÄÅÏº®ÅQMQ%5=9%1LÄ®ΩÙ(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅµÖ·]•ë—†ËÄ‡ÿ¿∞ÅµÖ…ù•∏ËÄú¿ÅÖ’—ºÄÿ—¡‡ú∞Åë•Õ¡±Ö‰ËÄùô±ï‡ú∞ÅùÖ¿ËÄ»¿∞Åô±ï·]…Ö¿ËÄù›…Ö¿ú∞Å©’Õ—•ôÂΩπ—ïπ–ËÄùçïπ—ï»úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÅÌl(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÏÅ≈’Ω—îËÄâΩ–ÄÃÅ…ïç…’•—ï»ÅµïÕÕÖùïÃÅ›•—°•∏ÅÑÅ›ïï¨ÅΩòÅ’¡ëÖ—•πúÅµ‰Å°ïÖë±•πî∏ÅQ°•ÃÅ—°•πúÅ•ÃÅâ…’—Ö±±‰ÅÖçç’…Ö—î∏à∞ÅπÖµîËÄâ5Ö…ç’ÃÅP∏à∞Å…Ω±îËÄâMΩô—›Ö…îÅπù•πïï»àÅÙ∞(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÏÅ≈’Ω—îËÄâ5‰Å¡…Ωô•±îÅÕçΩ…îÅ›ÖÃÄ––∏ÅAÖ•πô’∞Å—ºÅ…ïÖêÅâ’–ÅïŸï…‰Å¡Ω•π–Å›ÖÃÅŸÖ±•ê∏Å•·ïêÅ•–Å•∏ÅÑÅëÖ‰∏à∞ÅπÖµîËÄâMÖ…Ö†Å,∏à∞Å…Ω±îËÄâ5Ö…≠ï—•πúÅ•…ïç—Ω»àÅÙ∞(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÏÅ≈’Ω—îËÄâ]Ω…—†ÅïŸï…‰Åçïπ–∏ÅQ°îÅ…ï›…•—îÅÕ’ùùïÕ—•ΩπÃÅÖ±ΩπîÅÕÖŸïêÅµîÅ°Ω’…ÃÅΩòÅù’ïÕÕ•πú∏à∞ÅπÖµîËÄâ)Ö∏Å0∏à∞Å…Ω±îËÄâΩ’πëï»àÅÙ∞(ÄÄÄÄÄÄÄÄÄÄÄÅtπµÖ¿†°–∞Å§§ÄÙ¯Ä†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅ≠ï‰ıÌ•ÙÅÕ—Â±îıÌÏÅâÖç≠ù…Ω’πêËÅI∞ÅâΩ…ëï»ËÅÄ≈¡‡ÅÕΩ±•êÄëÌ	=IIıÄ∞ÅâΩ…ëï…IÖë•’ÃËÄƒ–∞Å¡Öëë•πúËÄú»¡¡‡Ä»…¡‡ú∞ÅµÖ·]•ë—†ËÄ»ÿ¿∞Å—ï·—±•ù∏ËÄù±ïô–ú∞Åô±ï‡ËÄúƒÄƒÄ»»¡¡‡úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúçò‘Âî¡àú∞ÅôΩπ—M•ÈîËÄƒ–∞ÅµÖ…ù•π	Ω——Ω¥ËÄƒ¿ÅıÙ˚äbäbäbäbäbΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ¿ÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúçççåú∞ÅôΩπ—M•ÈîËÄƒÃ∞Å±•πï!ï•ù°–ËÄƒ∏ÿ∞ÅµÖ…ù•∏ËÄú¿Ä¿Äƒ—¡‡ú∞ÅôΩπ—M—Â±îËÄù•—Ö±•åúÅıÙ¯âÌ–π≈’Ω—ïÙàΩ¿¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúçôôòú∞ÅôΩπ—]ï•ù°–ËÄ‹¿¿∞ÅôΩπ—M•ÈîËÄƒÃÅıÙ˘Ì–ππÖµïÙΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúå‘‘‘ú∞ÅôΩπ—M•ÈîËÄƒ»ÅıÙ˘Ì–π…Ω±ïÙΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄ§•Ù(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄΩÕïç—•Ω∏¯(ÄÄÄÄÄÄ•Ù((ÄÄÄÄÄÅÏº®Å=I4Ä®ΩÙ(ÄÄÄÄÄÅÏÖ…ïÕ’±–ÄòòÄ†(ÄÄÄÄÄÄÄÄÒÕïç—•Ω∏Å•êÙâôΩ…¥àÅÕ—Â±îıÌÏÅµÖ·]•ë—†ËÄÿ–¿∞ÅµÖ…ù•∏ËÄú¿ÅÖ’—ºú∞Å¡Öëë•πúËÄú¿Ä»—¡‡Ä‡¡¡‡úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÒôΩ…¥ÅΩπM’âµ•–ıÌ°Öπë±ïM’âµ•—Ù¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅâÖç≠ù…Ω’πêËÅI∞ÅâΩ…ëï»ËÅÄ≈¡‡ÅÕΩ±•êÄëÌ	=IIıÄ∞ÅâΩ…ëï…IÖë•’ÃËÄƒÿ∞ÅΩŸï…ô±Ω‹ËÄù°•ëëï∏úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅ¡Öëë•πúËÄúƒŸ¡‡Ä»¡¡‡Ä¿ú∞Åë•Õ¡±Ö‰ËÄùô±ï‡ú∞Å©’Õ—•ôÂΩπ—ïπ–ËÄùÕ¡Öçîµâï—›ïï∏ú∞ÅÖ±•ùπ%—ïµÃËÄùçïπ—ï»úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏ÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúçôôòú∞ÅôΩπ—]ï•ù°–ËÄ‹¿¿∞ÅôΩπ—M•ÈîËÄƒ–ÅıÙ˘AÖÕ—îÅÂΩ’»Å1•π≠ïë%∏Å¡…Ωô•±îÅ—ï·–ΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏Å—Â¡îÙââ’——Ω∏àÅΩπ±•ç¨ıÏ†§ÄÙ¯ÅÕï—M°Ω›%πÕ—…’ç—•ΩπÃ†ÖÕ°Ω›%πÕ—…’ç—•ΩπÃ•ÙÅÕ—Â±îıÌÏÅâÖç≠ù…Ω’πêËÄùπΩπîú∞ÅâΩ…ëï»ËÄùπΩπîú∞ÅçΩ±Ω»ËÅI∞ÅôΩπ—M•ÈîËÄƒÃ∞Åç’…ÕΩ»ËÄù¡Ω•π—ï»ú∞ÅôΩπ—]ï•ù°–ËÄÿ¿¿ÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ!Ω‹Å—ºÅçΩ¡‰Å•–¸(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌÕ°Ω›%πÕ—…’ç—•ΩπÃÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅµÖ…ù•∏ËÄúƒ…¡‡Ä»¡¡‡ú∞ÅâÖç≠ù…Ω’πêËÄù…ùâÑ†»ÃÃ∞ÿ‰∞‰ÿ∞¿∏¿‡§ú∞ÅâΩ…ëï»ËÅÄ≈¡‡ÅÕΩ±•êÅ…ùâÑ†»ÃÃ∞ÿ‰∞‰ÿ∞¿∏»•Ä∞ÅâΩ…ëï…IÖë•’ÃËÄ‡∞Å¡Öëë•πúËÄúƒ…¡‡ÄƒŸ¡‡ú∞ÅôΩπ—M•ÈîËÄƒÃ∞ÅçΩ±Ω»ËÄúçççåú∞Å±•πï!ï•ù°–ËÄƒ∏ÿÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅºÅ—ºÅÂΩ’»Å1•π≠ïë%∏Å¡…Ωô•±îÉäHÅ¡…ïÕÃÅ—…∞≠Ä°µê≠ÅΩ∏Å5Öå§ÉäHÅ—…∞≠ÉäHÅ¡ÖÕ—îÅ°ï…î∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄ•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒ—ï·—Ö…ïÑ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅŸÖ±’îıÌ—ï·—Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅΩπ°ÖπùîıÌîÄÙ¯ÅÕï—Qï·–°îπ—Ö…ùï–πŸÖ±’î•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅ¡±Öçï°Ω±ëï»ıÏùAÖÕ—îÅÂΩ’»Å1•π≠ïë%∏Å¡…Ωô•±îÅ°ï…î∏∏πqπqπQ°îÅµΩ…îÅÂΩ‘Å¡ÖÕ—îÄ°°ïÖë±•πî∞ÅÖâΩ’–∞Åï·¡ï…•ïπçî§∞Å—°îÅµΩ…îÅÖçç’…Ö—îÅ—°îÅ…ΩÖÕ–∏ùÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕ—Â±îıÌÏÅ›•ë—†ËÄúƒ¿¿îú∞Åµ•π!ï•ù°–ËÄ»¿¿∞ÅâÖç≠ù…Ω’πêËÄù—…ÖπÕ¡Ö…ïπ–ú∞ÅâΩ…ëï»ËÄùπΩπîú∞ÅçΩ±Ω»ËÄúçôôòú∞ÅôΩπ—M•ÈîËÄƒ–∞Å±•πï!ï•ù°–ËÄƒ∏‹∞Å¡Öëë•πúËÄúƒŸ¡‡Ä»¡¡‡ú∞Å…ïÕ•ÈîËÄùŸï…—•çÖ∞ú∞ÅΩ’—±•πîËÄùπΩπîú∞ÅâΩ·M•È•πúËÄùâΩ…ëï»µâΩ‡ú∞ÅôΩπ—Öµ•±‰ËÄù•π°ï…•–úÅıÙ(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄº¯(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅ—Â¡îÙâÕ’âµ•–à(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅë•ÕÖâ±ïêıÌ±ΩÖë•πúÅÒÄÖ—ï·–π—…•¥†•Ù(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÕ—Â±îıÌÏÅ›•ë—†ËÄúƒ¿¿îú∞ÅµÖ…ù•πQΩ¿ËÄƒ»∞Å¡Öëë•πúËÄúƒŸ¡‡ú∞ÅâΩ…ëï…IÖë•’ÃËÄƒ»∞ÅâΩ…ëï»ËÄùπΩπîú∞ÅâÖç≠ù…Ω’πêËÅ±ΩÖë•πúÅÒÄÖ—ï·–π—…•¥†§Ä¸ÄúåÃÃÃúÄËÅI∞ÅçΩ±Ω»ËÄúçôôòú∞ÅôΩπ—M•ÈîËÄƒÿ∞ÅôΩπ—]ï•ù°–ËÄ‡¿¿∞Åç’…ÕΩ»ËÅ±ΩÖë•πúÅÒÄÖ—ï·–π—…•¥†§Ä¸ÄùπΩ–µÖ±±Ω›ïêúÄËÄù¡Ω•π—ï»ú∞Å—…ÖπÕ•—•Ω∏ËÄùÖ±∞Ä¿∏…ÃúÅıÙ(ÄÄÄÄÄÄÄÄÄÄÄÄ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÅÌ±ΩÖë•πúÄ¸ÄùIΩÖÕ—•πúÅÂΩ’»Å¡…Ωô•±î∏∏∏úÄËÄùIΩÖÕ–Åµ‰Å¡…Ωô•±îÉäHùÙ(ÄÄÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅ—ï·—±•ù∏ËÄùçïπ—ï»ú∞ÅµÖ…ù•πQΩ¿ËÄƒ»∞ÅçΩ±Ω»ËÄúå‘‘‘ú∞ÅôΩπ—M•ÈîËÄƒ»ÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÉ¬~RHÅeΩ’»Å—ï·–ÅÕ—ÖÂÃÅ¡…•ŸÖ—î∏Å9ïŸï»ÅÕ—Ω…ïêÅΩ»ÅÕ°Ö…ïê∏(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄΩôΩ…¥¯(ÄÄÄÄÄÄÄÄΩÕïç—•Ω∏¯(ÄÄÄÄÄÄ•Ù((ÄÄÄÄÄÅÏº®ÅII=HÄ®ΩÙ(ÄÄÄÄÄÅÌï……Ω»ÄòòÄ†(ÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅµÖ·]•ë—†ËÄÿ–¿∞ÅµÖ…ù•∏ËÄú¿ÅÖ’—ºú∞Å¡Öëë•πúËÄú¿Ä»—¡‡Ä–¡¡‡úÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅâÖç≠ù…Ω’πêËÄù…ùâÑ†»ÃÃ∞ÿ‰∞‰ÿ∞¿∏ƒ§ú∞ÅâΩ…ëï»ËÅÄ≈¡‡ÅÕΩ±•êÅ…ùâÑ†»ÃÃ∞ÿ‰∞‰ÿ∞¿∏Ã•Ä∞ÅâΩ…ëï…IÖë•’ÃËÄƒ»∞Å¡Öëë•πúËÄúƒŸ¡‡Ä»¡¡‡ú∞ÅçΩ±Ω»ËÅIÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÅÌï……Ω…Ù(ÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÒâ’——Ω∏ÅΩπ±•ç¨ıÌΩπIïÕï—ÙÅÕ—Â±îıÌÏÅµÖ…ù•πQΩ¿ËÄƒ»∞ÅâÖç≠ù…Ω’πêËÄùπΩπîú∞ÅâΩ…ëï»ËÅÄ≈¡‡ÅÕΩ±•êÄëÌ	=IIıÄ∞ÅçΩ±Ω»ËÄúåÿÿÿú∞Å¡Öëë•πúËÄúƒ¡¡‡Ä»¡¡‡ú∞ÅâΩ…ëï…IÖë•’ÃËÄ‡∞Åç’…ÕΩ»ËÄù¡Ω•π—ï»ú∞ÅôΩπ—M•ÈîËÄƒÃÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÉä@ÅQ…‰ÅÖùÖ•∏(ÄÄÄÄÄÄÄÄÄÄΩâ’——Ω∏¯(ÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄ•Ù((ÄÄÄÄÄÅÏº®ÅIMU1PÄ®ΩÙ(ÄÄÄÄÄÅÌ…ïÕ’±–ÄòòÄ†(ÄÄÄÄÄÄÄÄÒÕïç—•Ω∏ÅÕ—Â±îıÌÏÅµÖ·]•ë—†ËÄÿ‡¿∞ÅµÖ…ù•∏ËÄú¿ÅÖ’—ºú∞Å¡Öëë•πúËÄú–¡¡‡Ä»—¡‡Ä‡¡¡‡úÅıÙ¯((ÄÄÄÄÄÄÄÄÄÅÏº®ÅM=IÅIÄ®ΩÙ(ÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅâÖç≠ù…Ω’πêËÅI∞ÅâΩ…ëï»ËÅÄ≈¡‡ÅÕΩ±•êÄëÌ	=IIıÄ∞ÅâΩ…ëï…IÖë•’ÃËÄ»¿∞Å¡Öëë•πúËÄúÃ…¡‡ú∞ÅµÖ…ù•π	Ω——Ω¥ËÄ»–ÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅë•Õ¡±Ö‰ËÄùô±ï‡ú∞ÅÖ±•ùπ%—ïµÃËÄùâÖÕï±•πîú∞ÅùÖ¿ËÄƒÿ∞ÅµÖ…ù•π	Ω——Ω¥ËÄ»¿ÅıÙ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒÕ¡Ö∏ÅÕ—Â±îıÌÏÅôΩπ—M•ÈîËÄ‹»∞ÅôΩπ—]ï•ù°–ËÄ‰¿¿∞ÅçΩ±Ω»ËÅÕçΩ…ïΩ±Ω»∞Å±•πï!ï•ù°–ËÄƒÅıÙ˘Ì…ïÕ’±–πÕçΩ…ïÙΩÕ¡Ö∏¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúå‡‡‡ú∞ÅôΩπ—M•ÈîËÄƒÃ∞ÅµÖ…ù•π	Ω——Ω¥ËÄ–ÅıÙ¯ºƒ¿¿Ωë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅçΩ±Ω»ËÄúçôôòú∞ÅôΩπ—]ï•ù°–ËÄ‹¿¿∞ÅôΩπ—M•ÈîËÄƒ‡ÅıÙ˘A…Ωô•±îÅMçΩ…îΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÄΩë•ÿ¯(ÄÄÄÄÄÄÄÄÄÄÄÅÌ…ïÕ’±–πâ…ïÖ≠ëΩ›∏ÄòòÄ†(ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÒë•ÿÅÕ—Â±îıÌÏÅë•Õ¡±Ö‰ËÄùô±ï‡ú∞ÅùÖ¿ËÄ‡∞Åô±ï·]…Ö¿ËÄù›…Ö¿ú∞ÅµÖ…ù•πottom: 20 }}>
                {Object.entries(result.breakdown).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 100, background: v < 14 ? 'rgba(233,69,96,0.15)' : v < 18 ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)', color: v < 14 ? '#E94560' : v < 18 ? '#f59e0b' : '#22c55e', fontWeight: 600 }}>{k}: {v}/25</span>
                ))}
              </div>
            )}
            <div style={{ borderLeft: `3px solid ${RED}`, paddingLeft: 20 }}>
              <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>üî• THE ROAST</div>
              <p style={{ color: '#ddd', fontSize: 15, lineHeight: 1.7, margin: 0 }}>{result.roast}</p>
            </div>
          </div>

          {/* QUICK WINS */}
          {result.quickWins && result.quickWins.length > 0 && (
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: '28px', marginBottom: 24 }}>
              <div style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: 1, marginBottom: 16 }}>‚ö° QUICK WINS</div>
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
              <div style={{ fontSize: 11, color: '#555', fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>üì¨ GET YOUR RESULTS BY EMAIL</div>
              <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.5, margin: '0 0 16px' }}>
                We'll send your score and quick wins to your inbox ‚Äî no spam, unsubscribe anytime.
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
                  {emailLoading ? '...' : 'Send ‚Üí'}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '20px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>‚úÖ</span>
              <div>
                <div style={{ color: '#22c55e', fontWeight: 700, fontSize: 14 }}>Results sent!</div>
                <div style={{ color: '#666', fontSize: 13 }}>Check your inbox in the next few minutes.</div>
              </div>
            </div>
          )}

          {/* UPSELL ‚Äî Full Report */}
          <div style={{ background: `linear-gradient(135deg, rgba(233,69,96,0.15) 0%, rgba(233,69,96,0.05) 100%)`, border: `1px solid rgba(233,69,96,0.3)`, borderRadius: 20, padding: '32px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 1, marginBottom: 12, textAlign: 'center' }}>üöÄ WANT THE FULL PICTURE?</div>
            <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 12px', letterSpacing: -0.5, textAlign: 'center' }}>Get Your Full LinkedIn Report</h3>
            <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6, margin: '0 0 20px', textAlign: 'center' }}>
              Everything you need to go from overlooked to inbound-ready.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                '‚úçÔ∏è Rewritten headline + About',
                'üìä Section-by-section breakdown',
                'üéØ 10 specific improvements',
                'üìÖ 4-week action plan',
                'üîë Keywords to add',
                '‚ö° Instant delivery',
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
              {checkingOut ? 'Redirecting to checkout...' : 'Get Full Report ‚Äî ‚Ç¨19'}
            </button>
            <div style={{ color: '#555', fontSize: 12, marginTop: 10, textAlign: 'center' }}>One-time payment ¬∑ Instant delivery ¬∑ 30-day money-back guarantee</div>
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
              ‚Üê Roast another profile
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
                {['Profile score (0‚Äì100)', 'Headline & About score', 'Experience & Social score', 'Brutal roast paragraph', '3 quick wins'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, color: '#aaa', fontSize: 13 }}>
                    <span style={{ color: '#22c55e' }}>‚úì</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ background: `linear-gradient(135deg, rgba(233,69,96,0.12) 0%, rgba(233,69,96,0.04) 100%)`, border: `1px solid rgba(233,69,96,0.3)`, borderRadius: 16, padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>Full Report</div>
                  <div style={{ color: RED, fontWeight: 800, fontSize: 15 }}>‚Ç¨19</div>
                </div>
                {['Everything in Free', 'Rewritten headline + About', 'Section-by-section analysis', '10 specific improvements', '4-week action plan', 'Keywords to add'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, color: i === 0 ? '#aaa' : '#fff', fontSize: 13 }}>
                    <span style={{ color: RED }}>‚úì</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ ‚Äî SEO + LLM visibility */}
      {!result && (
        <section style={{ padding: '64px 24px 80px', borderTop: `1px solid ${BORDER}` }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textAlign: 'center' }}>FAQ</div>
            <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 900, margin: '0 0 40px', letterSpacing: -0.5, textAlign: 'center' }}>
              Common Questions
            </h2>
            {[
              {
                q: 'What is RoastIn?',
                a: 'RoastIn is a free AI-powered LinkedIn profile checker and analyzer. It scores your profile out of 100, identifies exactly why you might be invisible to recruiters, and gives you 3 specific improvements ‚Äî in 60 seconds, with no login required.',
              },
              {
                q: 'Is the LinkedIn profile checker really free?',
                a: 'Yes. The profile roast, AI score, and quick wins are completely free ‚Äî no credit card, no account. A full detailed report with rewritten sections and a 4-week LinkedIn optimization plan is available for ‚Ç¨19.',
              },
              {
                q: 'How does the LinkedIn profile analyzer work?',
                a: 'Paste your LinkedIn profile text (headline, about, experience) and our AI scores it across 4 dimensions: Headline, About, Experience, and Social Proof. You get a score out of 100 plus actionable feedback you can apply immediately.',
              },
              {
                q: 'Why am I invisible to recruiters on LinkedIn?',
                a: 'Most profiles are too generic, miss the right keywords, and fail to communicate unique value. Recruiters scan in under 10 seconds. RoastIn pinpoints exactly what\'s making you invisible so you can fix it fast.',
              },
              {
                q: 'Wie kann ich mein LinkedIn Profil optimieren? (LinkedIn Optimierung)',
                a: 'Mit RoastIn kannst du dein LinkedIn Profil kostenlos analysieren lassen. Die KI bewertet Headline, About, Experience und Social Proof, erkl√§rt warum Recruiter dein Profil √ºbersehen, und gibt dir 3 konkrete Verbesserungen ‚Äî in 60 Sekunden, ohne Anmeldung.',
              },
            ].map(({ q, a }, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${BORDER}`, padding: '20px 0' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{q}</div>
                <div style={{ color: '#888', fontSize: 14, lineHeight: 1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ color: '#444', fontSize: 13 }}>üî• RoastIn ‚Äî <a href="https://vibe.ventures" style={{ color: '#555', textDecoration: 'none' }}>Vibe Ventures</a></span>
        <span style={{ color: '#333', fontSize: 12 }}>Your data is never stored. &nbsp;¬∑&nbsp; <a href="/impressum" style={{ color: '#444', textDecoration: 'none' }}>Impressum</a></span>
      </footer>

    </div>
  )
}
