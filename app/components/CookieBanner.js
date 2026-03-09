'use client'
import { useState, useEffect } from 'react'

const GA_ID = 'G-PVZ0063LS1'
const RED = '#E94560'
const CARD = '#12121f'

function loadGA() {
  if (typeof window === 'undefined') return
  if (window._gaLoaded) return
  window._gaLoaded = true

  const s = document.createElement('script')
  s.async = true
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)
}

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie_consent')
      if (consent === 'accepted') {
        loadGA()
      } else if (!consent) {
        setShow(true)
      }
    } catch (e) {}
  }, [])

  function accept() {
    try { localStorage.setItem('cookie_consent', 'accepted') } catch (e) {}
    setShow(false)
    loadGA()
  }

  function decline() {
    try { localStorage.setItem('cookie_consent', 'rejected') } catch (e) {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: CARD,
      borderTop: '1px solid rgba(255,255,255,0.1)',
      padding: '20px 32px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 16, flexWrap: 'wrap',
      boxShadow: '0 -4px 30px rgba(0,0,0,0.4)',
    }}>
      <p style={{ color: '#ccc', fontSize: 14, margin: 0, flex: 1, minWidth: 260, lineHeight: 1.6 }}>
        🍪 Wir nutzen Cookies und Google Analytics, um unsere Website zu verbessern. Mehr Infos in unserer{' '}
        <a href="/datenschutz" style={{ color: RED, textDecoration: 'underline' }}>Datenschutzerklärung</a>.
      </p>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#888',
            padding: '9px 20px',
            borderRadius: 8,
            fontSize: 14,
            cursor: 'pointer',
            transition: 'border-color 0.2s',
          }}
        >
          Nur notwendige
        </button>
        <button
          onClick={accept}
          style={{
            background: RED,
            border: 'none',
            color: '#fff',
            padding: '9px 20px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Alle akzeptieren
        </button>
      </div>
    </div>
  )
}
