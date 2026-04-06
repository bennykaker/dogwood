import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import { SYSTEM_PROMPT } from '../../../lib/systemPrompt'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ESCALATIONS_FILE = process.env.VERCEL
  ? '/tmp/escalations.json'
  : path.join(process.cwd(), 'escalations.json')

function readEscalations(): object[] {
  try {
    const raw = fs.readFileSync(ESCALATIONS_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeEscalation(question: string, reply: string) {
  const existing = readEscalations()
  existing.push({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    question,
    reply,
  })
  fs.writeFileSync(ESCALATIONS_FILE, JSON.stringify(existing, null, 2))
}

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
      writeEscalation(userQuestion, reply)
    } catch {
      // Non-fatal — escalation logging best-effort
    }
  }

  return Response.json({ reply, escalated })
}
