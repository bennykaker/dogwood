import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'

function getAnthropicKey(): string {
  if (process.env.ANTHROPIC_API_KEY) return process.env.ANTHROPIC_API_KEY
  try {
    const fs = require('fs'), path = require('path')
    const file = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
    return file.match(/^ANTHROPIC_API_KEY=(.+)$/m)?.[1]?.trim() ?? ''
  } catch { return '' }
}

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== 'dogwood') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = new Anthropic({ apiKey: getAnthropicKey() })

  const prompt = `You are an expert in British Columbia insurance law, ICBC, strata insurance, and the Insurance Council of BC regulatory framework.

Design a master prompt template for Dogwood — a tool that helps BC residents ask better insurance questions. This template will be populated by a fast AI model for each user request. It must:

1. Work as a complete, self-contained prompt a user can paste into any AI assistant
2. Use [USER_SITUATION] as the exact placeholder for the user's specific context
3. Use [KNOWLEDGE_CONTEXT] as the exact placeholder for injected BC insurance knowledge chunks
4. Guide the AI to provide BC-specific, regulation-aware, broker-ready analysis
5. Be structured to produce answers that are actionable, not generic
6. Cover the key BC insurance domains: ICBC/auto, home/earthquake, strata/condo, tenant, liability
7. Direct the AI to flag BC-specific risks and misconceptions that affect outcomes

The template should be sophisticated enough that a user who pastes it into GPT-4, Claude, or Gemini gets a genuinely expert-level BC insurance analysis — not a generic insurance overview.

Return ONLY the template text, using [USER_SITUATION] and [KNOWLEDGE_CONTEXT] as the exact placeholder strings. No preamble, no explanation.`

  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const template = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''

    await supabaseAdmin.from('prompt_template').insert({ template })

    return NextResponse.json({ template, message: 'Template generated and stored successfully.' })
  } catch (e) {
    console.error('Setup template error:', e)
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 })
  }
}
