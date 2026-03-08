import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { email, score } = await request.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Always log — visible in Vercel function logs
    console.log(`NEW_EMAIL_CAPTURE email=${email} score=${score}`)

    // Send notification to Alex if Resend is configured
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'RoastIn <noreply@roastin.me>',
          to: [process.env.NOTIFICATION_EMAIL || 'alex.koberstein@icloud.com'],
          subject: `🔥 New RoastIn lead — Score: ${score}`,
          html: `<p><strong>New email captured on RoastIn!</strong></p><p>Email: <strong>${email}</strong></p><p>Profile Score: <strong>${score}/100</strong></p>`,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Email capture error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
