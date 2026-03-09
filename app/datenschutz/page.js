export const metadata = {
  title: 'Datenschutzerklärung | RoastIn',
  robots: { index: false },
}

const RED = '#E94560'
const CARD = '#12121f'
const BORDER = 'rgba(255,255,255,0.07)'

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: RED, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h2>
      {children}
    </section>
  )
}

function P({ children, style }) {
  return <p style={{ color: '#ccc', lineHeight: 1.8, fontSize: 15, margin: '0 0 12px', ...style }}>{children}</p>
}

function Divider() {
  return <div style={{ height: 1, background: BORDER, margin: '32px 0' }} />
}

export default function Datenschutz() {
  return (
    <main style={{ background: '#0f0f1a', minHeight: '100vh', color: '#fff', fontFamily: "'Inter', system-ui, sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <a href="/" style={{ color: RED, textDecoration: 'none', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 40 }}>← Zurück zu RoastIn</a>

        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Datenschutzerklärung</h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 48 }}>Stand: März 2026</p>

        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '36px 40px' }}>

          <Section title="1. Verantwortlicher">
            <P>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</P>
            <P>
              Alexander Koberstein<br />
              Pulverteich 20–22<br />
              20099 Hamburg<br />
              Deutschland<br />
              E-Mail: <a href="mailto:kobersteinalex@gmail.com" style={{ color: '#aaa' }}>kobersteinalex@gmail.com</a>
            </P>
          </Section>

          <Divider />

          <Section title="2. Allgemeines zur Datenverarbeitung">
            <P>Wir verarbeiten personenbezogene Daten nur, soweit dies zur Bereitstellung unserer Dienste erforderlich ist oder eine gesetzliche Grundlage nach Art. 6 DSGVO vorliegt. Rechtsgrundlagen sind insbesondere:</P>
            <P>
              <strong style={{ color: '#fff' }}>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung (Bereitstellung des Analyse-Tools)<br />
              <strong style={{ color: '#fff' }}>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung (z. B. Google Analytics, E-Mail-Marketing)<br />
              <strong style={{ color: '#fff' }}>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigte Interessen (z. B. Server-Logs zur Sicherheit)
            </P>
          </Section>

          <Divider />

          <Section title="3. Hosting (Vercel)">
            <P>Diese Website wird bei Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA gehostet. Vercel verarbeitet beim Aufruf unserer Website automatisch Server-Logfiles, die folgende Daten enthalten können: IP-Adresse, Browser-Typ, Datum und Uhrzeit des Zugriffs sowie aufgerufene Seiten. Diese Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der sicheren und fehlerfreien Bereitstellung des Dienstes).</P>
            <P>Die Übermittlung in die USA erfolgt auf Grundlage der EU-Standardvertragsklauseln (Art. 46 DSGVO). Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>vercel.com/legal/privacy-policy</a></P>
          </Section>

          <Divider />

          <Section title="4. LinkedIn-Profil-Analyse">
            <P>Zur Nutzung unseres Analyse-Tools fügst du deinen LinkedIn-Profiltext in ein Formular ein. Dieser Text wird zur Analyse an die OpenAI API (OpenAI, L.L.C., 3180 18th Street, San Francisco, CA 94110, USA) übermittelt und dort verarbeitet, um Bewertungen und Empfehlungen zu generieren.</P>
            <P>Wir speichern deinen Profiltext nicht dauerhaft. Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. a DSGVO (Einwilligung durch aktives Einreichen). Die Übermittlung in die USA erfolgt auf Basis von EU-Standardvertragsklauseln.</P>
            <P>Weitere Informationen zur Datenverarbeitung durch OpenAI: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>openai.com/privacy</a></P>
          </Section>

          <Divider />

          <Section title="5. E-Mail-Erfassung">
            <P>Wenn du deine E-Mail-Adresse angibst (z. B. um dein Ergebnis zugeschickt zu bekommen), verarbeiten wir diese ausschließlich zu diesem Zweck. Eine Weitergabe an Dritte erfolgt nicht ohne deine Einwilligung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO.</P>
            <P>Du kannst deine Einwilligung jederzeit widerrufen, indem du uns eine E-Mail an <a href="mailto:kobersteinalex@gmail.com" style={{ color: '#aaa' }}>kobersteinalex@gmail.com</a> sendest.</P>
          </Section>

          <Divider />

          <Section title="6. Google Analytics">
            <P>Diese Website nutzt Google Analytics 4, einen Webanalysedienst der Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA (bzw. Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland für Nutzer im EWR).</P>
            <P>Google Analytics verwendet Cookies und ähnliche Technologien, um die Nutzung der Website zu analysieren. Die erzeugten Informationen (z. B. aufgerufene Seiten, Verweildauer, ungefährer Standort) werden an Google-Server übertragen und dort gespeichert. Die IP-Adresse wird in GA4 standardmäßig anonymisiert.</P>
            <P><strong style={{ color: '#fff' }}>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung). Die Übermittlung in die USA erfolgt auf Basis der EU-Standardvertragsklauseln. Wir haben mit Google einen Auftragsverarbeitungsvertrag (AVV) geschlossen.</P>
            <P><strong style={{ color: '#fff' }}>Opt-Out:</strong> Du kannst der Datenerfassung durch Google Analytics widersprechen, indem du das Browser-Add-on zur Deaktivierung installierst: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>tools.google.com/dlpage/gaoptout</a></P>
            <P>Datenspeicherung in Google Analytics ist auf 2 Monate begrenzt. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>policies.google.com/privacy</a></P>
          </Section>

          <Divider />

          <Section title="7. Cookies">
            <P>Unsere Website verwendet Cookies und ähnliche Technologien. Technisch notwendige Cookies werden auf Basis von Art. 6 Abs. 1 lit. f DSGVO gesetzt. Analyse-Cookies (Google Analytics) werden nur mit deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) gesetzt.</P>
            <P>Du kannst Cookies in deinen Browser-Einstellungen jederzeit löschen oder deaktivieren.</P>
          </Section>

          <Divider />

          <Section title="8. Deine Rechte">
            <P>Du hast folgende Rechte bezüglich deiner personenbezogenen Daten:</P>
            <P>
              <strong style={{ color: '#fff' }}>Auskunft</strong> (Art. 15 DSGVO) – Welche Daten wir über dich speichern<br />
              <strong style={{ color: '#fff' }}>Berichtigung</strong> (Art. 16 DSGVO) – Korrektur unrichtiger Daten<br />
              <strong style={{ color: '#fff' }}>Löschung</strong> (Art. 17 DSGVO) – Recht auf Vergessenwerden<br />
              <strong style={{ color: '#fff' }}>Einschränkung</strong> (Art. 18 DSGVO) – Einschränkung der Verarbeitung<br />
              <strong style={{ color: '#fff' }}>Widerspruch</strong> (Art. 21 DSGVO) – Widerspruch gegen die Verarbeitung<br />
              <strong style={{ color: '#fff' }}>Datenübertragbarkeit</strong> (Art. 20 DSGVO) – Daten in maschinenlesbarem Format<br />
              <strong style={{ color: '#fff' }}>Widerruf</strong> – Jederzeit Widerruf einer erteilten Einwilligung
            </P>
            <P>Zur Ausübung deiner Rechte wende dich an: <a href="mailto:kobersteinalex@gmail.com" style={{ color: '#aaa' }}>kobersteinalex@gmail.com</a></P>
            <P>Außerdem hast du das Recht, dich bei der zuständigen Datenschutz-Aufsichtsbehörde zu beschweren. In Hamburg ist das der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit: <a href="https://www.datenschutz.hamburg.de" target="_blank" rel="noopener noreferrer" style={{ color: '#aaa' }}>www.datenschutz.hamburg.de</a></P>
          </Section>

          <Divider />

          <Section title="9. Änderungen dieser Datenschutzerklärung">
            <P>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an geänderte Rechtslage oder Änderungen unseres Dienstes anzupassen. Die aktuelle Version ist stets auf dieser Seite verfügbar.</P>
          </Section>

        </div>

        <p style={{ color: '#555', fontSize: 12, textAlign: 'center', marginTop: 32 }}>
          🔥 RoastIn — <a href="https://vibe.ventures" style={{ color: '#555', textDecoration: 'none' }}>Vibe Ventures</a>
        </p>
      </div>
    </main>
  )
}
