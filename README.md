# 🔥 RoastIn

> AI-powered LinkedIn profile roast & optimizer — built in one day as part of [Vibe Ventures](https://github.com/tokoyoshi1000).

**Live:** [roastin.vercel.app](https://roastin.vercel.app) · **Domain:** roastin.me (pending)

---

## What is RoastIn?

RoastIn analyzes your LinkedIn profile and delivers:
- A **score out of 100** across 4 categories (Headline, About, Experience, Social Proof)
- A **brutally honest roast** — real feedback, not sugarcoated
- **3 Quick Wins** — specific, actionable fixes you can do in under 30 minutes
- An optional **€9 Full Report** (Stripe integration — coming soon)

Target audience: Sales professionals, job seekers, freelancers, and anyone who relies on LinkedIn to generate business.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router) | Full control, Vercel-native, fast iteration |
| AI | OpenAI GPT-4o (JSON mode) | Best reasoning + structured output |
| Hosting | Vercel (free tier) | Auto-deploy from GitHub, edge network |
| Font | Inter via Google Fonts | Clean, professional, widely trusted |
| Payments | Stripe (upcoming) | Industry standard, easy integration |

No database. No auth. No external data APIs. The user provides their own profile text.

---

## Architecture

```
User pastes LinkedIn text
        │
        ▼
app/page.js (React frontend)
        │  POST { text }
        ▼
app/api/roast/route.js (Next.js API Route)
        │
        ├─ Validate: text must be > 50 chars
        │
        ├─ Call OpenAI GPT-4o
        │   ├─ System prompt: hybrid roast + coach persona
        │   ├─ JSON mode: enforces structured response
        │   └─ temperature: 0.8 (sharp but not unhinged)
        │
        └─ Return JSON:
            ├─ score (0–100)
            ├─ categoryScores { Headline, About, Experience, Social Proof }
            ├─ roast (3–5 sentences)
            ├─ quickWins [3 items]
            └─ shareText (1 punchy line for sharing)
```

---

## Key Design Decisions

### Why text paste instead of LinkedIn URL?
Proxycurl (the leading LinkedIn data API) was shut down in January 2025 after a LinkedIn lawsuit. All remaining third-party scraping APIs carry the same legal risk. 

**Decision:** User copies their own profile text (Ctrl+A → Ctrl+C on their profile page). This is:
- ✅ Zero legal risk — user provides their own data
- ✅ Zero API cost
- ✅ Actually richer data (includes private stats visible only to the user)
- ⚠️ Slightly more friction — acceptable for MVP

### Why Next.js over no-code (Framer + Make.com)?
- Lower monthly cost at scale
- Full control over UX and AI prompt tuning
- No vendor lock-in
- Claude can maintain and iterate the code without the founder needing technical skills

### Why GPT-4o over Claude?
- JSON mode is more reliable for structured output
- Slightly sharper / more opinionated tone for roasting (desired)
- Can switch to Claude Sonnet 3.5 later for cost reduction

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/tokoyoshi1000/roastin.git
cd roastin

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | OpenAI API key — get at [platform.openai.com](https://platform.openai.com/api-keys) |

---

## Deployment

Deployed on Vercel via GitHub integration. Every push to `main` triggers an automatic production deployment.

1. Fork / clone this repo
2. Import into [vercel.com/new](https://vercel.com/new)
3. Add `OPENAI_API_KEY` environment variable
4. Deploy

---

## Roadmap

### Week 1 (current)
- [x] Core roast + score functionality
- [x] GPT-4o integration with JSON mode
- [x] Full frontend redesign (nav, hero, example preview)
- [ ] Connect roastin.me domain
- [ ] Delete temporary GitHub PAT

### Week 2+
- [ ] Stripe €9 full report payment
- [ ] Email delivery of full report (Resend)
- [ ] Share card generator (OG image with score)
- [ ] Counter: real "profiles roasted" from DB (Supabase or Upstash)
- [ ] LinkedIn OAuth for one-click profile import (legal, no scraping)

---

## Vibe Ventures

RoastIn is Week 1 of **Vibe Ventures** — a project building one startup per week using AI, documenting everything publicly.

- 🏢 **Umbrella brand:** Vibe Ventures
- 📖 **Content series:** Vibe Ventures Diary (LinkedIn / Social)
- 🚀 **Week 1 product:** RoastIn (roastin.me)

Follow the build: [@alexkoberstein on LinkedIn](https://linkedin.com/in/alexkoberstein)

---

## License

MIT — fork it, build on it, roast someone.
