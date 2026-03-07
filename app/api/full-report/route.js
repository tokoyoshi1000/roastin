import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const SYSTEM_PROMPT = `You are a brutally honest LinkedIn profile expert and elite career coach.
Analyze the LinkedIn profile text and return a comprehensive JSON report.

Return ONLY valid JSON with this exact structure:
{
  "score": <number 0-100>,
  "breakdown": {
    "headline": { "score": <0-25>, "analysis": "<detailed analysis>", "rewrite": "<improved version>" },
    "about": { "score": <0-25>, "analysis": "<detailed analysis>", "rewrite": "<improved version>" },
    "experience": { "score": <0-25>, "analysis": "<detailed analysis>", "improvements": ["<imp 1>", "<imp 2>", "<imp 3>"] },
    "socialProof": { "score": <0-25>, "analysis": "<detailed analysis>", "suggestions": ["<sug 1>", "<sug 2>", "<sug 3>"] }
  },
  "roast": "<brutally honest but constructive 3-4 sentence roast>",
  "quickWins": ["<win 1>", "<win 2>", "<win 3>"],
  "fullImprovements": ["<imp 1>","<imp 2>","<imp 3>","<imp 4>","<imp 5>","<imp 6>","<imp 7>","<imp 8>","<imp 9>","<imp 10>"],
  "actionPlan": {
    "week1": ["<action 1>", "<action 2>", "<action 3>"],
    "week2": ["<action 1>", "<action 2>", "<action 3>"],
    "week3": ["<action 1>", "<action 2>"],
    "week4": ["<action 1>", "<action 2>"]
  },
  "keywords": ["<kw 1>", "<kw 2>", "<kw 3>", "<kw 4>", "<kw 5>"]
}`

export async function POST(request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const { text, sessionId } = await request.json()
    if (!text || text.trim().length < 50) {
      return NextResponse.json({ error: 'Please paste your LinkedIn profile text.' }, { status: 400 })
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not verified.' }, { status: 403 })
    }
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: 'Analyze this LinkedIn profile:\n\n' + text.slice(0, 8000) }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    })
    const openaiData = await openaiRes.json()
    const analysis = JSON.parse(openaiData.choices[0].message.content)
    return NextResponse.json(analysis)
  } catch (err) {
    console.error('Full report error:', err)
    return NextResponse.json({ error: 'Failed to generate report.' }, { status: 500 })
  }
}