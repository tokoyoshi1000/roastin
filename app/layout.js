/**
import CookieBanner from './components/CookieBanner'
 * app/layout.js â RoastIn Root Layout & SEO
 *
 * Full metadata for Google #1 ranking on:
 * - linkedin profile checker
 * - linkedin profile analyzer
 * - linkedin profile roast
 * - linkedin profile tips
 * - linkedin optimierung
 */

export const metadata = {
  metadataBase: new URL('https://roastin.me'),
  title: {
    default: 'Free LinkedIn Profile Checker & Roast | AI Score in 60s | RoastIn',
    template: '%s | RoastIn',
  },
  description:
    'Free AI-powered LinkedIn profile checker and analyzer. Find out why you\'re invisible to recruiters â get your score out of 100, a brutally honest roast, and 3 quick fixes in 60 seconds. LinkedIn Optimierung kostenlos.',
  keywords: [
    'linkedin profile checker',
    'linkedin profile analyzer',
    'linkedin profile roast',
    'linkedin profile tips',
    'linkedin optimierung',
    'linkedin profile score',
    'linkedin profile review',
    'free linkedin analysis',
    'linkedin profile improvement',
    'linkedin recruiter visibility',
    'linkedin ai analyzer',
  ],
  authors: [{ name: 'RoastIn', url: 'https://roastin.me' }],
  creator: 'RoastIn',
  publisher: 'Vibe Ventures',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['de_DE'],
    url: 'https://roastin.me',
    siteName: 'RoastIn',
    title: 'Free LinkedIn Profile Checker â Find Out Why Recruiters Skip You',
    description:
      'Paste your LinkedIn profile, get an AI score out of 100, a brutally honest roast, and 3 actionable fixes. Free. No login. 60 seconds.',
    images: [
      {
        url: 'https://roastin.me/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RoastIn â Free LinkedIn Profile Checker & Analyzer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free LinkedIn Profile Checker & Roast | RoastIn',
    description:
      'Find out why recruiters skip your profile. Free AI roast, score out of 100, and 3 fixes â in 60 seconds.',
    images: ['https://roastin.me/og-image.png'],
  },
  alternates: {
    canonical: 'https://roastin.me',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: '#0f0f1a',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <CookieBanner />
        {children}
      </body>
    </html>
  )
}
