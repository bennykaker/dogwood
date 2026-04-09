import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

function getAnthropicKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY
  try {
    const fs = require('fs'), path = require('path')
    const file = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
    return file.match(/^ANTHROPIC_API_KEY=(.+)$/m)?.[1]?.trim() ?? ''
  } catch { return '' }
}

export async function POST(req: NextRequest) {
  const { logId, password } = await req.json()
  if (password !== 'dogwood') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch the log entry
  const { data: log, error: logErr } = await supabaseAdmin
    .from('prompt_log')
    .select('user_question, generated_prompt')
    .eq('id', logId)
    .single()

  if (logErr || !log) {
    return NextResponse.json({ error: 'Log entry not found' }, { status: 404 })
  }

  // Fetch existing topics so Opus can avoid duplicates
  const { data: existing } = await supabaseAdmin
    .from('insurance_knowledge')
    .select('topic')

  const existingTopics = (existing ?? []).map((r: { topic: string }) => r.topic).join('\n')

  const client = new Anthropic({ apiKey: getAnthropicKey() })

  const systemPrompt = `You are a BC insurance knowledge author for Dogwood, a BC insurance prompt generation tool. Your job is to write new knowledge chunks for the RAG database based on questions users have asked.

A knowledge chunk is a concise, accurate, BC-specific insurance reference document. Write for an insurance-knowledgeable audience (brokers, advisors) — not consumer language.

You must return ONLY a valid JSON object with exactly these fields:
{
  "topic": "Short descriptive topic name, e.g. 'BC Home Insurance — Wildfire Risk'",
  "keywords": ["keyword1", "keyword2"],
  "content": "The knowledge content — 3–6 paragraphs, 250–450 words"
}

Content requirements:
- Specific to British Columbia law, regulation, and practice
- Reference relevant legislation (Insurance Act, Strata Property Act, etc.) where applicable
- Cover what IS covered, what is NOT covered, key limitations, and common misconceptions
- Include BC-specific context (ICBC, strata insurance crisis, seismic zone, etc.)
- Do not duplicate the topics listed below

Keywords should be 5–12 lowercase terms that describe the topic (used for retrieval matching).

No preamble, no explanation, no markdown — return only the JSON object.`

  const userMessage = `EXISTING TOPICS (do not duplicate):
${existingTopics}

USER QUESTION THAT REVEALED A KNOWLEDGE GAP:
${log.user_question}

PROMPT WE GENERATED FOR THEM:
${log.generated_prompt}

Write a new knowledge chunk that would help answer questions like this one more accurately and completely.`

  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const raw = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''

    let chunk: { topic: string; keywords: string[]; content: string }
    try {
      chunk = JSON.parse(raw)
    } catch {
      // Try to extract JSON if Opus wrapped it
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) return NextResponse.json({ error: 'Opus returned invalid JSON' }, { status: 500 })
      chunk = JSON.parse(match[0])
    }

    if (!chunk.topic || !chunk.keywords || !chunk.content) {
      return NextResponse.json({ error: 'Incomplete chunk returned' }, { status: 500 })
    }

    // Check for duplicate topic
    const { data: dupe } = await supabaseAdmin
      .from('insurance_knowledge')
      .select('id')
      .eq('topic', chunk.topic)
      .maybeSingle()

    if (dupe) {
      return NextResponse.json({ error: `Topic "${chunk.topic}" already exists` }, { status: 409 })
    }

    // Insert the new chunk
    const { error: insertErr } = await supabaseAdmin
      .from('insurance_knowledge')
      .insert(chunk)

    if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 })

    return NextResponse.json({ ok: true, topic: chunk.topic })
  } catch (e) {
    console.error('Generate chunk error:', e)
    return NextResponse.json({ error: 'Failed to generate chunk' }, { status: 500 })
  }
}
