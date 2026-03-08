export default function Impressum() {
  const NAVY = '#0f0f1a'
  const CARD = '#12121f'
  const RED = '#E94560'
  const BORDER = 'rgba(255,255,255,0.07)'

  return (
    <div style={{ background: NAVY, minHeight: '100vh', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Back link */}
        <a href="/" style={{ color: RED, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>
          ← Back to RoastIn
        </a>

        {/* Heading */}
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Impressum</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 40 }}>Angaben gemäß § 5 TMG</p>

        {/* Card */}
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '32px 36px', marginBottom: 32 }}>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: RED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Verantwortlich für den Inhalt
            </h2>
            <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: 15, margin: 0 }}>
              Alexander Koberstein<br />
              Pulverteich 20–22<br />
              20099 Hamburg<br />
              Deutschland
            </p>
          </section>

          <div style={{ height: 1, background: BORDER, marginBottom: 32 }} />

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: RED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kontakt
            </h2>
            <p style={{ color: '#ccc', lineHeight: 1.7, fontSize: 15, margin: 0 }}>
              E-Mail: <a href="mailto:kobersteinalex@gmail.com" style={{ color: '#aaa', textDecoration: 'none' }}>kobersteinalex@gmail.com</a>
            </p>
          </section>

          <div style={{ height: 1, background: BORDER, marginBottom: 32 }} />

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: RED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Hinweise
            </h2>
            <p style={{ color: '#888', lineHeight: 1.7, fontSize: 14, margin: 0 }}>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>
                https://ec.europa.eu/consumers/odr
              </a>
              . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <div style={{ height: 1, background: BORDER, marginBottom: 32 }} />

          <section>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: RED, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Haftungsausschluss
            </h2>
            <p style={{ color: '#888', lineHeight: 1.7, fontSize: 14, margin: 0 }}>
              Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            </p>
          </section>

        </div>

        {/* Footer */}
        <p style={{ color: '#555', fontSize: 12, textAlign: 'center' }}>
          🔥 RoastIn — <a href="https://vibe.ventures" style={{ color: '#555', textDecoration: 'none' }}>Vibe Ventures</a>
        </p>

      </div>
    </div>
  )
}
