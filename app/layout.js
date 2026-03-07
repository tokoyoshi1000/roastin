/**
 * app/layout.js
 *
 * RoastIn — Root Layout
 * =====================
 * Sets global HTML structure, metadata (SEO), and typography.
 * Loads Inter font via Google Fonts for a clean, professional feel.
 *
 * Applies globally:
 *   - Dark background (#08080f) — consistent with the brand palette
 *   - Inter font family with system font fallbacks
 *   - WebKit font smoothing for sharp text rendering on Mac/iOS
 */

export const metadata = {
  title: 'RoastIn — Get your LinkedIn profile roasted by AI',
  description: 'Your LinkedIn profile is costing you deals. Find out exactly why — free AI analysis in 60 seconds.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Inter: clean, professional, highly legible — perfect for a B2B tool */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
        background: '#08080f',   // Near-black: premium, focused, dark-mode native
        color: '#e8eaf6',        // Soft white: easier on the eyes than pure #fff
        WebkitFontSmoothing: 'antialiased'
      }}>
        {children}
      </body>
    </html>
  )
}
