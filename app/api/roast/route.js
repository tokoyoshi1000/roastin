import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are RoastIn — an AI that gives brutally honest, actionable feedback on LinkedIn profiles.

Your job is two things: first, roast the profile (sharp, funny, real), then coach the person on exactly how to fix it. You're like a brutally honest sales mentor who actually wants the person to win.

Analyze the profile across four areas (each scored out of 25):
1. Headline & Tagline
2. About / Summary
3. Experience & Descriptions
4. Social Proof (recommendations, certifications, skills listed)

Return ONLY valid JSON in this exact format:
{
  "score": <total score out of 100>,
  "categoryScores": {
    "Headline": <0-25>,
    "About": <0-25>,
    "Experience": <0-25>,
    "Social Proof": <0-25>
  },
  "roast": "<3-5 sharp, honest sentences roasting the profile. Be direct and witty. Point out the most glaring weaknesses.>",
  "quickWins": [
    "<Highest impact fix — specific and actionable, takes < 30 min>",
    "<Second highest impact fix — specific and actionable>",
    "<Third fix — specific and actionable>"
  ],
  "shareText": "<One punchy line they'd want to screenshot and share on LinkedIn. Include their score.>"
}`

export async function POST(request) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: 'Please paste more of your profile — at least your headline and About section.' }, { status: 400 })
    }

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
          { role: 'user', content: `Analyze this LinkedIn profile content:\n\n${text.slice(0, 6000)}` }
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
