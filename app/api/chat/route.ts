import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '../../../lib/supabaseAdmin'
import { SYSTEM_PROMPT } from '../../../lib/systemPrompt'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: 'Missing messages' }, { status: 400 })
  }

  const userQuestion = messages[messages.length - 1]?.content ?? ''

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
  })

  const reply = response.content[0].type === 'text' ? response.content[0].text : ''
  const escalated = reply.includes('This one needs a human')

  if (escalated) {
    try {
      await supabaseAdmin.from('escalations').insert({
        question: userQuestion,
        dogwood_reply: reply,
        status: 'pending',
      })
    } catch {
      // Non-fatal — escalation logging best-effort
    }
  }

  return Response.json({ reply, escalated })
}
