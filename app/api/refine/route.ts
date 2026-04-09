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
  const { originalQuestion, aiResponse, sessionId } = await req.json()
  if (!originalQuestion?.trim() || !aiResponse?.trim()) {
    return NextResponse.json({ error: 'Original question and AI response are required' }, { status: 400 })
  }

  const client = new Anthropic({ apiKey: getAnthropicKey() })

  const systemPrompt = `You are a BC insurance prompt engineer for Dogwood. A user asked a BC insurance question, got an AI answer, and found it unsatisfactory. Your job is to analyse what was lacking and generate a better follow-up prompt.

Analyse the original question and the response received. Identify:
- What was answered too generically (not BC-specific enough)
- What was missing entirely
- What needs more precision or depth
- What BC-specific regulations or considerations were ignored

Then generate a refined follow-up prompt that:
1. Acknowledges the prior answer briefly ("You explained X, but I need more on Y")
2. Targets the specific gaps precisely
3. Demands BC-specific detail on what was missing
4. Asks sharper, more specific questions

Return ONLY the refined follow-up prompt — no preamble, no explanation.`

  const userMessage = `ORIGINAL QUESTION:
${originalQuestion}

AI RESPONSE RECEIVED (unsatisfactory):
${aiResponse}`

  try {
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const prompt = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''

    await supabaseAdmin.from('prompt_log').insert({
      user_question: originalQuestion,
      generated_prompt: prompt,
      prompt_type: 'refinement',
      session_id: sessionId ?? null,
    })

    return NextResponse.json({ prompt })
  } catch (e) {
    console.error('Refine error:', e)
    return NextResponse.json({ error: 'Failed to generate refined prompt' }, { status: 500 })
  }
}
