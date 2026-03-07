export const metadata = {
  title: 'RoastIn — Get your LinkedIn profile roasted by AI',
  description: 'Your LinkedIn profile is costing you deals. Find out exactly why — free AI analysis in 60 seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        background: '#08080f',
        color: '#e8eaf6',
        WebkitFontSmoothing: 'antialiased'
      }}>
        {children}
      </body>
    </html>
  )
}
