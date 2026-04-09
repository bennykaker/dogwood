'use client'

import { useState, useRef } from 'react'
import Nav from './components/Nav'

// ── Types ─────────────────────────────────────────────────────────────────────

type JargonItem = { term: string; def: string }
type Option = { label: string; sublabel?: string; value: string; next: string | null }
type NodeDef = {
  question: string
  subtext?: string
  jargon?: JargonItem[]
  options: Option[]
  dataKey: string
  terminal?: boolean
}
type HistoryEntry = { nodeId: string; label: string; dataKey: string }
type CollectedData = Record<string, string>

// ── Question Tree ─────────────────────────────────────────────────────────────

const TREE: Record<string, NodeDef> = {
  root: {
    question: 'What brings you here today?',
    subtext: 'Pick the closest match. You can add detail as we go — or skip straight to generating a prompt at any time.',
    jargon: [
      { term: 'Insurance claim', def: 'A formal request to your insurer to pay for a loss. You file a claim when something bad happens and you want your insurer to cover the cost.' },
      { term: 'Liability', def: 'Legal responsibility for causing harm or damage to someone else. If you cause an accident that injures someone, you may be liable.' },
      { term: 'Policy', def: 'Your insurance contract. It defines what is covered, what is excluded, the deductibles, and your obligations.' },
    ],
    dataKey: 'intent',
    options: [
      {
        label: 'Something I own was damaged or stolen',
        sublabel: 'My car, home, condo, or belongings were damaged, destroyed, or taken',
        value: 'claim',
        next: 'property_type',
      },
      {
        label: 'I may have hurt someone or damaged their property',
        sublabel: 'A car accident, a leak that damaged a neighbour, someone was injured on my property',
        value: 'liability',
        next: 'liability_type',
      },
      {
        label: 'I want to understand my coverage or buy insurance',
        sublabel: "What's covered, what isn't, what I should ask my broker",
        value: 'buying',
        next: 'buying_type',
      },
    ],
  },

  property_type: {
    question: 'What type of property?',
    jargon: [
      { term: 'ICBC', def: "BC's public auto insurer. All basic car insurance in BC must be purchased through ICBC via a licensed broker. You cannot get basic autoplan anywhere else." },
      { term: 'Strata unit', def: 'An individually owned unit in a condo or townhouse complex. The strata corporation owns and insures the building. You need your own policy for contents, improvements, and liability.' },
      { term: 'Tenant insurance', def: "Insurance for renters. Covers your belongings and your personal liability — not the building. Your landlord's insurance doesn't protect you." },
    ],
    dataKey: 'property_type',
    options: [
      { label: 'My car or vehicle', value: 'car', next: 'car_cause' },
      { label: 'My house', value: 'home', next: 'home_cause' },
      { label: 'My condo or strata unit', value: 'strata', next: 'strata_cause' },
      { label: 'My belongings in a rented home or apartment', value: 'rental', next: 'rental_cause' },
      { label: 'Something else', value: 'other', next: 'claim_status' },
    ],
  },

  car_cause: {
    question: 'What happened to your vehicle?',
    jargon: [
      { term: 'ICBC Enhanced Care', def: "BC's no-fault auto system since May 2021. Everyone injured in a BC accident gets care and income replacement regardless of who was at fault. Suing for pain and suffering is largely eliminated." },
      { term: 'Collision coverage', def: 'Optional ICBC coverage that pays for damage to your own vehicle when you hit something or someone hits you — regardless of fault.' },
      { term: 'Comprehensive coverage', def: 'Optional ICBC coverage for non-collision damage: theft, fire, vandalism, weather, glass, and animals.' },
    ],
    dataKey: 'car_cause',
    options: [
      { label: 'Collision with another vehicle or object', value: 'collision', next: 'car_fault' },
      { label: 'Weather damage — hail, wind, flooding', value: 'weather', next: 'claim_status' },
      { label: 'Theft or vandalism', value: 'theft', next: 'claim_status' },
      { label: 'Hit and run or unknown driver', value: 'hit_and_run', next: 'claim_status' },
    ],
  },

  car_fault: {
    question: 'Who was at fault?',
    jargon: [
      { term: 'Fault determination', def: "ICBC uses rules to assign fault percentages (0%, 25%, 50%, 75%, 100%). Your fault level affects future premiums under ICBC's driver-based pricing, but not your right to Enhanced Care benefits." },
      { term: 'At-fault accident', def: "If you're found at fault, your optional collision coverage pays for your vehicle damage (minus deductible). A third-party liability claim pays for damage you caused to others." },
    ],
    dataKey: 'car_fault',
    options: [
      { label: 'I was at fault', value: 'at_fault', next: 'claim_status' },
      { label: 'The other driver was at fault', value: 'other_at_fault', next: 'claim_status' },
      { label: 'Both of us were partly at fault', value: 'shared_fault', next: 'claim_status' },
      { label: "Not sure — it's disputed", value: 'disputed', next: 'claim_status' },
    ],
  },

  home_cause: {
    question: 'What caused the damage to your home?',
    jargon: [
      { term: 'Broad vs. comprehensive policy', def: 'Broader policies cover all risks except named exclusions. Cheaper "named perils" policies only cover what is specifically listed. Always know which type you have.' },
      { term: 'Endorsement', def: 'An add-on that extends your base policy to cover something not included by default. Earthquake and sewer backup both require endorsements in BC.' },
    ],
    dataKey: 'home_cause',
    options: [
      { label: 'Fire or smoke', value: 'fire', next: 'claim_status' },
      { label: 'Water damage', value: 'water', next: 'home_water_type' },
      { label: 'Earthquake', value: 'earthquake', next: 'claim_status' },
      { label: 'Theft or break-in', value: 'theft', next: 'claim_status' },
      { label: 'Wind, storm, or hail', value: 'storm', next: 'claim_status' },
    ],
  },

  home_water_type: {
    question: 'What type of water damage?',
    jargon: [
      { term: 'Sewer backup', def: 'When the municipal sewer reverses into your home through drains or toilets. Not covered by default — requires a separate endorsement.' },
      { term: 'Overland water', def: 'Water entering from outside: rain runoff, river overflow, surface flooding. Not covered by default in BC — requires an endorsement if available at all in your area.' },
      { term: 'Gradual damage', def: 'A slow drip or seep over weeks or months. Almost always excluded — insurers expect you to notice and fix ongoing problems.' },
    ],
    dataKey: 'home_water_type',
    options: [
      { label: 'Burst pipe or appliance leak', sublabel: 'Sudden water damage from inside the home', value: 'pipe_burst', next: 'claim_status' },
      { label: 'Sewer backup', sublabel: 'Sewage or water backed up through drains or toilets', value: 'sewer_backup', next: 'claim_status' },
      { label: 'Overland flooding', sublabel: 'Water entered from outside — rain, river, surface runoff', value: 'overland_flood', next: 'claim_status' },
      { label: "Not sure", value: 'water_unsure', next: 'claim_status' },
    ],
  },

  strata_cause: {
    question: 'What happened?',
    jargon: [
      { term: 'Strata master policy', def: "The building's insurance, held by the strata corporation. Covers the structure and common areas, but has a deductible — often $25,000–$500,000+ for water or earthquake." },
      { term: 'Deductible assessment', def: 'If a claim on the master policy is traced to your unit (e.g. your burst pipe flooded the unit below), the strata can charge you the full master policy deductible.' },
      { term: 'Betterments', def: 'Upgrades above the original spec — custom flooring, new cabinets. The master policy covers original finishings only. Your unit policy should cover betterments.' },
    ],
    dataKey: 'strata_cause',
    options: [
      { label: 'Water damage', value: 'water', next: 'strata_water_scope' },
      { label: 'Fire', value: 'fire', next: 'claim_status' },
      { label: 'Earthquake', value: 'earthquake', next: 'claim_status' },
      { label: 'Theft from my unit or building', value: 'theft', next: 'claim_status' },
    ],
  },

  strata_water_scope: {
    question: 'Who does the water damage involve?',
    jargon: [
      { term: 'Deductible assessment', def: "If your unit caused the water damage, the strata can pass the full master policy deductible to you — this is often $25,000–$100,000 for water damage. Your unit policy's deductible assessment coverage pays this." },
      { term: 'Master policy', def: "The strata corporation's building insurance. It covers damage above the deductible. Below the deductible, unit owners are on their own." },
    ],
    dataKey: 'strata_water_scope',
    options: [
      { label: 'Damage is in my unit only', value: 'my_unit_only', next: 'claim_status' },
      { label: 'Water from my unit leaked into a unit below', value: 'my_unit_caused_leak', next: 'claim_status' },
      { label: 'Water from above or another unit damaged my unit', value: 'above_damaged_mine', next: 'claim_status' },
      { label: 'Common areas of the building', value: 'common_areas', next: 'claim_status' },
    ],
  },

  rental_cause: {
    question: 'What happened?',
    jargon: [
      { term: 'Tenant insurance', def: 'Covers your belongings, your personal liability, and extra living costs if you need to move out temporarily. It does not cover the building itself.' },
      { term: 'Liability (tenant)', def: "If you accidentally damage the rental unit or cause damage to other units (overflowing tub, for example), your tenant liability coverage pays — not your landlord's insurance." },
      { term: 'Additional living expenses', def: 'If a fire or flood makes your rental uninhabitable, this covers your hotel and extra costs while the unit is repaired.' },
    ],
    dataKey: 'rental_cause',
    options: [
      { label: 'Fire damaged my belongings', value: 'fire', next: 'claim_status' },
      { label: 'Water damage to my belongings', value: 'water', next: 'claim_status' },
      { label: 'My belongings were stolen', value: 'theft', next: 'claim_status' },
      { label: 'I accidentally damaged the rental unit', sublabel: 'Your landlord or their insurer may pursue you for this', value: 'tenant_damage', next: 'claim_status' },
    ],
  },

  claim_status: {
    question: 'Where are you in the process?',
    jargon: [
      { term: 'Claims adjuster', def: "The insurer's person who investigates your claim and decides what to pay. They work for the insurer — not for you." },
      { term: 'Denial', def: 'When your insurer refuses to pay a claim. Must be given in writing with reasons. You have rights to dispute this.' },
      { term: 'Limitation period', def: 'In BC you generally have 2 years to sue your insurer after a denial, but some policies shorten this to 1 year from the date of loss. Act quickly.' },
    ],
    dataKey: 'claim_status',
    options: [
      { label: "Haven't filed yet — figuring out if I'm covered", value: 'pre_claim', next: 'insurer' },
      { label: 'Claim was denied or I think I was underpaid', value: 'denied', next: 'insurer' },
      { label: 'Claim is in progress right now', value: 'in_progress', next: 'insurer' },
      { label: 'Just want to understand my coverage', value: 'coverage_check', next: 'insurer' },
    ],
  },

  liability_type: {
    question: 'What is the liability situation?',
    jargon: [
      { term: 'Third-party liability', def: "Coverage that pays for damage or injury you cause to others. BC basic autoplan includes a minimum $200,000 — widely considered too low. Most advisors recommend $1–2M+ extended liability." },
      { term: 'Personal liability', def: 'Coverage in home, strata, and tenant policies that pays if you are found responsible for injuring someone or damaging their property.' },
      { term: 'Subrogation', def: "After your insurer pays your claim, they may pursue whoever caused the damage. If someone else caused your loss, your insurer can sue them on your behalf." },
    ],
    dataKey: 'liability_type',
    options: [
      { label: 'Car accident — I may have injured someone or damaged their property', value: 'car_accident', next: 'liability_status' },
      { label: 'Someone was injured on my property', sublabel: 'Slip and fall, injury in home or condo', value: 'injury_on_property', next: 'liability_status' },
      { label: 'Water from my unit or property damaged a neighbour', value: 'water_neighbour', next: 'liability_status' },
      { label: 'Someone is claiming I owe them money for something I did', value: 'other_liability', next: 'liability_status' },
    ],
  },

  liability_status: {
    question: 'Has a formal claim been made?',
    jargon: [
      { term: 'Demand letter', def: 'A formal letter from someone (or their lawyer) demanding compensation. This triggers your duty to notify your insurer immediately — delay can jeopardize your coverage.' },
      { term: 'Duty to defend', def: "Your insurer is required to defend you against covered liability claims, even if the claim is frivolous. They hire and pay for the lawyer." },
      { term: 'Notify your insurer', def: 'Most policies require you to report potential liability claims immediately — even before a formal claim is filed. Late notice can void your coverage.' },
    ],
    dataKey: 'liability_status',
    options: [
      { label: "Yes — I've received a formal notice, letter, or claim", value: 'formal_notice', next: 'insurer' },
      { label: "Not yet, but I'm worried they will make a claim", value: 'anticipated', next: 'insurer' },
      { label: 'Just want to understand my exposure before anything happens', value: 'understanding', next: 'insurer' },
    ],
  },

  buying_type: {
    question: 'What type of insurance?',
    jargon: [
      { term: 'Broker', def: "An independent licensed advisor who shops multiple insurers on your behalf. They have a legal duty of care to you — to ask questions and advise on material coverage gaps. ICBC basic autoplan must go through a broker." },
      { term: 'Premium', def: 'What you pay for your insurance — monthly or annually.' },
      { term: 'Deductible', def: 'Your out-of-pocket cost before insurance pays. Higher deductibles mean lower premiums but more exposure on a claim.' },
    ],
    dataKey: 'buying_type',
    options: [
      { label: 'Auto insurance / ICBC', value: 'auto', next: 'buying_question' },
      { label: 'Home insurance', value: 'home', next: 'buying_question' },
      { label: 'Strata or condo insurance', value: 'strata', next: 'buying_question' },
      { label: 'Tenant / renter insurance', value: 'tenant', next: 'buying_question' },
      { label: "Not sure what type I need", value: 'unsure', next: 'buying_question' },
    ],
  },

  buying_question: {
    question: "What's your main question?",
    jargon: [
      { term: 'Exclusion', def: 'Something your policy does not cover. Always read the exclusions section carefully — common exclusions include gradual damage, earthquake (unless added), and sewer backup (unless added).' },
      { term: 'Endorsement', def: "An add-on to your base policy (e.g. earthquake coverage, sewer backup, short-term rental). You won't have it unless you specifically added it." },
      { term: 'Replacement cost vs. ACV', def: "Replacement cost pays to replace at today's prices. Actual cash value (ACV) deducts depreciation — an old roof that costs $20,000 to replace might only get you $8,000 under ACV." },
    ],
    dataKey: 'buying_question',
    options: [
      { label: "What does it cover — and what doesn't it?", value: 'coverage_basics', next: 'insurer' },
      { label: 'I have a specific gap or concern I want to address', sublabel: "Something I heard isn't covered, or a recent event worried me", value: 'coverage_gap', next: 'insurer' },
      { label: 'I want to understand what affects cost', sublabel: 'Premiums, deductibles, how to compare', value: 'cost_factors', next: 'insurer' },
      { label: "I'm not sure what questions to ask my broker", value: 'broker_questions', next: 'insurer' },
    ],
  },

  insurer: {
    question: 'Do you know which insurance company is involved?',
    subtext: "This helps us tailor the prompt. It's fine if you're not sure.",
    jargon: [
      { term: 'ICBC', def: "BC's public auto insurer. Everyone with basic autoplan in BC is with ICBC — it's mandatory and can only be bought through a licensed broker." },
      { term: 'Broker', def: 'Your broker represents you, not the insurer. They can tell you which company holds your home, strata, or tenant policy.' },
      { term: 'Direct insurer', def: "Some home and strata insurers sell directly without a broker. Check your policy documents or your bank statement to see who you're paying." },
    ],
    dataKey: 'insurer_known',
    terminal: true,
    options: [
      { label: 'ICBC', value: 'icbc', next: null },
      { label: 'Yes — I know the company name', value: 'yes', next: null },
      { label: 'Multiple companies are involved', value: 'multiple', next: null },
      { label: "No / not sure", value: 'no', next: null },
    ],
  },
}

// ── Description builder ───────────────────────────────────────────────────────

const VALUE_LABELS: Record<string, string> = {
  claim: 'property damage or theft claim',
  liability: 'liability — may have hurt someone or damaged their property',
  buying: 'buying insurance or understanding coverage',
  car: 'vehicle',
  home: 'house (home insurance)',
  strata: 'condo / strata unit',
  rental: 'rental unit (tenant insurance)',
  other: 'other property',
  collision: 'collision with vehicle or object',
  weather: 'weather damage (hail, wind, flooding)',
  theft: 'theft or vandalism',
  hit_and_run: 'hit and run / unknown driver',
  at_fault: 'user was at fault',
  other_at_fault: 'other driver was at fault',
  shared_fault: 'shared / both parties at fault',
  disputed: 'fault disputed or unclear',
  fire: 'fire or smoke',
  water: 'water damage',
  earthquake: 'earthquake',
  storm: 'wind, storm, or hail',
  pipe_burst: 'burst pipe or appliance leak (interior)',
  sewer_backup: 'sewer backup',
  overland_flood: 'overland flooding from outside',
  water_unsure: 'water damage — type unclear',
  my_unit_only: 'damage confined to unit',
  my_unit_caused_leak: "user's unit leaked into unit below",
  above_damaged_mine: "water from above / other unit damaged the user's unit",
  common_areas: 'common areas of the building',
  tenant_damage: 'user accidentally damaged the rental unit',
  pre_claim: 'no claim filed yet — determining coverage',
  denied: 'claim denied or underpaid',
  in_progress: 'claim in progress',
  coverage_check: 'just wants to understand coverage',
  car_accident: 'car accident — potential personal injury or property damage liability',
  injury_on_property: "someone injured on user's property",
  water_neighbour: "user's water damage affected a neighbour",
  other_liability: 'other liability situation',
  formal_notice: 'formal claim or legal notice already received',
  anticipated: 'no formal claim yet but anticipated',
  understanding: 'wants to understand exposure',
  auto: 'auto insurance (ICBC)',
  coverage_basics: 'what is and is not covered',
  coverage_gap: 'specific coverage gap or concern',
  cost_factors: 'what affects premiums and cost',
  broker_questions: 'what questions to ask a broker',
  unsure: 'not sure what type',
  icbc: 'ICBC',
  yes: 'known insurer (see name below)',
  multiple: 'multiple insurers involved',
  no: 'insurer not known',
}

const DATA_KEY_LABELS: Record<string, string> = {
  intent: 'Situation',
  property_type: 'Property',
  car_cause: 'Vehicle incident',
  car_fault: 'Fault',
  home_cause: 'Cause',
  home_water_type: 'Water damage type',
  strata_cause: 'Strata incident',
  strata_water_scope: 'Scope of water damage',
  rental_cause: 'Rental incident',
  claim_status: 'Claim status',
  liability_type: 'Liability type',
  liability_status: 'Formal claim status',
  buying_type: 'Insurance type',
  buying_question: 'Main question',
  insurer_known: 'Insurer',
  insurer_name: 'Insurer name',
}

function buildDescription(data: CollectedData): string {
  return Object.entries(data)
    .map(([k, v]) => `${DATA_KEY_LABELS[k] ?? k}: ${VALUE_LABELS[v] ?? v}`)
    .join('\n')
}

// ── Inline styles ─────────────────────────────────────────────────────────────

const S = {
  page: { minHeight: '100vh', paddingBottom: '120px' } as React.CSSProperties,
  layout: (hasJargon: boolean): React.CSSProperties => ({
    maxWidth: '960px',
    margin: '0 auto',
    padding: '40px 24px',
    display: 'grid',
    gridTemplateColumns: hasJargon ? '260px 1fr' : '1fr',
    gap: '48px',
    alignItems: 'start',
  }),
  jargonPanel: {
    position: 'sticky',
    top: '24px',
    background: '#0f2419',
    border: '1px solid #1e4a30',
    borderRadius: '12px',
    padding: '20px',
  } as React.CSSProperties,
  jargonHeading: {
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#2a5a3a',
    marginBottom: '14px',
  },
  jargonTerm: { fontSize: '13px', fontWeight: 700, color: '#8ab89a', marginBottom: '4px' },
  jargonDef: { fontSize: '12px', color: '#4a7a5a', lineHeight: 1.6, marginBottom: '14px' },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap' as const,
    marginBottom: '28px',
  },
  pill: {
    fontSize: '12px',
    padding: '3px 10px',
    borderRadius: '20px',
    background: 'rgba(139,184,154,0.1)',
    border: '1px solid #1e4a30',
    color: '#8ab89a',
  } as React.CSSProperties,
  pillSep: { color: '#2a5a3a', fontSize: '12px' },
  question: {
    fontFamily: '"DM Serif Display", serif',
    fontSize: '28px',
    lineHeight: 1.2,
    marginBottom: '8px',
    color: '#f5f0e8',
  } as React.CSSProperties,
  subtext: { fontSize: '15px', color: '#4a7a5a', lineHeight: 1.6, marginBottom: '28px' },
  optionList: { display: 'flex', flexDirection: 'column' as const, gap: '10px' },
  option: (selected: boolean): React.CSSProperties => ({
    background: selected ? 'rgba(193,68,26,0.12)' : '#142e20',
    border: `1px solid ${selected ? '#c1441a' : '#1e4a30'}`,
    borderRadius: '10px',
    padding: '14px 18px',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    textAlign: 'left' as const,
    display: 'block',
    width: '100%',
  }),
  optionLabel: (selected: boolean): React.CSSProperties => ({
    fontSize: '15px',
    fontWeight: 600,
    color: selected ? '#f5f0e8' : '#c8dfc8',
  }),
  optionSublabel: {
    fontSize: '13px',
    color: '#4a7a5a',
    marginTop: '3px',
    lineHeight: 1.5,
  } as React.CSSProperties,
  textInput: {
    display: 'block',
    width: '100%',
    marginTop: '12px',
    background: '#0f2419',
    border: '1px solid #1e4a30',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#f5f0e8',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#4a7a5a',
    fontSize: '13px',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  } as React.CSSProperties,
  generatePrimary: {
    display: 'block',
    width: '100%',
    marginTop: '24px',
    background: '#c1441a',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 24px',
    color: '#f5f0e8',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'center' as const,
  },
  floatingWrap: {
    position: 'fixed' as const,
    bottom: '72px',
    right: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '6px',
    zIndex: 50,
  },
  floatingBtn: (disabled: boolean): React.CSSProperties => ({
    background: disabled ? '#2a5a3a' : '#c1441a',
    border: 'none',
    borderRadius: '10px',
    padding: '11px 20px',
    color: disabled ? '#4a7a5a' : '#f5f0e8',
    fontSize: '14px',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    whiteSpace: 'nowrap' as const,
  }),
  floatingNote: { fontSize: '11px', color: '#4a7a5a', paddingRight: '4px' },
  error: { color: '#f87171', fontSize: '14px', marginTop: '12px' },
  // Result styles
  resultLayout: {
    maxWidth: '740px',
    margin: '0 auto',
    padding: '40px 24px',
  } as React.CSSProperties,
  promptBox: {
    background: '#0f2419',
    border: '1px solid #1e4a30',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    position: 'relative' as const,
  },
  promptText: {
    fontSize: '14px',
    color: '#c8dfc8',
    lineHeight: 1.8,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const,
    margin: 0,
    fontFamily: 'inherit',
  },
  copyBtn: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    background: 'rgba(193,68,26,0.15)',
    border: '1px solid rgba(193,68,26,0.3)',
    borderRadius: '7px',
    padding: '5px 12px',
    color: '#c1441a',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  sectionHeading: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#4a7a5a',
    marginBottom: '12px',
  },
  aiLinks: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '10px',
    marginBottom: '32px',
  },
  aiLink: {
    background: '#142e20',
    border: '1px solid #1e4a30',
    borderRadius: '8px',
    padding: '8px 16px',
    color: '#8ab89a',
    fontSize: '14px',
    fontWeight: 600,
    textDecoration: 'none',
    display: 'inline-block',
  } as React.CSSProperties,
  refineCard: {
    background: '#142e20',
    border: '1px solid #1e4a30',
    borderRadius: '12px',
    padding: '20px',
  },
  refineTextarea: {
    display: 'block',
    width: '100%',
    background: '#0f2419',
    border: '1px solid #1e4a30',
    borderRadius: '8px',
    padding: '12px 14px',
    color: '#f5f0e8',
    fontSize: '14px',
    lineHeight: 1.6,
    resize: 'vertical' as const,
    minHeight: '140px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: '10px',
    marginBottom: '10px',
  },
  refineBtn: (disabled: boolean): React.CSSProperties => ({
    background: disabled ? '#2a5a3a' : '#c1441a',
    border: 'none',
    borderRadius: '8px',
    padding: '9px 18px',
    color: disabled ? '#4a7a5a' : '#f5f0e8',
    fontSize: '14px',
    fontWeight: 700,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),
  startOver: {
    background: 'none',
    border: '1px solid #1e4a30',
    borderRadius: '8px',
    padding: '9px 18px',
    color: '#4a7a5a',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginLeft: '10px',
  } as React.CSSProperties,
}

// ── Page component ─────────────────────────────────────────────────────────────

export default function Page() {
  const [view, setView] = useState<'tree' | 'result'>('tree')
  const [nodeId, setNodeId] = useState('root')
  const [collected, setCollected] = useState<CollectedData>({})
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [insurerName, setInsurerName] = useState('')
  const [generating, setGenerating] = useState(false)
  const [prompt, setPrompt] = useState<string | null>(null)
  const [genError, setGenError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [refineInput, setRefineInput] = useState('')
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null)
  const [refineLoading, setRefineLoading] = useState(false)
  const [refinedCopied, setRefinedCopied] = useState(false)
  const sessionId = useRef(Math.random().toString(36).slice(2))

  const node = TREE[nodeId]
  const isTerminal = !!node.terminal
  const hasAnswers = history.length > 0

  function select(option: Option) {
    const newCollected = { ...collected, [node.dataKey]: option.value }
    const newHistory = [...history, { nodeId, label: option.label, dataKey: node.dataKey }]
    setCollected(newCollected)
    setHistory(newHistory)
    if (!isTerminal && option.next) {
      setNodeId(option.next)
    }
  }

  function goBack() {
    if (!hasAnswers) return
    const last = history[history.length - 1]
    const newCollected = { ...collected }
    delete newCollected[last.dataKey]
    if (last.dataKey === 'insurer_known') setInsurerName('')
    setCollected(newCollected)
    setHistory(history.slice(0, -1))
    setNodeId(last.nodeId)
  }

  async function generate() {
    const finalData = insurerName.trim()
      ? { ...collected, insurer_name: insurerName.trim() }
      : collected
    setGenerating(true)
    setGenError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: finalData, sessionId: sessionId.current }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to generate')
      setPrompt(json.prompt)
      setView('result')
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  async function refine() {
    if (!refineInput.trim() || !prompt) return
    setRefineLoading(true)
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalQuestion: buildDescription(collected),
          aiResponse: refineInput,
          sessionId: sessionId.current,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      setRefinedPrompt(json.prompt)
    } finally {
      setRefineLoading(false)
    }
  }

  function copyToClipboard(text: string, setDone: (v: boolean) => void) {
    navigator.clipboard.writeText(text).then(() => {
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    })
  }

  function startOver() {
    setView('tree')
    setNodeId('root')
    setCollected({})
    setHistory([])
    setInsurerName('')
    setPrompt(null)
    setGenError(null)
    setRefineInput('')
    setRefinedPrompt(null)
  }

  // ── Result view ──────────────────────────────────────────────────────────────

  if (view === 'result' && prompt) {
    const displayPrompt = refinedPrompt ?? prompt
    return (
      <div style={S.page}>
        <Nav />
        <div style={S.resultLayout}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ ...S.question, fontSize: '22px', marginBottom: '6px' }}>Your prompt is ready</h1>
            <p style={S.subtext}>Copy it and paste it into any AI assistant to get a genuinely expert BC insurance answer.</p>
          </div>

          <div style={S.promptBox}>
            <button
              style={S.copyBtn}
              onClick={() => copyToClipboard(displayPrompt, setCopied)}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
            <pre style={S.promptText}>{displayPrompt}</pre>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div style={S.sectionHeading}>Paste into any of these</div>
            <div style={S.aiLinks}>
              {[
                { name: 'ChatGPT', url: 'https://chat.openai.com' },
                { name: 'Claude', url: 'https://claude.ai' },
                { name: 'Gemini', url: 'https://gemini.google.com' },
                { name: 'Copilot', url: 'https://copilot.microsoft.com' },
                { name: 'Perplexity', url: 'https://perplexity.ai' },
              ].map(({ name, url }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={S.aiLink}>
                  {name} ↗
                </a>
              ))}
            </div>
          </div>

          <div style={S.refineCard}>
            <div style={S.sectionHeading}>Not what you needed?</div>
            <p style={{ fontSize: '14px', color: '#4a7a5a', lineHeight: 1.6, marginBottom: '6px' }}>
              Paste the AI&apos;s response below if it was too generic or missed something — we&apos;ll generate a sharper follow-up prompt.
            </p>
            <textarea
              style={S.refineTextarea}
              value={refineInput}
              onChange={e => setRefineInput(e.target.value)}
              placeholder="Paste the AI's response here…"
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
              <button
                style={S.refineBtn(refineLoading || !refineInput.trim())}
                disabled={refineLoading || !refineInput.trim()}
                onClick={refine}
              >
                {refineLoading ? 'Generating…' : 'Generate follow-up prompt'}
              </button>
              <button style={S.startOver} onClick={startOver}>Start over</button>
            </div>
            {refinedPrompt && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #1e4a30', paddingTop: '20px' }}>
                <div style={{ ...S.sectionHeading, marginBottom: '10px' }}>Follow-up prompt</div>
                <div style={{ position: 'relative' }}>
                  <button
                    style={S.copyBtn}
                    onClick={() => copyToClipboard(refinedPrompt, setRefinedCopied)}
                  >
                    {refinedCopied ? '✓ Copied' : 'Copy'}
                  </button>
                  <pre style={{ ...S.promptText, background: '#0f2419', borderRadius: '8px', padding: '14px', paddingRight: '80px' }}>{refinedPrompt}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Tree view ────────────────────────────────────────────────────────────────

  const hasJargon = !!(node.jargon?.length)

  return (
    <div style={S.page}>
      <Nav />
      <div style={S.layout(hasJargon)}>

        {/* Jargon panel */}
        {hasJargon && (
          <div style={S.jargonPanel}>
            <div style={S.jargonHeading}>Jargon guide</div>
            {node.jargon!.map(j => (
              <div key={j.term}>
                <div style={S.jargonTerm}>{j.term}</div>
                <div style={S.jargonDef}>{j.def}</div>
              </div>
            ))}
          </div>
        )}

        {/* Question panel */}
        <div>
          {/* Breadcrumb */}
          {hasAnswers && (
            <div style={S.breadcrumb}>
              <button style={S.backBtn} onClick={goBack}>← Back</button>
              <span style={S.pillSep}>·</span>
              {history.map((h, i) => (
                <span key={i} style={S.pill}>{h.label}</span>
              ))}
            </div>
          )}

          <h1 style={S.question}>{node.question}</h1>
          {node.subtext && <p style={S.subtext}>{node.subtext}</p>}

          {/* Options */}
          <div style={S.optionList}>
            {node.options.map(opt => {
              const selected = collected[node.dataKey] === opt.value
              return (
                <button
                  key={opt.value}
                  style={S.option(selected)}
                  onClick={() => select(opt)}
                >
                  <div style={S.optionLabel(selected)}>{opt.label}</div>
                  {opt.sublabel && <div style={S.optionSublabel}>{opt.sublabel}</div>}
                </button>
              )
            })}
          </div>

          {/* Insurer name input */}
          {isTerminal && collected.insurer_known === 'yes' && (
            <input
              style={S.textInput}
              value={insurerName}
              onChange={e => setInsurerName(e.target.value)}
              placeholder="e.g. Intact, Wawanesa, Aviva, Square One, BCAA…"
              autoFocus
            />
          )}

          {/* Primary generate button on terminal node */}
          {isTerminal && (
            <button
              style={S.generatePrimary}
              onClick={generate}
              disabled={generating}
            >
              {generating ? 'Generating your prompt…' : 'Generate my prompt →'}
            </button>
          )}

          {genError && <p style={S.error}>{genError}</p>}
        </div>
      </div>

      {/* Floating generate button — available after first answer, on non-terminal nodes */}
      {hasAnswers && !isTerminal && (
        <div style={S.floatingWrap}>
          <span style={S.floatingNote}>based on your answers so far</span>
          <button
            style={S.floatingBtn(generating)}
            onClick={generate}
            disabled={generating}
          >
            {generating ? 'Generating…' : 'Generate now →'}
          </button>
        </div>
      )}
    </div>
  )
}
