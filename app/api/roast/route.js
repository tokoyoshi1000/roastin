import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are RoastIn — an AI that gives brutally honest, actionable feedback on LinkedIn profiles.

Your job is two things: first, roast the profile (sharp, funny, real), then coach the person on exactly how to fix it. You're like a brutally honest sales mentor who actually wants the person to win.

Analyze the profile across four areas (each scored out of 25):
1. Headline & Tagline
2. About / Summary
3. Experience & Descriptions
4. Social Proof

Return ONLY valid JSON in this exact format:
{
  "score": <total score out of 100>,
  "categoryScores": {
    "Headline": <0-25>,
    "About": <0-25>,
    "Experience": <0-25>,
    "Social Proof": <0-25>
  },
  "roast": "<3-5 sharp, honest sentences roasting the profile. Be direct and witty. Point out the most glaring weaknesses. Don't be cruel but don't sugarcoat.>",
  "quickWins": [
    "<Highest impact fix — specific and actionable, takes < 30 min>",
    "<Second highest impact fix — specific and actionable>",
    "<Third fix — specific and actionable>"
  ],
  "shareText": "<One punchy line they'd want to screenshot and share on LinkedIn. Include their score.>"
}`

export async function POST(request) {
  try {
    const { url } = await request.json()

    if (!url || !url.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Please enter a valid LinkedIn profile URL.' }, { status: 400 })
    }

    // Step 1: Fetch profile data via Proxycurl
    const proxycurlRes = await fetch(
      `https://nubela.co/proxycurl/api/v2/linkedin?url=${encodeURIComponent(url)}&use_cache=if-present`,
      {
        headers: { Authorization: `Bearer ${process.env.PROXYCURL_API_KEY}` }
      }
    )

    if (!proxycurlRes.ok) {
      if (proxycurlRes.status === 404) {
        return NextResponse.json({ error: 'Profile not found. Make sure your LinkedIn profile is public.' }, { status: 404 })
      }
      throw new Error('Could not fetch LinkedIn profile. Make sure it is public.')
    }

    const profile = await proxycurlRes.json()

    // Step 2: Build profile summary for AI
    const profileSummary = buildProfileSummary(profile)

    // Step 3: Call OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Analyze this LinkedIn profile:\n\n${profileSummary}` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8
      })
    })

    if (!openaiRes.ok) throw new Error('AI analysis failed. Please try again.')

    const openaiData = await openaiRes.json()
    const analysis = JSON.parse(openaiData.choices[0].message.content)

    return NextResponse.json(analysis)

  } catch (err) {
    console.error('Roast error:', err)
    return NextResponse.json({ error: err.message || 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

function buildProfileSummary(profile) {
  const parts = []

  if (profile.full_name) parts.push(`Name: ${profile.full_name}`)
  if (profile.headline) parts.push(`Headline: ${profile.headline}`)
  if (profile.summary) parts.push(`About/Summary:\n${profile.summary}`)
  if (profile.city || profile.country_full_name) parts.push(`Location: ${[profile.city, profile.country_full_name].filter(Boolean).join(', ')}`)
  if (profile.connections) parts.push(`Connections: ${profile.connections}`)
  if (profile.recommendations) parts.push(`Recommendations: ${profile.recommendations}`)

  if (profile.experiences?.length > 0) {
    parts.push('\nExperience:')
    profile.experiences.slice(0, 4).forEach(exp => {
      const desc = exp.description ? `\n  Description: ${exp.description.slice(0, 300)}` : ' (no description)'
      parts.push(`- ${exp.title} at ${exp.company}${desc}`)
    })
  }

  if (profile.education?.length > 0) {
    parts.push('\nEducation:')
    profile.education.slice(0, 2).forEach(edu => {
      parts.push(`- ${edu.degree_name || 'Degree'} at ${edu.school}`)
    })
  }

  if (profile.accomplishment_courses?.length > 0) parts.push(`\nCertifications: ${profile.accomplishment_courses.length} listed`)
  if (profile.skills?.length > 0) parts.push(`\nTop Skills: ${profile.skills.slice(0, 8).map(s => s.name).join(', ')}`)

  return parts.join('\n')
}
