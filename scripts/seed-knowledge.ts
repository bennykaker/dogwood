import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

function getEnv(key: string): string {
  if (process.env[key]) return process.env[key]!
  try {
    const file = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8')
    return file.match(new RegExp(`^${key}=(.+)$`, 'm'))?.[1]?.trim() ?? ''
  } catch { return '' }
}

const supabase = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'))

const knowledge = [
  {
    topic: 'ICBC Enhanced Care — No-Fault Auto Insurance',
    keywords: ['icbc', 'enhanced care', 'auto', 'car', 'vehicle', 'accident', 'injury', 'no-fault'],
    content: `BC switched to ICBC Enhanced Care (no-fault auto insurance) on May 1, 2021. Under Enhanced Care, injured people receive care and recovery benefits regardless of fault — you cannot sue another driver for pain and suffering in most circumstances.

Key Enhanced Care benefits: Medical and rehabilitation costs (unlimited for most injuries). Income replacement up to $111,200/year (indexed). Permanent impairment benefits. Death and grief support. Vehicle damage repairs.

What Enhanced Care does NOT cover: Pain and suffering awards (eliminated for most claims). Tort lawsuits against at-fault drivers (eliminated for BC accidents). Optional enhanced coverage for higher earners exists (Enhanced Accident Benefits).

ICBC still handles: All basic autoplan through brokers. Optional collision, comprehensive, third-party liability top-ups. Vehicle damage claims regardless of fault.

BC brokers sell both basic ICBC autoplan and optional ICBC coverage — you go to the same broker for both. You cannot buy basic autoplan anywhere else in BC.`,
  },
  {
    topic: 'ICBC Optional Coverage — Beyond Basic Autoplan',
    keywords: ['icbc', 'optional', 'collision', 'comprehensive', 'third-party', 'liability', 'underinsured'],
    content: `Basic ICBC Autoplan covers: Minimum $200,000 third-party liability. Accident benefits (Enhanced Care). Hit-and-run and uninsured motorist protection. Inverse liability in some provinces.

Optional ICBC coverage you should consider: Extended third-party liability (up to $5M). Collision — covers your vehicle if you hit something or roll. Comprehensive — covers theft, fire, weather, glass, vandalism. Rental car coverage while your vehicle is repaired. Loss of use coverage.

BC-specific note: Basic autoplan minimum liability is $200,000 — dangerously low. Most BC insurance advisors recommend at least $1–2M in extended liability. ICBC sold $1M extension is inexpensive and standard practice.

Deductibles on optional coverages typically range $300–$1,000. You choose your deductible amount when purchasing.`,
  },
  {
    topic: 'BC Strata Insurance — Master Policy',
    keywords: ['strata', 'condo', 'master policy', 'building', 'corporation', 'common property', 'strata council'],
    content: `In BC, strata corporations (the condo building's legal entity) are required by the Strata Property Act to carry property insurance on the building and common areas. This is the "master policy."

What the strata master policy covers: The building structure, common areas (hallways, parkade, amenities). Original fixtures and finishings in individual units as built. Third-party liability for the strata corporation. Strata master policies must include "replacement cost" coverage.

What it does NOT cover: Your personal belongings inside your unit. Improvements and betterments you've made to your unit (upgraded flooring, custom cabinetry). Your personal liability. The strata earthquake deductible assessment (your share of the deductible if a claim is made).

BC law (Strata Property Act Section 149) requires strata corporations to insure on a full replacement cost basis. However, strata corporations set their own deductibles, which can be very large.

Important: The strata master policy insures "standard" finishings. If the strata has a $500,000 earthquake deductible and there's an earthquake, you as a unit owner could be assessed your proportional share — often $20,000–$80,000+ per unit.`,
  },
  {
    topic: 'BC Strata Insurance — Personal Unit Coverage',
    keywords: ['strata', 'condo', 'unit', 'personal', 'betterments', 'deductible assessment', 'contents', 'tenant'],
    content: `Strata unit owners need personal insurance that covers what the master policy does not.

Strata unit owner insurance typically covers: Contents and personal belongings. Improvements and betterments (renovations you've done above original spec). Personal liability (someone injured in your unit). Additional living expenses if your unit is uninhabitable. Strata deductible assessment — if a claim against the strata master policy is traced to your unit (e.g. your overflowing toilet damaged the unit below), you may be assessed the full master policy deductible. This can be $50,000–$500,000+ for earthquakes.

BC-specific concern — deductible assessments: This is the biggest gap most condo owners have. If a pipe bursts in your unit and damages other units, the strata can charge you the full master policy deductible (often $25,000–$100,000 for water damage). Strata unit insurance should include deductible assessment coverage matching your strata's actual deductible.

Ask your broker: What is our strata master policy deductible for water damage? Earthquake? What is the deductible assessment coverage limit on my unit policy? Is it enough?`,
  },
  {
    topic: 'BC Strata Earthquake Deductibles',
    keywords: ['earthquake', 'strata', 'deductible', 'assessment', 'seismic', 'metro vancouver', 'lower mainland'],
    content: `Earthquake deductibles in BC strata buildings are large — often 10–20% of the building's insured value. For a 100-unit building insured at $20 million, a 10% earthquake deductible is $2 million — potentially $20,000+ per unit.

Why earthquake deductibles are so high: BC (especially Metro Vancouver) sits in an active seismic zone. After major quake events elsewhere, BC insurers dramatically increased earthquake deductibles. Many strata buildings now have earthquake deductibles of $500,000–$5M+.

What happens when earthquake strikes: Damage exceeding the deductible is paid by the master policy insurer. The deductible amount is shared among unit owners by unit entitlement (usually proportional to unit size). Each unit owner is assessed their share.

If you cannot pay the assessment: Strata can place a lien on your unit. Strata can pursue collection.

What to do: Check your strata's depreciation report and insurance summary. Ask your strata council for the current earthquake deductible amount. Buy personal strata insurance that includes a deductible assessment rider that matches or exceeds your strata's earthquake deductible. In Metro Vancouver, deductible assessment coverage of $100,000–$500,000 per unit is increasingly common.`,
  },
  {
    topic: 'BC Home Insurance — Earthquake Coverage',
    keywords: ['earthquake', 'home', 'house', 'seismic', 'bc', 'coverage', 'separate', 'add-on'],
    content: `Earthquake coverage is NOT included in standard BC home insurance policies. You must add it separately as an endorsement.

BC earthquake risk is real: Metro Vancouver, Victoria, and much of coastal BC are in seismic hazard zones. The Cascadia Subduction Zone earthquake (magnitude 8–9) is considered overdue.

BC earthquake coverage basics: Typically offered as a percentage deductible (5–10% of insured dwelling value). Covers the dwelling structure for earthquake-caused damage. Does not cover damage from earth movement unrelated to earthquakes (settling, landslide — those may need separate coverage). Sewer backup and overland water caused by an earthquake are usually covered if you have those endorsements.

Average annual premium for earthquake coverage: Varies significantly by construction type, age, location. Unreinforced masonry (brick, block) homes pay much higher premiums or may be uninsurable. Wood frame construction is most insurable.

What is typically excluded: Gradual earth movement, settling, soil conditions. Pre-existing cracks from settling. Land itself (only structures).

Important BC-specific note: Many Metro Vancouver homeowners skip earthquake coverage and are significantly underinsured. Ask your broker specifically what the earthquake add-on costs for your property.`,
  },
  {
    topic: 'BC Home Insurance — Overland Water and Flood',
    keywords: ['flood', 'overland', 'water', 'sewer', 'backup', 'storm', 'river', 'drainage', 'basement'],
    content: `Flood and overland water coverage in BC involves several distinct coverages that are NOT automatically included in standard home insurance.

Three types of water damage coverage: 1. Sewer backup — covers damage when municipal sewer backs up into your home. Usually available as an add-on. Most BC homeowners should have this. 2. Overland water — covers damage from water entering from outside (rain, river overflow, surface runoff). Was historically excluded; now available as an add-on from most major insurers. 3. Freshwater flood — some high-risk flood zone properties cannot get overland water coverage.

BC-specific concerns: Fraser Valley, Richmond, Abbotsford, Merritt, Princeton — areas with known flood risk. Some properties in designated flood plains cannot get overland water coverage or pay very high premiums. Stormwater management in Metro Vancouver is aging — sewer backup is increasingly common.

What standard home policies typically DO cover: Sudden and accidental water damage from pipes. Water damage from a leaking roof (up to a point). Appliance malfunction.

What standard policies typically DON'T cover: Gradual water damage (dripping pipe over months). Sewer backup without the endorsement. Overland water without the endorsement.

Key question to ask: Am I in a designated flood plain? Does my policy include sewer backup AND overland water coverage?`,
  },
  {
    topic: 'BC Tenant Insurance',
    keywords: ['tenant', 'renter', 'rental', 'apartment', 'suite', 'landlord', 'belongings', 'liability'],
    content: `Tenant insurance in BC is not legally required but is strongly advisable. Many landlords require it in their tenancy agreements.

What BC tenant insurance covers: Contents — your personal belongings against fire, theft, water damage, etc. Personal liability — if you accidentally cause injury or property damage (e.g. your overflowing bathtub damages the unit below). Additional living expenses — if your rental is uninhabitable after an insured event (fire, flood), covers hotel and increased living costs while you find alternative housing.

What it does NOT cover: The building itself (landlord's responsibility). Your landlord's belongings or appliances. Damage you cause intentionally. Business inventory or equipment above basic limits.

BC Residential Tenancy Act context: Landlords are responsible for insuring the building. Tenants are responsible for their own belongings. If a fire caused by tenant negligence damages the building, the landlord's insurer may pursue subrogation against the tenant — tenant liability coverage protects against this.

Typical BC tenant insurance cost: $15–$30/month for most renters. Very high value for the premium.

Short-term rental note: If you Airbnb your rental unit (even occasionally), you must tell your insurer. Standard tenant insurance typically excludes short-term rental activity — you may need a specific endorsement or commercial policy.`,
  },
  {
    topic: 'Insurance Council of BC — Regulatory Framework',
    keywords: ['insurance council', 'broker', 'agent', 'complaint', 'licensing', 'regulator', 'misconduct', 'ICBC'],
    content: `The Insurance Council of BC (ICBC is a separate Crown corporation — do not confuse them) regulates insurance brokers, agents, adjusters, and other insurance intermediaries in BC.

What the Insurance Council does: Licenses all insurance brokers and agents in BC. Sets standards of conduct and continuing education requirements. Investigates complaints about licensed insurance professionals. Can discipline, suspend, or cancel licenses. Publishes disciplinary decisions publicly.

What the Insurance Council does NOT do: Regulate insurance companies directly (that's OSFI federally and the BC Financial Services Authority for provincially regulated insurers). Handle claims disputes between policyholders and insurers. Set insurance rates.

If you have a complaint about your broker: Contact the Insurance Council of BC at www.insurancecouncilofbc.com. Complaints must typically be in writing. The Council investigates potential violations of the Insurance Act and its bylaws. Common complaints involve: failure to advise of coverage options, misrepresentation, errors in policy placement.

If you have a claim dispute: Contact your insurer's internal complaints process first. Then the General Insurance OmbudService (GIO) for federally regulated insurers. The Financial Consumer Agency of Canada for some disputes. Legal action as a last resort.

Your broker's duties under BC law: Brokers owe clients a duty of care. They must ask questions to understand your needs. They must advise on material coverage issues. Errors and omissions (E&O) insurance protects clients if a broker makes a mistake.`,
  },
  {
    topic: 'BC Home Insurance — Common Exclusions and Edge Cases',
    keywords: ['exclusion', 'vacancy', 'renovation', 'airbnb', 'short-term', 'home business', 'grow op', 'secondary'],
    content: `BC home insurance has several common exclusions that catch policyholders off guard.

Vacancy and unoccupancy: Most BC home policies void or restrict coverage after 30 days unoccupancy (sometimes 60 days). If you leave for an extended vacation, notify your insurer. Renovation exclusions often apply during major work. Vacant land or secondary properties need specific coverage.

Short-term rental (Airbnb, VRBO): Standard home and tenant policies typically exclude commercial activity including short-term rentals. If you rent your home or suite occasionally, you may be uninsured for incidents during rental periods. Some insurers offer short-term rental endorsements. Others require a separate commercial policy.

Home-based business: Business equipment and inventory above modest limits (typically $5,000–$10,000) are excluded from standard home policies. Clients visiting your home-business may not be covered under your personal liability. You may need a home-based business endorsement or a separate business policy.

Previous grow operations: BC insurers can deny coverage or charge higher premiums for homes with a history of marijuana grow operations. Mold, electrical, and structural damage from illegal grows creates ongoing risk. Disclosure required.

Leaky condo syndrome: Pre-2000 BC condos and townhouses built with "Hardi" siding or flat roofs were part of the leaky condo crisis. Many units still have latent moisture issues. Insurers may exclude gradual water damage. Strata depreciation reports are critical due diligence.

Strata rental restrictions: BC strata bylaws can restrict rentals. If you buy a strata unit to rent out, check the bylaws. Violating rental bylaws creates liability and may affect insurance.`,
  },
  {
    topic: 'BC Insurance Claims — Process and Policyholder Rights',
    keywords: ['claim', 'process', 'dispute', 'adjuster', 'denial', 'rights', 'limitation', 'appraisal'],
    content: `Filing an insurance claim in BC involves specific timelines and rights you should know.

Reporting requirements: Report claims promptly. Most policies require "immediate" notice or notice "as soon as practicable." Delay can give insurers grounds to deny. For ICBC claims, report within 24 hours or as soon as possible after an accident.

BC Insurance Act — statutory conditions: BC law attaches statutory conditions to every property insurance policy. These include: You must not misrepresent material facts. You must take reasonable precautions. You cannot abandon insured property. You have a duty to cooperate with the insurer's investigation.

Claims process: Insurer must respond promptly to your claim. Insurer must send an adjuster or written denial within a reasonable time. You have the right to independent appraisal if you dispute the quantum of a property loss. Insurer cannot unreasonably delay or withhold payment.

Limitation period: BC law gives you 2 years from the date you knew or ought to have known of your claim to sue your insurer. Property insurance policies may have a shorter contractual limitation — often 1 year from loss. Check your policy.

If your claim is denied: Get the denial in writing with reasons. Review your policy carefully. Consider hiring a public adjuster (regulated by Insurance Council). Consult a lawyer for complex denials — some work on contingency. Complaint routes: insurer internal ombudsman → General Insurance OmbudService → BCFSA → legal action.

Depreciation: If your policy is "actual cash value" (ACV) rather than "replacement cost," the insurer deducts depreciation. Always confirm whether your policy pays replacement cost or ACV.`,
  },
]

async function run() {
  console.log('Checking existing knowledge base…')
  const { count } = await supabase
    .from('insurance_knowledge')
    .select('*', { count: 'exact', head: true })

  if ((count ?? 0) > 0) {
    console.log(`Knowledge base already has ${count} entries. Skipping seed.`)
    console.log('To re-seed, delete existing rows first.')
    return
  }

  console.log(`Inserting ${knowledge.length} knowledge chunks…`)
  const { error } = await supabase.from('insurance_knowledge').insert(knowledge)

  if (error) {
    console.error('Error seeding knowledge:', error)
    process.exit(1)
  }

  console.log(`✓ Seeded ${knowledge.length} BC insurance knowledge chunks.`)
}

run()
