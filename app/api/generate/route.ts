import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

const DEFAULT_TEMPLATE = `I need help understanding a BC insurance situation. Here is my context:

[USER_SITUATION]

Relevant BC insurance context you should know:
[KNOWLEDGE_CONTEXT]

Please help me by:
1. Identifying what type of insurance coverage is relevant to my situation
2. Explaining what a standard BC policy would and would not cover in this scenario
3. Identifying any BC-specific regulations or considerations I should know about
4. Telling me what specific questions I should ask my insurance broker
5. Flagging any common misconceptions about this type of coverage in BC

Please be specific to British Columbia insurance regulations and ICBC where relevant. Do not give me generic insurance information — I need BC-specific guidance.`

function getAnthropicKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY
  try {
    const fs = require('fs'), path = require('path')
    const file = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
    return file.match(/^ANTHROPIC_API_KEY=(.+)$/m)?.[1]?.trim() ?? ''
  } catch { return '' }
}

export async function POST(req: NextRequest) {
  const { question, sessionId } = await req.json()
  if (!question?.trim()) return NextResponse.json({ error: 'Question is required' }, { status: 400 })

  // Fetch stored template (latest)
  const { data: templateRow } = await supabaseAdmin
    .from('prompt_template')
    .select('template')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const masterTemplate = templateRow?.template ?? DEFAULT_TEMPLATE

  // Fetch all knowledge chunks — small enough to include all in every call
  const { data: knowledge } = await supabaseAdmin
    .from('insurance_knowledge')
    .select('topic, content')
    .order('id')

  const knowledgeText = (knowledge ?? [])
    .map(k => `[${k.topic}]\n${k.content}`)
    .join('\n\n---\n\n')

  const client = new Anthropic({ apiKey: getAnthropicKey() })

  const systemPrompt = `You are a BC insurance prompt engineer for Dogwood. Your job is to take a user's insurance situation and produce a single, expertly-structured prompt they can paste into any AI to get a genuinely expert BC-specific answer.

You will be given:
1. A master prompt template with [USER_SITUATION] and [KNOWLEDGE_CONTEXT] placeholders
2. BC insurance knowledge chunks
3. The user's raw situation description

Your task:
- Rewrite the user's situation in clear, precise language (fix vague terms, add specificity, preserve their intent)
- Select the 3–5 most relevant knowledge chunks and format them clearly
- Populate the template placeholders with your rewritten content
- Return ONLY the final populated prompt — no preamble, no explanation, no commentary`

  const userMessage = `MASTER TEMPLATE:
${masterTemplate}

BC INSURANCE KNOWLEDGE:
${knowledgeText}

USER'S SITUATION:
${question}`

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const prompt = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''

    // Log to prompt_log
    await supabaseAdmin.from('prompt_log').insert({
      user_question: question,
      generated_prompt: prompt,
      prompt_type: 'initial',
      session_id: sessionId ?? null,
    })

    return NextResponse.json({ prompt })
  } catch (e) {
    console.error('Generate error:', e)
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 })
  }
}
