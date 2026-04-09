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

const VALUE_LABELS: Record<string, string> = {
  claim: 'property damage or theft claim',
  liability: 'liability — may have hurt someone or damaged their property',
  buying: 'buying insurance or understanding coverage',
  car: 'vehicle', home: 'house (home insurance)', strata: 'condo / strata unit',
  rental: 'rental unit (tenant insurance)', other: 'other property',
  collision: 'collision with vehicle or object', weather: 'weather damage',
  theft: 'theft or vandalism', hit_and_run: 'hit and run / unknown driver',
  at_fault: 'user was at fault', other_at_fault: 'other driver was at fault',
  shared_fault: 'shared fault', disputed: 'fault disputed or unclear',
  fire: 'fire or smoke', water: 'water damage', earthquake: 'earthquake',
  storm: 'wind, storm, or hail', pipe_burst: 'burst pipe or appliance leak (interior)',
  sewer_backup: 'sewer backup', overland_flood: 'overland flooding from outside',
  water_unsure: 'water damage — type unclear', my_unit_only: 'damage confined to unit',
  my_unit_caused_leak: "user's unit leaked into unit below",
  above_damaged_mine: "water from above / other unit damaged the user's unit",
  common_areas: 'common areas of the building',
  tenant_damage: 'user accidentally damaged the rental unit',
  pre_claim: 'no claim filed yet — determining coverage',
  denied: 'claim denied or underpaid', in_progress: 'claim in progress',
  coverage_check: 'just wants to understand coverage',
  car_accident: 'car accident — potential personal injury or property damage liability',
  injury_on_property: "someone injured on user's property",
  water_neighbour: "user's water damage affected a neighbour",
  other_liability: 'other liability situation',
  formal_notice: 'formal claim or legal notice already received',
  anticipated: 'no formal claim yet but anticipated',
  understanding: 'wants to understand exposure',
  auto: 'auto insurance (ICBC)', coverage_basics: 'what is and is not covered',
  coverage_gap: 'specific coverage gap or concern',
  cost_factors: 'what affects premiums and cost',
  broker_questions: 'what questions to ask a broker',
  unsure: 'not sure what type', icbc: 'ICBC',
  yes: 'known insurer (see name below)', multiple: 'multiple insurers involved',
  no: 'insurer not known',
}

const DATA_KEY_LABELS: Record<string, string> = {
  intent: 'Situation', property_type: 'Property', car_cause: 'Vehicle incident',
  car_fault: 'Fault', home_cause: 'Cause of home damage', home_water_type: 'Water damage type',
  strata_cause: 'Strata incident', strata_water_scope: 'Scope of water damage',
  rental_cause: 'Rental incident', claim_status: 'Claim status',
  liability_type: 'Liability type', liability_status: 'Formal claim status',
  buying_type: 'Insurance type', buying_question: 'Main question',
  insurer_known: 'Insurer', insurer_name: 'Insurer name',
}

function buildDescriptionFromData(data: Record<string, string>): string {
  return Object.entries(data)
    .map(([k, v]) => `${DATA_KEY_LABELS[k] ?? k}: ${VALUE_LABELS[v] ?? v}`)
    .join('\n')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { sessionId } = body

  let question: string
  if (body.data && typeof body.data === 'object') {
    question = buildDescriptionFromData(body.data as Record<string, string>)
  } else {
    // legacy plain question fallback
    question = body.question ?? ''
  }

  if (!question.trim()) return NextResponse.json({ error: 'Question is required' }, { status: 400 })

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
