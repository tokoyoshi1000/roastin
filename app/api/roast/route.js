/**
 * app/api/roast/route.js
 *
 * RoastIn — Core API Route
 * ========================
 * Accepts a POST request with the user's LinkedIn profile text,
 * sends it to OpenAI GPT-4o, and returns a structured JSON analysis.
 *
 * Flow:
 *   1. Validate input (text must be >= 50 chars)
 *   2. Call OpenAI GPT-4o with system prompt (JSON mode enabled)
 *   3. Parse and return the structured analysis
 *
 * No database. No auth. Stateless.
 *
 * @requires OPENAI_API_KEY environment variable
 */

import { NextResponse } from 'next/server'

/**
 * System prompt for GPT-4o.
 *
 * Persona: Brutally honest sales mentor who wants the user to win.
 * Tone: Sharp, witty, direct — not cruel, not sugarcoated.
 *
 * Scoring categories (each /25, total /100):
 *   - Headline & Tagline: Is it specific, memorable, value-driven?
 *   - About / Summary: Does it tell a story or just list buzzwords?
 *   - Experience & Descriptions: Are there metrics, achievements, impact?
 *   - Social Proof: Recommendations, certifications, endorsements.
 *
 * Response format: strict JSON (enforced via response_format: json_object)
 */
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

/**
 * POST /api/roast
 *
 * @param {Request} request - Next.js Request object
 * @body {{ text: string }} - Raw LinkedIn profile text (pasted by user)
 * @returns {NextResponse} JSON analysis or error response
 *
 * Cost estimate: ~$0.005–0.015 per request (GPT-4o, ~1500 input tokens)
 */
export async function POST(request) {
  try {
    // ── 1. Parse and validate input ──────────────────────────────────────────
    const { text } = await request.json()

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please paste more of your profile — at least your headline and About section.' },
        { status: 400 }
      )
    }

    // ── 2. Call OpenAI GPT-4o ────────────────────────────────────────────────
    // Using JSON mode to guarantee structured output (no hallucinated formatting).
    // Temperature 0.8: sharp and opinionated but not chaotic.
    // Input capped at 6000 chars to stay within a reasonable token budget.
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
        response_format: { type: 'json_object' }, // Enforces valid JSON output
        temperature: 0.8
      })
    })

    if (!openaiRes.ok) throw new Error('AI analysis failed. Please try again.')

    // ── 3. Parse and return the analysis ─────────────────────────────────────
    const openaiData = await openaiRes.json()
    const analysis = JSON.parse(openaiData.choices[0].message.content)

    return NextResponse.json(analysis)

  } catch (err) {
    // Log server-side for debugging, return generic message to client
    console.error('Roast error:', err)
    return NextResponse.json(
      { error: err.message || 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
