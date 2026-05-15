import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'

// Try multiple locations for .env
dotenv.config({ path: path.join(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })
dotenv.config()

const apiKey = process.env.NVIDIA_API_KEY
if (!apiKey) {
  console.error('\n❌ NVIDIA_API_KEY is not set. Add it to your .env file in the project root.\n')
  process.exit(1)
}

const app = express()
app.use(cors({
  origin: [
    'https://lead-gen-builder-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ],
  credentials: true,
}))
app.use(express.json())

function cleanJson(raw: string): string {
  // Extract outermost {...} block
  const match = raw.match(/\{[\s\S]*\}/)
  const text = match ? match[0] : raw
  // Remove trailing commas before } or ]
  return text.replace(/,(\s*[}\]])/g, '$1')
}

function parseJson<T>(text: string): T {
  try {
    return JSON.parse(text) as T
  } catch {
    return JSON.parse(cleanJson(text)) as T
  }
}

const openai = new OpenAI({
  apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/recommend', async (req, res) => {
  const { orgName, mission, vision, activities, audience } = req.body

  if (!orgName || !mission || !activities || !audience) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: `You are an expert lead generation strategist specialising in charities, CICs, and social enterprises in the UK.

Analyse this organisation and recommend the single best lead generation format for them. Your recommendation must be grounded in what will genuinely engage their specific audience — not a generic choice.

Organisation: ${orgName}
Mission: ${mission}
Vision: ${vision || 'Not provided'}
Key Activities: ${activities}
Target Audience: ${audience}

FORMAT GUIDE — use this to make your decision:
- quiz: Best for orgs whose audience wants to test their knowledge, discover where they stand, or be categorised into a meaningful result. Works well for awareness/education-focused causes. Tone can be fun or serious. Cold audiences respond well to "find out where you stand" framing.
- self-assessment: Best for service-delivery orgs where the audience needs to recognise their own situation or readiness before seeking support. Helps people see their own need without being told. Effective when the audience may not know they need help yet.
- checklist: Best for orgs with a practical, action-oriented mission where the audience benefits from taking small, structured steps. Works well for capacity-building, health, employability, and community development. Each item should feel like a meaningful small win.
- audit: Best for orgs working with other organisations, professionals, or decision-makers who need to benchmark their current practices. Strongest when the audience has existing processes to review against a standard or framework.

Key principle: the best format is the one that gives the target audience the most immediate, genuine value — and naturally surfaces the organisation's expertise and relevance in the process.

Return ONLY this JSON object. No markdown. No explanation. No code fences.
{"format":"quiz","reason":"A specific, audience-focused 2-sentence reason that explains why this format will resonate with this particular audience and serve this organisation's goals"}`,
        },
      ],
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ''

    let parsed: { format: string; reason: string }
    try {
      parsed = parseJson<{ format: string; reason: string }>(text)
    } catch {
      return res.status(500).json({ error: 'Could not parse AI recommendation' })
    }

    const validFormats = ['quiz', 'self-assessment', 'checklist', 'audit']
    if (!validFormats.includes(parsed.format)) {
      parsed.format = 'quiz'
    }

    return res.json(parsed)
  } catch (error) {
    console.error('Recommend error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate recommendation'
    return res.status(500).json({ error: message })
  }
})

app.post('/api/generate', async (req, res) => {
  const { orgName, mission, vision, activities, audience, format } = req.body

  if (!orgName || !mission || !activities || !audience || !format) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const isChecklist = format === 'checklist'
  const contentField = isChecklist
    ? `"items": [{"title": "short action title", "detail": "1-2 sentence guidance"}]`
    : `"questions": [{"question": "question text", "options": ["Option A", "Option B", "Option C", "Option D"]}]`

  const contentGuidance = isChecklist
    ? `Create 8-12 checklist items for ${audience}. Rules:
- Start with the easiest, most accessible actions and build in difficulty
- Each item should feel like a genuine small win that connects to the bigger mission
- Frame items positively — what they CAN do, not what they're failing at
- Make each item specific enough to be actionable today, not vague aspirations
- The detail field should add a brief "why this matters" or practical tip
- Together, the items should tell a story of meaningful progress`
    : `Create 6-8 questions with exactly 4 options each for ${audience}. Rules:
- Start with a warm, easy opening question that draws people in — not a hard one
- Progress from surface-level awareness to deeper self-reflection
- Each question should feel genuinely interesting to answer, not like an admin form
- Options must be meaningfully different from each other — no "all of the above" or vague choices
- At least one option per question should feel relatable to someone who is struggling or early in their journey
- Questions should surface the audience's needs and naturally demonstrate ${orgName}'s expertise
- Use plain, conversational language — avoid jargon`

  try {
    const completion = await openai.chat.completions.create({
      model: 'meta/llama-3.3-70b-instruct',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `You are an expert lead generation strategist specialising in charities, CICs, and social enterprises in the UK.

Create a complete, high-converting ${format} lead gen tool for this organisation. This tool will be seen by cold audiences — people who may have never heard of the organisation. It must deliver genuine value on its own, while naturally building trust in ${orgName}.

Organisation: ${orgName}
Mission: ${mission}
Vision: ${vision || 'Not provided'}
Key Activities: ${activities}
Target Audience: ${audience}
Format: ${format}

${contentGuidance}

TONE PRINCIPLES (apply throughout):
- Warm, human, community-rooted — not corporate or salesy
- Speak to the audience's lived experience, not at them
- Use "you" language that centres the person, not the organisation
- Build trust through specificity — vague tools don't convert
- The audience should feel seen and understood, not assessed or judged

EMAIL GATE PRINCIPLES:
- The emailGateTitle should feel like a reward, not a transaction
- The emailGateCopy should hint at a welcome journey: what they'll receive, why it matters, and a sense of what comes next
- Avoid "sign up to our newsletter" framing — instead, lead with the specific value they're getting
- The ctaText should be action-oriented and benefit-led (e.g. "Get My Action Plan", "Send My Results", "Claim Your Guide") — never just "Submit" or "Send"

SOCIAL POST PRINCIPLES:
- Must resonate with cold audiences who have never heard of ${orgName}
- Lead with a hook that speaks to a shared value or pain point
- Mention the tool explicitly and why someone should try it
- Under 280 characters including hashtags

Return ONLY this JSON object. No markdown. No code fences. No explanation.
{
  "title": "compelling title that speaks to the audience's situation (under 60 chars)",
  "description": "1-2 sentences that hook a cold reader and make them want to start — focus on what they'll discover or gain",
  ${contentField},
  "emailGateTitle": "reward-framed title for the email capture (e.g. 'Your Personalised Action Plan is Ready')",
  "emailGateCopy": "2-3 sentences that explain the specific value they'll receive, hint at the welcome journey, and feel warm not transactional",
  "ctaText": "benefit-led CTA button text (under 40 chars)",
  "socialPost": "cold-audience LinkedIn/social post with hook, tool mention, and call to action (under 280 chars total with hashtags)",
  "emailSubject": "curiosity-driven follow-up email subject line (under 60 chars)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"]
}`,
        },
      ],
    })

    const text = completion.choices[0]?.message?.content?.trim() ?? ''

    let parsed: Record<string, unknown>
    try {
      parsed = parseJson<Record<string, unknown>>(text)
    } catch {
      return res.status(500).json({ error: 'Could not parse AI response — please try again' })
    }

    return res.json(parsed)
  } catch (error) {
    console.error('Generate error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate tool'
    return res.status(500).json({ error: message })
  }
})

if (!process.env.VERCEL) {
  const PORT = parseInt(process.env.PORT || '3001', 10)
  app.listen(PORT, () => {
    console.log(`\n🥑 Avocado Hub API running on http://localhost:${PORT}`)
  })
}

export default app
