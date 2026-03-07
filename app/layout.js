export const metadata = {
  title: 'RoastIn — Get your LinkedIn profile roasted by AI',
  description: 'Your LinkedIn profile is costing you deals. Find out why in 60 seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif', background: '#0d0d1a', color: '#e8eaf6' }}>
        {children}
      </body>
    </html>
  )
}
