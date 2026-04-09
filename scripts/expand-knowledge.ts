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

const newChunks = [
  {
    topic: 'ICBC Enhanced Care — Income Replacement Benefits',
    keywords: ['icbc', 'enhanced care', 'income', 'replacement', 'wage', 'disability', 'employment'],
    content: `Under ICBC Enhanced Care, income replacement benefits are available to anyone injured in a BC auto accident regardless of fault.

Income replacement basics: Benefits replace 90% of your net (after-tax) income, up to a gross income cap indexed annually (approximately $111,000/year as of 2024). Benefits begin after a 7-day waiting period. Self-employed people are covered but must provide income documentation. Part-time and seasonal workers are covered based on average earnings.

For non-earners: Students, homemakers, and unemployed people receive a daily benefit (approximately $200/day) for care services they can no longer perform.

Duration: Short-term benefits for most injuries. Long-term for severe or permanent disabilities. Permanent impairment benefits are paid as lump sums based on an impairment rating, not income.

Key limitations: The $111,000/year cap means high earners are underinsured for income replacement. Enhanced Accident Benefits (EAB) is optional ICBC coverage that extends the cap to approximately $200,000/year — high earners should seriously consider it. You cannot sue to recover the income gap above the cap from the at-fault driver in most BC accidents.

What Enhanced Care does NOT replace: Future lost business opportunities, career advancement, professional reputation. If you are a high-income professional, the income cap is a material gap.`,
  },
  {
    topic: 'ICBC Enhanced Care — Permanent Impairment and Death Benefits',
    keywords: ['icbc', 'enhanced care', 'permanent', 'impairment', 'death', 'grief', 'fatal', 'lump sum'],
    content: `ICBC Enhanced Care provides lump-sum payments for permanent injuries and death, separate from income replacement.

Permanent impairment benefits: Paid as a lump sum based on an Independent Medical Examination (IME) that rates the degree of impairment. The maximum permanent impairment benefit is over $300,000 for the most severe injuries (total and permanent disability). Minor injuries receive lower rated amounts. The impairment rating process is contested — you have the right to dispute ICBC's assessment.

Permanent care benefits: For people who require ongoing care and assistance due to their injuries, ICBC pays for a care plan assessed by a registered care planner. This is separate from impairment benefits.

Death benefits: A lump sum death benefit is paid to the estate. Grief counselling is covered for immediate family. A spousal benefit and child benefits are paid for dependants of a deceased insured.

Limitations vs. old tort system: Under the pre-2021 tort system, juries could award large pain-and-suffering amounts for catastrophic injuries. Under Enhanced Care, the amounts are fixed by schedule — some catastrophically injured people receive less than they would have received in tort. The trade-off is speed and certainty of payment.

Important: You should seek legal advice from an ICBC-experienced lawyer even under Enhanced Care — particularly for serious injuries where impairment rating disputes can significantly affect your benefit amount.`,
  },
  {
    topic: 'ICBC Vehicle Damage — Claim Process',
    keywords: ['icbc', 'vehicle', 'damage', 'repair', 'claim', 'shop', 'estimate', 'total loss', 'write-off'],
    content: `When your vehicle is damaged in a BC accident, the ICBC vehicle damage claim process works as follows.

Reporting: Report to ICBC as soon as possible — by law, within 24 hours if possible. You can report online, by phone, or at an ICBC claim centre. Provide photos, police report number (if applicable), and contact info for all parties.

Repair process: ICBC uses a network of accredited collision repair shops. You are not required to use an ICBC-recommended shop, but repairs done at accredited shops are covered for life under ICBC's guarantee. If you use a non-accredited shop, you may need an independent estimate approved by ICBC first.

Total loss: If repair costs approach or exceed the vehicle's actual cash value (ACV), ICBC may declare it a total loss. ICBC pays ACV minus your deductible. ACV is based on current market value for similar vehicles in BC — you can dispute their valuation if you believe it's too low.

Deductibles: If you have optional collision coverage and are at fault (or partially at fault), your deductible applies to your own vehicle damage. If the other driver is 100% at fault and has ICBC coverage, their liability pays for your vehicle with no deductible to you.

Rental while in repair: ICBC's loss of use benefit covers a rental vehicle while yours is being repaired, subject to daily limits. Extended rental coverage is available as an optional add-on.

Diminished value: Unlike some US jurisdictions, BC does not allow claims for diminished value (the reduced resale value of a repaired vehicle). This is a known limitation of the ICBC system.`,
  },
  {
    topic: 'ICBC Dispute Resolution — Challenging Decisions',
    keywords: ['icbc', 'dispute', 'review', 'appeal', 'civil resolution', 'tribunal', 'CRT', 'challenge', 'decision'],
    content: `If you disagree with an ICBC decision, you have several avenues to challenge it under BC law.

Internal review: First step is requesting an ICBC internal review. You have 90 days from the decision to request a review. A different ICBC employee re-examines the file. Success rate is modest but worth doing as a first step.

Civil Resolution Tribunal (CRT): For minor injury disputes and vehicle damage disputes up to $50,000, the CRT is the mandatory first step before court. The CRT is an online tribunal — faster and cheaper than court. ICBC minor injury disputes (soft tissue injuries) are specifically handled by the CRT.

BC Supreme Court: For disputes above CRT limits, or after an unsuccessful CRT decision, you can pursue BC Supreme Court. Injury claims that exceed minor injury status (fractures, psychological injuries, etc.) may bypass the CRT. Legal fees for civil litigation can be significant.

Arbitration: Some policy disputes (not injury claims) can go to arbitration under the Insurance Act. Less common for ICBC matters.

Limitation period: Under BC law, claims against ICBC must generally be filed within 2 years of the accident (or from when you discovered the claim). Minor injury claimants must file with the CRT within this period. Missing the limitation period can permanently bar your claim.

Important: For any significant ICBC dispute — especially permanent impairment ratings, denial of benefits, or injury claims — consult a BC lawyer experienced with ICBC. Many work on contingency for injury claims. ICBC has experienced adjusters and legal staff; having representation levels the field.`,
  },
  {
    topic: 'ICBC Optional Coverage — Extended Third-Party Liability',
    keywords: ['icbc', 'optional', 'liability', 'third-party', 'extended', 'million', 'lawsuit', 'coverage'],
    content: `BC basic autoplan includes only $200,000 in third-party liability coverage — widely considered dangerously insufficient for modern accident costs.

Why $200,000 is not enough: A serious car accident causing permanent injury or death can result in judgments of $1M–$5M+. Medical costs, income replacement beyond ICBC's cap, and US accidents (where Enhanced Care does not apply) can quickly exceed $200,000. If a judgment exceeds your liability limit, you pay the difference personally.

US and out-of-province travel: Enhanced Care only applies to BC accidents. If you cause an accident in the US or another province, the injured party can sue you in tort. US jury verdicts for serious injuries routinely exceed $1M. Without extended liability, you are personally exposed.

Extended liability options: ICBC offers optional extended third-party liability in $1M, $2M, and $3M increments. Most BC insurance advisors recommend at minimum $2–3M. The annual premium for $2M in extended liability is typically $50–$150/year — remarkably inexpensive for the coverage provided. Some insurers offer umbrella policies that sit above your ICBC limit.

What extended liability covers: Damages you cause to others in a vehicle accident — bodily injury, death, property damage. Legal defence costs. Out-of-province and US accidents where tort claims are possible.

What it does NOT cover: Intentional acts. Driving while impaired (policy void). Driving without a valid licence (may void policy). Damage to your own vehicle (that's collision coverage).

Recommendation: Every BC driver should have at minimum $1M in extended liability. $2M+ is strongly advisable for anyone who drives outside BC.`,
  },
  {
    topic: 'ICBC Hit-and-Run Claims',
    keywords: ['icbc', 'hit and run', 'unidentified', 'unknown', 'driver', 'phantom', 'hit-and-run'],
    content: `BC has specific rules for hit-and-run claims where the at-fault driver cannot be identified or located.

What is covered: Under ICBC basic autoplan, damage caused by an unidentified driver is covered for bodily injury and vehicle damage, subject to specific conditions.

Conditions for a hit-and-run claim: You must report the accident to police and ICBC as soon as practicable (within 24 hours where possible). You must make reasonable efforts to identify the other driver. For vehicle damage claims, there must be physical contact between the vehicles — if a phantom vehicle causes you to crash without contact, vehicle damage may not be covered unless you have optional collision.

Bodily injury from hit-and-run: Enhanced Care covers your injuries regardless of fault, so hit-and-run injury coverage is generally straightforward under Enhanced Care.

Vehicle damage: If you have optional collision coverage, your vehicle damage is covered (minus deductible) regardless of the at-fault driver being identified. Without optional collision, vehicle damage from a hit-and-run may not be covered unless physical contact occurred and you have the basic uninsured motorist protection.

The phantom vehicle rule: If you swerved to avoid a phantom vehicle and crashed without contact, this is one of the most common coverage disputes. Basic autoplan physical damage coverage typically requires physical contact. Optional collision covers this scenario.

Practical advice: Always carry optional collision coverage. Always report hit-and-runs to police immediately. Document everything — photographs, witness information, the location and time of the incident.`,
  },
  {
    topic: 'BC Strata Insurance — The 2019–2021 Strata Insurance Crisis',
    keywords: ['strata', 'condo', 'insurance crisis', 'premiums', 'deductible', 'increase', 'hardening', 'market'],
    content: `BC strata corporations experienced a severe insurance market crisis beginning in late 2019, dramatically increasing costs and deductibles across the province.

What happened: A combination of factors — climate-related water damage claims, aging BC building stock, concentration risk in high-rise buildings, and global reinsurance market hardening — caused insurers to dramatically re-price strata insurance. Many strata corporations saw premium increases of 50–300%. Others saw their coverage dropped entirely by their insurers.

Impact on deductibles: The most significant consequence was a dramatic increase in deductibles. Water damage deductibles that were previously $10,000–$25,000 jumped to $100,000–$500,000 at many buildings. Earthquake deductibles in Metro Vancouver commonly reached $500,000–$5M+ in high-rise buildings.

Unit owner consequences: Higher deductibles directly increase unit owners' exposure to deductible assessments. A strata with a $500,000 earthquake deductible means a unit owner in a 100-unit building could face a $5,000–$50,000+ personal assessment depending on unit entitlement.

BC government response: The BC government amended the Strata Property Act in 2021 to require strata corporations to disclose their insurance coverage details to all owners. Strata corporations must now provide an insurance certificate to owners and prospective buyers on request.

What buyers should do: Before purchasing a strata unit, always request the strata corporation's current insurance certificate. Review the deductible amounts for water, earthquake, and other perils. Ensure your personal strata unit policy has deductible assessment coverage matching the strata's actual deductibles.`,
  },
  {
    topic: 'BC Strata — Depreciation Reports and Insurance Implications',
    keywords: ['strata', 'condo', 'depreciation report', 'maintenance', 'reserve fund', 'aging', 'building'],
    content: `BC strata corporations are required by the Strata Property Act to obtain depreciation reports — assessments of the building's condition and future repair costs.

What a depreciation report is: A report prepared by a qualified professional (engineer or building inspector) that assesses all common property components, estimates their remaining useful life, and projects future repair and replacement costs over a 30-year horizon.

Insurance relevance: Depreciation reports reveal building condition issues that directly affect insurability and insurance costs. Buildings with deferred maintenance, aging systems (roofs, plumbing, electrical), or known defects face higher insurance premiums or coverage restrictions. Some insurers will not quote on buildings with negative depreciation report findings.

Reserve fund adequacy: A strata's reserve fund must be sufficient to cover projected repairs. An underfunded reserve fund is a red flag — it suggests either special levies (assessments) are coming, or maintenance is being deferred. Deferred maintenance creates claims risk.

What to ask before buying: Request the most recent depreciation report and strata financial statements. Review the reserve fund balance against projected expenditures. A reserve fund significantly below the depreciation report projections signals financial risk.

Insurance implications of poor reports: If a building has significant known defects, your personal strata unit policy may exclude or limit coverage related to those defects. Gradual water damage from aging building systems — even if undisclosed to you — may be used to deny claims.

Leaky condo history: Buildings built in the 1980s–1990s with certain cladding systems (synthetic stucco, Hardi panel) may have a leaky condo history. Always check the depreciation report and strata meeting minutes for remediation history.`,
  },
  {
    topic: 'BC Strata — Bylaws, Rental Restrictions, and Insurance',
    keywords: ['strata', 'bylaws', 'rental', 'restriction', 'short-term', 'airbnb', 'tenant', 'owner'],
    content: `BC strata bylaws directly affect how you can use your unit and have insurance implications that owners frequently overlook.

Rental restriction bylaws: Strata corporations can restrict or prohibit long-term rentals under the Strata Property Act, subject to grandfathering rules. As of 2022, BC law limits strata corporations' ability to prohibit rentals to owner-occupiers — but existing bylaws may still restrict the total number of rentals in a building or impose conditions.

Short-term rentals (Airbnb/VRBO): Many strata buildings have bylaws that prohibit short-term rentals entirely. Violating a short-term rental bylaw can result in strata fines and potential liability. Critically: short-term rental activity voids most standard home and strata unit insurance policies. If you Airbnb your strata unit in violation of strata bylaws, you have both a bylaw problem and an insurance coverage problem.

Insurance for strata rental units: If you own a strata unit and rent it long-term, you need a landlord-specific policy (or a unit owner policy that includes rental coverage) rather than a standard owner-occupier policy. Coverage needs differ: your tenant's contents are their responsibility, but your liability as a landlord (for the condition of the unit) needs coverage.

Age restriction bylaws: Strata buildings can restrict occupancy to residents 55+ under the Strata Property Act. These buildings have specific insurance considerations.

What to check before buying a strata to rent: Obtain the current bylaws and any registered bylaw amendments. Confirm rental restrictions. Ensure your insurance broker knows you intend to rent the unit — this must be disclosed.`,
  },
  {
    topic: 'BC Home Insurance — Wildfire Risk and Coverage',
    keywords: ['wildfire', 'fire', 'home', 'evacuation', 'bc', 'interior', 'okanagan', 'interface', 'risk'],
    content: `Wildfire is an escalating risk in BC, particularly in the Interior, Okanagan, Cariboo, and Shuswap regions. Home insurance for properties in wildfire-prone areas has changed significantly.

What standard home insurance covers for wildfire: Fire is a named peril in every standard home insurance policy. If your home is destroyed by wildfire, your dwelling coverage pays for rebuilding. Contents are covered. Additional living expenses while your home is rebuilt are covered (typically for 12–24 months).

Evacuation costs: Most home insurance policies include an evacuation endorsement that pays for reasonable living costs (hotel, meals) during a government-ordered evacuation — even if your home is not damaged. Confirm your policy includes this and review the daily limit (typically $100–$250/day).

Wildfire risk rating and insurability: BC insurers have increasingly tightened underwriting in high-risk wildfire zones. Properties rated as "high" or "extreme" wildfire risk by provincial risk maps may face:
- Higher premiums
- Reduced coverage limits
- Exclusions for adjacent outbuildings
- Non-renewal of coverage

Ember intrusion: Wildfires often destroy homes through ember intrusion rather than direct flame contact. Some policies have specific requirements (mesh screens, non-combustible materials) that if not maintained can affect claims.

FireSmart program: BC's FireSmart program helps property owners reduce wildfire risk. Some insurers offer discounts for FireSmart-certified properties or participation in community FireSmart programs. Ask your broker.

Vacant properties during wildfire season: If you leave your property vacant for more than 30 days (the typical vacancy threshold), coverage may be restricted during wildfire season.`,
  },
  {
    topic: 'BC Home Insurance — Vacancy Clause',
    keywords: ['vacancy', 'vacant', 'unoccupied', 'home', 'exclusion', 'condition', 'snowbird', 'travel'],
    content: `One of the most common coverage gaps in BC home insurance is the vacancy clause — a policy condition that restricts or eliminates coverage when a home is unoccupied for extended periods.

Standard vacancy thresholds: Most BC home insurance policies define a vacancy threshold of 30 consecutive days. Some policies allow 60 days. If your home is unoccupied beyond this threshold, certain coverages are automatically suspended.

What is typically excluded during vacancy: Water damage (burst pipes, slow leaks). Vandalism and malicious acts. Glass breakage. In some policies, theft. Fire coverage usually remains but with higher scrutiny.

Why this matters: A BC homeowner who goes on a 5-week vacation and returns to find their pipes burst during a cold snap may discover they have no coverage for the water damage. This is one of the most frequently disputed home insurance claims in BC.

Workarounds: Contact your insurer before any extended absence. Options typically include: having someone check the property regularly (often every 3–7 days per the policy), obtaining a vacancy permit endorsement (additional cost), draining the water supply during absence, maintaining minimum heat levels, and having a monitoring system.

Snowbirds and seasonal residents: If you spend winters in a warmer climate, you must address the vacancy clause every year. A neighbour or property manager checking weekly may satisfy the policy requirement — get this confirmed in writing by your insurer.

Secondary and seasonal properties: Cottages, cabins, and vacation properties that are only used seasonally require specific insurance products. Standard home policies are not designed for properties that are routinely vacant for months at a time.`,
  },
  {
    topic: 'BC Home Insurance — Short-Term Rental (Airbnb, VRBO)',
    keywords: ['airbnb', 'vrbo', 'short-term', 'rental', 'home', 'sharing', 'commercial', 'host', 'exclusion'],
    content: `Renting your BC home, suite, or condo on Airbnb or VRBO creates an insurance gap that most homeowners are unaware of.

The core problem: Standard home and tenant insurance policies exclude commercial activity. Short-term rentals are considered commercial activity. If a guest is injured, causes damage, or steals during a rental period, your standard policy will likely deny the claim on the basis that the premises were being used commercially.

What you need: A specific short-term rental endorsement, or a separate commercial host policy. Options vary by insurer:
- Some major BC insurers (e.g. Square One) offer short-term rental endorsements
- Some decline to offer any coverage for short-term rental hosts
- Airbnb's own "AirCover" program provides some protection, but it is not a substitute for proper insurance and has significant limitations

The platform "protection" gap: Airbnb's AirCover and VRBO's similar programs are not insurance policies. They are company-administered protection programs with extensive exclusions, no regulatory oversight, and no BC Insurance Act protections. Do not rely on them as your primary coverage.

Liability exposure: If a guest slips, falls, or is injured on your property during a rental, the liability claim will be significant. Personal home insurance liability coverage specifically excludes commercial rental activities. You need commercial host liability coverage.

Strata units: Short-term rental may also violate your strata bylaws, giving the strata corporation grounds to fine you and potentially creating coverage issues with the master policy.

Disclosure obligation: You are legally obligated to disclose all material facts — including short-term rental use — when applying for or renewing home insurance. Failure to disclose can void your policy.`,
  },
  {
    topic: 'BC Home Insurance — Renovation and Construction',
    keywords: ['renovation', 'construction', 'contractor', 'home', 'exclusion', 'builder', 'permit', 'vacant'],
    content: `Significant home renovations in BC create insurance complications that can leave you without coverage at the worst time.

Standard policy limitations during renovation: Most BC home policies exclude or limit coverage for homes undergoing major renovations. Specific concerns include: vacant premises during renovation (triggering vacancy clause), increased fire risk from construction activity, theft of materials and tools, and work-related injuries on your property.

Builder's risk / course of construction insurance: Major renovations should be covered by a builder's risk (also called course of construction) policy. This is a specialized policy that covers the structure and materials during the construction period. Your regular home policy does not fill this role adequately.

Contractor liability: Your contractor must carry their own liability and WCB (WorkSafeBC) coverage. Require certificates of insurance before any contractor begins work. If an uninsured contractor is injured on your property, you may be exposed to WorkSafeBC claims.

Homeowner liability during renovation: If you hire workers directly (not through a licensed contractor) as a homeowner, you may have WorkSafeBC employer obligations. This is often overlooked.

What to do before a major renovation: Notify your insurer in writing before work begins. Ask specifically how your coverage changes during renovation. Obtain a builder's risk endorsement or standalone policy if needed. Confirm the contractor's insurance. Understand that the vacancy clause may be triggered if you move out during renovation.

After renovation: Notify your insurer when work is complete. Your dwelling value may have increased significantly — ensure your coverage limits are updated to reflect replacement cost of the improved home.`,
  },
  {
    topic: 'BC Home Insurance — Secondary and Vacation Properties',
    keywords: ['secondary', 'vacation', 'cabin', 'cottage', 'seasonal', 'strata', 'rental', 'property'],
    content: `Insuring a secondary property in BC — a vacation home, cabin, or investment property — requires a different approach than your primary residence.

Why standard home policies don't work: Standard home policies assume the property is your principal residence and is regularly occupied. Secondary properties that sit vacant for months at a time are routinely denied coverage under the vacancy clause and are underwritten as higher risk.

Secondary property insurance products: Most major BC insurers offer specific secondary/seasonal property policies. These acknowledge the seasonal occupancy pattern, but typically exclude or limit: vandalism and malicious acts, water damage from burst pipes during vacancy, theft of contents. The trade-off is lower premium but narrower coverage.

Rural and remote properties: Cabins and properties without year-round road access, municipal water, or fire department service are underwritten very differently. Premiums are higher, contents coverage may be limited, and fire coverage may be rated based on fire hall response time.

Rental income from secondary properties: If you rent your vacation property to others, you need a landlord or vacation rental policy, not a standard secondary home policy. Income replacement for lost rental income (if the property is damaged and uninhabitable) requires a specific loss of rental income endorsement.

Strata ownership of secondary properties: Purchasing a strata unit as a vacation/investment property is common in resort areas (Whistler, Kelowna, Tofino). Check the strata bylaws for rental restrictions before purchase. Your personal strata unit insurance must reflect the actual occupancy pattern.

Earthquake and secondary properties: Secondary properties in BC seismic zones should carry earthquake coverage, though this is often overlooked. The same coverage gap that exists for primary residences applies to secondary properties.`,
  },
  {
    topic: 'BC Home Insurance — Co-Insurance and Insurance to Value',
    keywords: ['co-insurance', 'insurance to value', 'underinsured', 'replacement cost', 'dwelling', 'limit', 'penalty'],
    content: `Underinsurance — carrying insufficient coverage to rebuild your home — is one of the most costly mistakes BC homeowners make, and most are unaware of the co-insurance penalty that applies.

What co-insurance means: Most BC home insurance policies require you to insure your dwelling for at least 80–100% of its full replacement cost. If you carry less coverage than required, you share the loss with your insurer proportionally — even for partial claims.

Example of co-insurance penalty: Your home would cost $600,000 to rebuild. Your policy requires 80% coverage ($480,000). You only carry $400,000. If you have a $100,000 kitchen fire, your insurer applies the co-insurance formula: ($400,000 / $480,000) × $100,000 = $83,333 paid. You absorb the $16,667 difference — despite having insurance.

BC-specific problem: Construction costs in BC (especially Metro Vancouver and the Lower Mainland) have increased dramatically. Homes insured 5–10 years ago at market value are now significantly underinsured on a replacement cost basis. Replacement cost and market value are entirely different — a $900,000 Vancouver Special may cost $700,000 to rebuild but has a $1.5M market value.

Inflation protection: Some BC policies include automatic inflation adjustment that increases dwelling coverage annually. Confirm whether your policy includes this and whether the adjustment is keeping pace with actual BC construction cost inflation.

What to do: Ask your insurer for a replacement cost estimate (some use tools like Marshall & Swift). Review your dwelling coverage limits every 1–2 years. If you've done renovations that increased the value of the home, notify your insurer to increase the dwelling limit.`,
  },
  {
    topic: 'BC Home Insurance — High-Value Items (Jewellery, Art, Collectibles)',
    keywords: ['jewellery', 'jewelry', 'art', 'collectibles', 'valuables', 'floater', 'rider', 'scheduled', 'contents'],
    content: `Standard BC home insurance policies have sub-limits on high-value items that leave many homeowners significantly underinsured for their most valuable personal property.

Standard sub-limits in BC home policies: Most policies have per-category limits regardless of your overall contents coverage. Typical limits include: jewellery and watches: $2,000–$5,000 total. Cash: $200–$500. Securities and documents: $1,000. Furs: $2,000. Art and collectibles: $2,000–$5,000. Bicycles: $500–$1,000. Sports equipment: $2,000.

A $30,000 engagement ring under a standard policy: Covered only to the jewellery sub-limit (typically $2,000–$5,000), regardless of how much contents coverage you carry. A $30,000 ring is insured for $2,000–$5,000 under most standard policies.

Scheduled articles floater: A floater (also called a rider or inland marine endorsement) lists individual high-value items by description and agreed value. Coverage is typically all-risk (including mysterious disappearance — losing a ring). Premium is typically 1–2% of the scheduled value per year.

What requires scheduling: Engagement and wedding rings above the sub-limit. Watches worth more than the sub-limit. Fine art and sculpture. Wine collections. Coin, stamp, or sports card collections. Musical instruments. High-end bicycles, camera equipment, or electronics.

Appraisals: You need a professional appraisal to schedule items properly. Some insurers accept receipts for newer purchases. Appraisals should be updated every 3–5 years for items that appreciate (jewellery, art).

Important: Many BC homeowners discover after a theft or loss that items they assumed were insured were only partially covered. Review your policy's scheduled articles section with your broker today.`,
  },
  {
    topic: 'BC Tenant Insurance — Subrogation and Landlord Claims',
    keywords: ['tenant', 'renter', 'subrogation', 'landlord', 'liability', 'damage', 'waiver', 'negligence'],
    content: `One of the most important reasons for BC renters to carry tenant insurance is protection against subrogation claims from landlords and their insurers.

What subrogation means for tenants: If your negligence causes damage to the rental property (e.g. leaving the stove on, an overflowing bathtub, a candle fire), your landlord's insurer will pay for the damage — and then may come after you personally to recover what they paid. This is called subrogation.

BC law context: Under BC's Residential Tenancy Act, tenants are responsible for damage beyond reasonable wear and tear. If you negligently cause significant damage to the unit, your landlord can claim compensation through the Residential Tenancy Branch or the courts.

How tenant insurance protects you: Your tenant insurance liability coverage pays on your behalf if you are legally responsible for damage to the property or injury to others. Without tenant insurance, you are personally liable.

Waiver of subrogation: Some landlords include a waiver of subrogation clause in tenancy agreements, which prevents the landlord's insurer from coming after the tenant. However, this is not universal and should not be relied upon in place of your own liability coverage.

Common scenarios: Leaving a bathtub running — floods below unit. Grease fire that spreads to kitchen and hallway. Electrical fire from overloaded outlet. Leaving a door open that leads to theft. All of these are scenarios where a tenant without liability coverage faces significant personal financial exposure.

Cost vs. risk: Tenant insurance in BC typically costs $20–$30/month. A single subrogation claim for water damage to a multi-unit building can easily reach $50,000–$200,000. The risk-to-premium ratio makes tenant insurance one of the best value insurance products available.`,
  },
  {
    topic: 'BC Insurance — Personal Liability and Umbrella Policies',
    keywords: ['liability', 'personal', 'umbrella', 'excess', 'lawsuit', 'injury', 'negligence', 'home', 'auto'],
    content: `Personal liability coverage protects you if you are found legally responsible for injuring someone or damaging their property outside of a vehicle context. It is included in home, strata unit, and tenant insurance policies.

Standard personal liability limits: BC home and strata unit policies typically include $1M–$2M in personal liability coverage. Tenant policies are often $1M. This covers incidents arising from your residence or personal activities.

What personal liability covers: Injury to a visitor in your home (slip and fall). Dog bites. Injury caused by your child. Property damage you accidentally cause at someone else's home. Legal defence costs are included (often the most expensive component).

What it does NOT cover: Intentional acts. Business activities at home (unless business endorsement added). Motor vehicle accidents (covered by ICBC). Professional liability (covered by E&O / professional liability policies).

Umbrella (excess liability) policies: An umbrella policy sits on top of your home and auto liability limits, providing additional coverage — typically $1M–$5M — for the same covered events. In BC, umbrella policies are not widely marketed as a standalone product. Some insurers offer them; alternatively, excess liability can sometimes be added as an endorsement.

When personal liability may not be enough: High-net-worth individuals, people who frequently host at home, dog owners (especially large or historically aggressive breeds), and people with significant asset exposure should consider whether standard $1M–$2M limits are adequate.

Dog liability: Many BC insurers have exclusions or restrictions for specific dog breeds. If you own a breed considered high-risk (pit bulls, Rottweilers, Dobermans), disclose this to your insurer. Some policies explicitly exclude dog bite liability for certain breeds.`,
  },
  {
    topic: 'BC Insurance Claims — Public Adjusters',
    keywords: ['public adjuster', 'adjuster', 'claim', 'advocate', 'dispute', 'settlement', 'insurance council'],
    content: `A public adjuster is a licensed insurance professional who represents policyholders (not insurers) in insurance claims. They are regulated by the Insurance Council of BC.

What public adjusters do: Assess the damage and prepare a detailed claim on your behalf. Negotiate with the insurer's adjuster for a fair settlement. Handle the documentation, compliance, and paperwork. Represent your interests throughout the claim process.

When to consider a public adjuster: Complex or high-value claims (large fires, major water damage, business interruption). Claims where the insurer's initial settlement offer seems too low. Claims where you lack the expertise to assess damage (mold, structural damage). Situations where you are overwhelmed by the process.

Cost of a public adjuster: Public adjusters in BC typically charge a percentage of the final claim settlement — usually 10–15% for residential claims. For large claims, this can be a significant amount. Ensure you understand the fee structure before signing a contract.

Regulation: Public adjusters in BC must be licensed by the Insurance Council of BC. You can verify a public adjuster's licence on the Insurance Council's website. Be cautious of unlicensed individuals claiming to be claim consultants.

Important considerations: A public adjuster's fee comes out of your settlement. Their value depends on whether they can negotiate a settlement higher than you would receive without them. For simple, clearly covered claims, a public adjuster may not add value. For complex, disputed, or large claims, they can be worth their fee.

Alternative: A lawyer. For denied claims or major disputes, a lawyer specializing in insurance coverage can provide representation and may work on contingency. Legal representation tends to be more appropriate for coverage disputes (legal questions), while public adjusters are more appropriate for quantum disputes (how much).`,
  },
  {
    topic: 'BC Insurance Claims — Proof of Loss',
    keywords: ['proof of loss', 'claim', 'documentation', 'statutory', 'deadline', 'sworn', 'inventory'],
    content: `Under BC's Insurance Act, the Proof of Loss is a formal document you submit to your insurer substantiating your claim. Missing the deadline or filing it incorrectly can jeopardize your claim.

What is a Proof of Loss: A sworn written statement (often notarized) describing the loss, the circumstances, the items damaged or lost, and the amount you are claiming. It is a statutory requirement under BC law for property insurance claims.

Deadline: Under BC's Insurance Act statutory conditions, you must submit a Proof of Loss within 90 days of the loss. Your policy may set a different (sometimes shorter) deadline. Check your specific policy.

What it must contain: Date and cause of the loss. Description and value of damaged or lost property. Any encumbrances (mortgages) on the property. Other insurance on the same property. Your signature under oath.

Contents inventory: For contents claims, the Proof of Loss requires an itemized list of everything lost or damaged, with values. Most policyholders have no contents inventory and must reconstruct this from memory, receipts, photos, and financial records. This is why a pre-loss home inventory (photos, video, receipts) is so valuable.

Consequences of non-compliance: Failing to submit a Proof of Loss on time, or submitting one with material inaccuracies, can give the insurer grounds to deny or reduce the claim. Courts have been sympathetic to policyholders who make good-faith efforts to comply, but strict compliance is strongly advisable.

Practical tip: When you suffer a significant loss, photograph and video everything before any cleanup or repair begins. Keep all damaged items until the insurer's adjuster has inspected them. Document every conversation with your insurer in writing.`,
  },
  {
    topic: 'BC Insurance — Replacement Cost vs Actual Cash Value',
    keywords: ['replacement cost', 'actual cash value', 'ACV', 'depreciation', 'contents', 'dwelling', 'settlement'],
    content: `Whether your BC insurance policy pays replacement cost or actual cash value (ACV) is one of the most consequential policy terms — and one most policyholders only discover after a claim.

Replacement cost: Pays the full cost to repair or replace damaged property with new equivalent property at current prices, without deducting for depreciation. If your 10-year-old TV is destroyed, replacement cost pays for a comparable new TV.

Actual cash value (ACV): Pays replacement cost minus depreciation for the age and condition of the item. Your 10-year-old TV worth $400 new might have an ACV of $100. Most older items have very low ACV.

For dwellings: Most standard BC home policies include replacement cost on the dwelling (the building). Insurers are required to provide replacement cost for residential dwellings under BC regulations. However, if your coverage limit is lower than actual replacement cost (underinsurance), the difference is your problem.

For contents: Contents coverage can be replacement cost or ACV — this is a policy choice. Replacement cost contents coverage is more expensive but far superior. ACV contents coverage results in much lower payouts for older items. Check which you have and consider upgrading to replacement cost contents if you have ACV.

For vehicles: ICBC pays ACV for total loss claims. There is no replacement cost option for vehicle damage under ICBC. New vehicle protection (for vehicles written off in the first two model years) is available as an optional add-on from ICBC.

Depreciation disputes: ACV depreciation rates are set by the insurer. Policyholders frequently dispute these rates. If you believe the depreciation applied is excessive, you have the right to dispute it through the appraisal process under the Insurance Act.`,
  },
  {
    topic: 'BC Financial Services Authority (BCFSA)',
    keywords: ['BCFSA', 'regulator', 'complaint', 'insurer', 'financial services', 'authority', 'provincial'],
    content: `The BC Financial Services Authority (BCFSA) is the provincial regulator for insurance companies, credit unions, mortgage brokers, and pension plans in BC.

What BCFSA regulates: Provincially incorporated insurance companies operating in BC. Market conduct of all insurers (federally and provincially regulated) for BC consumers. Solvency of provincially regulated insurers.

What BCFSA does NOT regulate: Federally incorporated insurance companies are primarily regulated by OSFI (Office of the Superintendent of Financial Institutions). Most major Canadian home and auto insurers are federally regulated — BCFSA plays a secondary role in their market conduct.

Who regulates what in BC insurance: Insurance Council of BC → regulates brokers, agents, and adjusters (the people who sell and administer insurance). BCFSA → regulates the insurance companies and market conduct. OSFI → regulates federally chartered insurers' solvency.

Filing a complaint with BCFSA: If your complaint involves an insurer's market conduct (unfair claims handling, misleading advertising, systematic issues) rather than a specific claim dispute, BCFSA is the appropriate regulator. Individual claim disputes are typically handled through the insurer's complaints process, then the General Insurance OmbudService (GIO).

Consumer protection role: BCFSA maintains a public register of licensed financial institutions. They investigate systemic complaints about insurer conduct and can take enforcement action. Individual policyholders with specific claim disputes are generally better served by the GIO or legal action.

General Insurance OmbudService (GIO): For individual claim disputes with federally regulated insurers, the GIO provides free dispute resolution. BCFSA and the GIO together form the consumer complaint framework for BC insurance.`,
  },
  {
    topic: 'BC Insurance — General Insurance OmbudService (GIO)',
    keywords: ['GIO', 'ombudservice', 'complaint', 'dispute', 'claim', 'appeal', 'resolution', 'free'],
    content: `The General Insurance OmbudService (GIO) provides free, independent dispute resolution for consumers with unresolved complaints about property and casualty insurers in Canada, including BC.

What the GIO handles: Unresolved disputes with participating insurers (most major BC home, auto, and commercial insurers). Claim disputes, coverage denials, claim payment amounts. Complaints about service, delays, or conduct.

Process: First, you must exhaust the insurer's internal complaint process. Obtain a final position letter from the insurer's ombudsperson. Then you can escalate to the GIO. The GIO reviews the file, may conduct interviews, and issues a recommendation.

GIO recommendations: GIO recommendations are not binding on the insurer. However, most participating insurers accept GIO recommendations. If the insurer does not accept the recommendation, your remaining option is legal action.

Limitations: GIO is not available for ICBC claims (ICBC has its own review process through the Civil Resolution Tribunal). The GIO does not investigate complaints that are before the courts. There are time limits — contact the GIO promptly after receiving the insurer's final position.

Value of the GIO process: The GIO process is free, relatively fast (weeks to months rather than years), and provides an independent assessment. For claims under $50,000–$100,000 where legal fees would be prohibitive, the GIO may be your most practical recourse after an insurer denies your claim.

Finding participating insurers: The GIO website lists member companies. Most major BC property and casualty insurers (Intact, Aviva, Wawanesa, RSA, Economical, etc.) participate. Check the GIO website to confirm your insurer is a member before beginning the process.`,
  },
  {
    topic: 'BC Insurance — Fraud and Misrepresentation Consequences',
    keywords: ['fraud', 'misrepresentation', 'void', 'disclosure', 'material', 'fact', 'policy', 'consequence'],
    content: `Misrepresenting material facts when applying for BC insurance — or making fraudulent claims — can have severe consequences beyond simply losing your claim.

Material facts: A material fact is any information that would influence a reasonable insurer's decision to offer coverage or set premiums. Examples: prior claims history, grow operation history at the property, actual occupancy status, previous insurance cancellations, criminal convictions, business activities at home.

Duty of disclosure: Under BC's Insurance Act, you have a duty to disclose all material facts when applying for insurance and at renewal. You must answer questions honestly and completely. You do not need to volunteer information not asked about, but you must not misrepresent information.

Consequences of misrepresentation: Insurer can void the policy from inception (as if it never existed) — leaving you with no coverage for a loss. Insurer can deny a specific claim while keeping premiums paid. Criminal fraud charges in serious cases. Difficulty obtaining insurance in the future (insurers share information through industry databases).

Claims fraud: Filing a false claim, inflating a claim, or staging a loss is insurance fraud — a criminal offence in Canada. ICBC and home insurers have dedicated fraud investigation units. Red flags trigger investigations. Convictions result in criminal records and restitution orders, and make future insurance coverage extremely difficult to obtain.

Common innocent misrepresentations: Forgetting to disclose a prior claim. Not mentioning a home-based business. Stating property is owner-occupied when rented. These "innocent" misrepresentations can still void coverage under BC law if the insurer proves they were material.

Best practice: Always disclose more, not less. If in doubt about whether something is material, disclose it to your broker and document that you disclosed it.`,
  },
  {
    topic: 'BC Home Insurance — Mold and Air Quality',
    keywords: ['mold', 'mould', 'air quality', 'water damage', 'gradual', 'exclusion', 'remediation', 'hidden'],
    content: `Mold is one of the most contentious areas of BC home insurance — insurers routinely deny mold claims, and policyholders are frequently surprised by these denials.

The core distinction: Insurance covers sudden, accidental losses. Mold that results from a sudden, covered water event (burst pipe, storm damage) is typically covered as part of that water damage claim. Mold that results from gradual moisture — a dripping pipe, condensation, inadequate ventilation, maintenance issues — is almost always excluded as gradual damage.

How mold becomes an exclusion: A pipe drips slowly behind a wall for months. Mold grows. The homeowner discovers it during renovation. Insurer denies coverage: the water damage was gradual (not sudden), so mold remediation is not covered. This is a very common claim denial pattern in BC.

Hidden water damage and mold: Some mold grows behind walls or under floors from a slow leak that was genuinely unknown. Insurers may still deny on "gradual damage" grounds, even if the leak was concealed. This is frequently litigated.

Remediation costs: Professional mold remediation in BC can cost $10,000–$100,000+ depending on the extent. If insurance denies the claim, these costs fall entirely on the homeowner.

Leaky condo syndrome: BC condos built in the 1980s–1990s with certain cladding systems had systematic water intrusion that caused widespread mold. Many buildings were remediated at enormous cost. Check the depreciation report and strata minutes before buying an older BC condo.

Pre-existing mold: If you purchase a property with undisclosed mold issues, you may have legal recourse against the seller and their realtor for non-disclosure — but this is a civil matter, not an insurance matter. Insurance will not cover pre-existing mold conditions.`,
  },
  {
    topic: 'BC Home Insurance — Home-Based Business',
    keywords: ['home business', 'business', 'home', 'commercial', 'liability', 'inventory', 'equipment', 'client'],
    content: `Operating a business from your BC home creates insurance gaps that most homeowners and standard policies do not address adequately.

What standard home policies cover: A very modest amount of business property — typically $2,500–$10,000 for business equipment. This covers a laptop and a printer but not significant inventory, specialized equipment, or client property in your care.

What standard policies do NOT cover: Business income loss if you cannot operate due to a covered loss. Liability to clients or business visitors on your property. Employee-related injuries or claims. Professional errors (that's E&O insurance). Significant business inventory or equipment.

Home-based business endorsement: Many BC insurers offer a home-based business endorsement that extends your home policy to include: higher business property limits, business liability for your home business activities, limited business income protection. This is appropriate for lower-risk home businesses (consultants, freelancers, online sellers with modest inventory).

When you need a separate commercial policy: Higher-risk businesses. Businesses with clients visiting regularly. Businesses with employees. Significant inventory. Professional services with E&O exposure. Businesses storing clients' property.

WorkSafeBC: If you have employees working in your home, WorkSafeBC employer registration and premiums are required. Home insurance does not substitute for WCB coverage.

Disclosure required: You must disclose all home business activities to your insurer. This includes occasional client meetings, operating an online store from home, or any business use beyond basic home office. Failure to disclose can void coverage for both business and personal losses if the business use contributed to the claim.`,
  },
  {
    topic: 'BC Insurance — Leaky Condo Syndrome',
    keywords: ['leaky condo', 'building envelope', 'water ingress', 'EIFS', 'hardi', 'remediation', 'condo', 'strata'],
    content: `BC's leaky condo crisis of the 1980s–1990s was one of the largest property disasters in Canadian history, resulting in estimated remediation costs of $1–4 billion. Many affected buildings still carry residual risk.

What happened: Buildings constructed during this period used synthetic stucco (EIFS — Exterior Insulation and Finish Systems), fibre cement siding, flat or low-slope roofs, and design details that trapped moisture rather than draining it. The result was systemic water ingress into wall assemblies, leading to rot, mold, and structural damage. The crisis affected thousands of condos and townhouses across BC.

Insurance implications today: Buildings with leaky condo history are considered higher risk by insurers. Some insurers refuse to write new policies on affected buildings. Others apply exclusions for water ingress or building envelope issues. Premiums are higher.

Remediation does not eliminate all risk: Many buildings were partially or fully remediated, but not all remediated buildings are risk-free. The quality of remediation varies, and some buildings have had recurring issues. A building remediation certificate exists but does not guarantee all issues are resolved.

For buyers: The strata depreciation report is essential. Review strata meeting minutes for references to water intrusion, building envelope issues, or remediation. Request the engineering reports if any. Buildings built between approximately 1985–1998 with the affected cladding types warrant extra scrutiny.

For current owners: Your strata unit insurance policy may have specific exclusions for building envelope claims. Review your policy carefully. The master policy should cover building envelope damage if sudden and accidental — but gradual water ingress from a pre-existing defect may be excluded.

Legal recourse history: BC passed the Limitation Act exceptions for leaky condo cases given the difficulty of detecting latent defects, but the limitation periods have now passed for most historical leaky condo claims.`,
  },
  {
    topic: 'ICBC — Optional Enhanced Accident Benefits (EAB)',
    keywords: ['icbc', 'enhanced accident benefits', 'EAB', 'optional', 'income', 'high earner', 'coverage', 'top-up'],
    content: `ICBC's Enhanced Accident Benefits (EAB) is optional coverage that extends the income replacement and other Enhanced Care limits for higher-income earners.

Why EAB exists: ICBC Enhanced Care caps income replacement at approximately $111,000/year gross income. For BC residents earning above this threshold — doctors, engineers, business owners, executives — the cap leaves a significant income replacement gap if they are seriously injured.

What EAB covers: Extended income replacement above the Enhanced Care cap (up to approximately $200,000/year). Higher lump-sum permanent impairment benefits. Additional caregiver benefits.

Who should consider EAB: Anyone whose gross employment or self-employment income exceeds approximately $111,000/year. Business owners whose business income would be at risk during incapacity. High earners who want to ensure income continuity during recovery from a serious injury.

Cost: The annual premium for EAB is modest relative to the income exposure it covers — typically under $100/year. Given the coverage it provides, it represents excellent value for high earners.

How to add it: EAB is purchased through your ICBC broker at the time of autoplan renewal. It must be added proactively — it is not included in basic autoplan.

Limitations: EAB only applies to injuries sustained in BC motor vehicle accidents. It does not cover disability from illness or non-vehicle accidents. Those risks require separate disability insurance products (long-term disability, critical illness).

Interaction with group benefits: If you have employer-provided long-term disability coverage, coordinate with your benefits advisor to understand how group LTD and ICBC EAB interact — there may be offset provisions.`,
  },
  {
    topic: 'BC Insurance — Subrogation Rights',
    keywords: ['subrogation', 'third party', 'recovery', 'at-fault', 'rights', 'waiver', 'insurer', 'claim'],
    content: `Subrogation is the legal right of your insurer to step into your shoes and recover from a responsible third party after paying your claim.

How subrogation works: You suffer a loss caused by a third party (e.g. a contractor who negligently causes a fire, or a driver who damages your property). Your insurer pays your claim. Your insurer then has the right to sue or recover from the responsible third party in your name, up to the amount they paid.

Why subrogation matters to you: If your insurer recovers money from the responsible party, you may receive reimbursement of your deductible. Without subrogation rights, insurers would face higher losses, resulting in higher premiums for everyone. Preserving subrogation is a policy condition — if you release the responsible party from liability before your insurer can pursue them, you may void your own coverage.

Waiver of subrogation: Some contracts (leases, construction contracts) include waivers of subrogation, agreeing in advance not to pursue recovery from the other party. Your insurer must agree to any such waiver — you cannot unilaterally waive your insurer's subrogation rights.

Tenant subrogation: The most common BC subrogation scenario involves tenant negligence. If a tenant's carelessness causes damage, the landlord's insurer pays and may then pursue the tenant. This is why tenant liability insurance is essential.

ICBC and subrogation: ICBC routinely pursues at-fault drivers who are uninsured, who were driving under the influence, or who committed a Criminal Code offence. If ICBC pays a claim and then pursues you for the amount paid (because you were driving impaired or committed fraud), this is subrogation in action.

Your obligations: Cooperate with your insurer's subrogation efforts. Provide all information about the responsible party. Do not sign any releases or settlements with responsible third parties without your insurer's written consent.`,
  },
  {
    topic: 'BC Home Insurance — Sewer Backup in Detail',
    keywords: ['sewer', 'backup', 'water', 'drain', 'municipal', 'endorsement', 'basement', 'flooding'],
    content: `Sewer backup is one of the most frequently claimed water damage events in BC, and one of the most commonly excluded perils under standard policies.

What sewer backup means: Sewer backup occurs when the municipal sanitary sewer system reverses flow into your home through floor drains, toilets, or other fixtures. It is distinct from overland water (external flooding) and internal pipe leaks.

Why it happens: Aging municipal infrastructure in Metro Vancouver and the Fraser Valley. Combined sewer systems overwhelmed by heavy rainfall. Tree roots infiltrating sewer lines. Blockages in the municipal or your private line.

Standard policy exclusion: Sewer backup is not covered under most standard BC home policies. It requires a specific sewer backup endorsement.

What the endorsement covers: Damage to your home and contents caused by water that backs up through sewers or drains. Cleanup, restoration, and repair costs.

What it does NOT cover (typical exclusions): Damage caused by continuous or repeated seepage (gradual). Flood water that enters through windows, doors, or foundations (that's overland water). Pre-existing conditions.

Limits: Sewer backup endorsements in BC typically have limits of $10,000–$50,000. In a severe backup event, cleanup and remediation costs can exceed lower limits. Choose a sewer backup limit that reflects your actual basement contents and renovation value.

Cost: Sewer backup endorsements in BC typically cost $50–$150/year for standard residential properties. They are one of the best-value endorsements available given the frequency of claims.

Strong recommendation: All BC homeowners with basement space should carry sewer backup coverage. Given the aging municipal infrastructure in much of Metro Vancouver and the Fraser Valley, this is not a question of "if" but "when" for many properties.`,
  },
  {
    topic: 'BC Strata — Special Levies vs Insurance Deductible Assessments',
    keywords: ['strata', 'special levy', 'assessment', 'deductible', 'insurance', 'repair', 'reserve fund'],
    content: `BC strata owners often confuse two types of strata charges: special levies for capital repairs and insurance deductible assessments for claims. They are legally distinct and handled differently.

Special levy: A special levy is an additional payment required of all unit owners to fund a specific capital repair or improvement that the reserve fund cannot cover. Common examples: building envelope remediation, elevator replacement, parkade repairs. Special levies require a 3/4 vote of owners to pass (or majority vote in some cases). They can be very large — $20,000–$100,000+ per unit for major building repairs. Special levies are not covered by insurance.

Insurance deductible assessment: When a claim is made against the strata master policy, the deductible must be paid before insurance coverage kicks in. The strata corporation can pass the deductible cost to unit owners, either equally or by unit entitlement (proportional to unit size as set in the strata plan). The Strata Property Act allows the strata to specifically charge the deductible to the owner whose unit was the source of the loss (e.g. a burst pipe in your unit that caused widespread damage).

Insurance coverage for assessments: Your personal strata unit insurance should include deductible assessment coverage. This covers your portion of an insurance deductible assessment — not a special levy. Some policies specifically clarify this distinction.

The key difference: Special levies are for capital repairs and are not coverable under insurance. Deductible assessments are insurance-related and should be covered by your deductible assessment rider.

Maximum deductible assessment exposure: Your deductible assessment coverage limit should match (or exceed) the strata master policy's largest per-peril deductible — often the earthquake deductible. In Metro Vancouver buildings, this can be $100,000–$500,000+ per unit for earthquake.`,
  },
  {
    topic: 'BC Insurance — Limitation Periods for Claims',
    keywords: ['limitation', 'period', 'deadline', 'sue', 'claim', 'two years', 'property', 'time limit'],
    content: `BC insurance claims are subject to strict time limits. Missing these deadlines can permanently bar you from recovering on a legitimate claim.

BC Limitation Act: The general limitation period in BC is 2 years from the date you discovered (or ought to have discovered) your claim. This applies to actions against insurers for denied or underpaid claims.

Property insurance statutory conditions: BC's Insurance Act attaches statutory conditions to all property insurance policies. One condition specifies that a claim for loss must be commenced within 1 year of the loss or the date of denial — check your specific policy, as contractual limitation periods can be shorter than the general 2-year limitation.

The "discovery rule": The 2-year limitation begins when you know, or reasonably should know, that you have a claim. For slowly developing issues (mold, structural problems, long-term liability), the discovery date may be later than the actual date of loss.

ICBC claims: ICBC bodily injury claims under Enhanced Care are subject to limitation periods. Report to ICBC promptly — delay can affect your claim. For disputes, file with the Civil Resolution Tribunal within the applicable limitation period.

Practical impact: Many BC policyholders are denied recovery every year because they waited too long after a denial to pursue their rights. If your insurer denies your claim, immediately note the date and consult with a lawyer or the GIO about your deadlines.

What tolls (pauses) the limitation: The limitation period may be tolled during ongoing settlement negotiations (depending on the circumstances). The GIO process does not automatically toll the limitation period — be cautious. Get legal advice on whether any ongoing process protects your limitation period.`,
  },
  {
    topic: 'BC Insurance — Secondary Suites and Disclosure',
    keywords: ['secondary suite', 'suite', 'rental', 'unauthorized', 'disclosure', 'tenant', 'home', 'laneway'],
    content: `BC has a large number of homes with secondary suites (basement suites, carriage houses, laneway homes) — both authorized and unauthorized. This has significant insurance implications that are frequently misunderstood.

Disclosure obligation: You must disclose the existence of a secondary suite to your home insurer. Failure to disclose a secondary suite is a material misrepresentation that can void your coverage.

How it changes your coverage: A home with a secondary suite is effectively a landlord/rental property for the portion being rented. Your insurance exposure includes: liability for the condition of the rental unit, potential loss of rental income, and different risk profile (more people, more activity, different use patterns). Standard home policies may not be designed for this use.

What you need: A home policy that specifically covers your home as a residential rental property with a secondary suite. Most major BC insurers have endorsements or products for this. The premium increase is modest compared to the risk transferred.

Unauthorized suites: Many BC secondary suites are not permitted under municipal bylaws or do not meet Building Code requirements. From an insurance perspective, unauthorized vs authorized matters primarily in terms of building code compliance in rebuild scenarios — a non-compliant suite may not be insurable to its full value.

Tenant's belongings: Your home insurance does not cover your tenant's belongings. Your tenant is responsible for their own tenant insurance. Some landlords contractually require tenant insurance for this reason.

Vacancy: When a secondary suite is vacant between tenants, your vacancy clause considerations apply to that portion of the home. Notify your insurer when the suite becomes vacant.`,
  },
  {
    topic: 'BC Insurance — Identity Theft and Cyber Coverage',
    keywords: ['identity theft', 'cyber', 'fraud', 'digital', 'personal data', 'home', 'endorsement'],
    content: `Identity theft and cyber-related losses are increasingly available as optional endorsements on BC home insurance policies. They address a growing risk that standard home policies do not cover.

What standard home insurance does NOT cover: Financial losses from identity theft. Costs of restoring your credit and identity. Ransomware attacks on personal devices. Online fraud and phishing losses. Unauthorized credit card charges (covered by the card issuer, not home insurance).

Identity theft endorsements: Some BC insurers offer identity theft coverage as an add-on, typically covering: legal costs to dispute fraudulent accounts, lost wages while dealing with identity restoration, postage and phone costs, and sometimes a case manager service to assist with the restoration process. Coverage limits are typically $10,000–$25,000.

What is not typically covered: Direct financial losses (money actually stolen) are generally not covered under home insurance identity theft endorsements. Credit card fraud is handled by your card issuer's zero-liability protections. The endorsement covers the costs of remediation, not the financial theft itself.

Home cyber coverage: Some insurers offer broader "cyber" endorsements covering: ransomware and extortion demands, data restoration costs, cyber bullying/harassment support. These are emerging products with varying terms.

Cost: Identity theft and cyber endorsements are typically $15–$30/year — very low cost for the administrative support they provide during an identity theft incident.

Practical value: The actual financial value is less about direct loss recovery and more about having professional support (case managers, legal assistance) during what is an extremely stressful and time-consuming process. For most people, the modest premium is worthwhile.`,
  },
  {
    topic: 'BC Strata — Bare Land Strata and Unique Coverage Issues',
    keywords: ['bare land', 'strata', 'lot', 'detached', 'townhouse', 'insurance', 'building', 'individual'],
    content: `Bare land strata is a type of strata ownership common in BC townhouse developments where the strata lot includes a parcel of land with a dwelling on it, rather than a defined airspace (as in a high-rise condo).

How bare land strata works: In a bare land strata, unit owners own the land and the dwelling on it. The strata corporation owns common areas (roads, parks, shared amenities). This differs from a conventional strata where the strata corporation owns the building shell and common areas, and unit owners own airspace within the building.

Insurance implications: Because bare land strata unit owners own the dwelling itself, the insurance responsibilities differ from conventional strata. The strata master policy typically covers only common property (roads, amenities) — not the individual dwellings. Each unit owner must insure their own dwelling with a full home insurance policy.

What bare land strata owners need: A conventional home insurance policy (not a strata unit policy) covering: the dwelling on replacement cost basis, contents, personal liability, and all standard home endorsements (earthquake, sewer backup, etc.).

Common misconception: Many bare land strata owners incorrectly assume the strata master policy covers their dwelling. This leaves them with no dwelling coverage — a catastrophic gap. Always obtain the strata insurance certificate and confirm exactly what is covered before assuming your home is insured.

Strata fees and insurance: Bare land strata fees typically cover maintenance of common areas and the master policy for those areas. They do not fund your personal dwelling coverage. Budget for your own home insurance policy separately.

Due diligence for buyers: Before purchasing a bare land strata unit, obtain the strata's insurance certificate and confirm what is and is not covered. Ask your broker specifically whether you need a home policy or a strata unit policy.`,
  },
]

async function run() {
  console.log('Fetching existing topics…')
  const { data: existing } = await supabase
    .from('insurance_knowledge')
    .select('topic')

  const existingTopics = new Set((existing ?? []).map((r: { topic: string }) => r.topic))

  const toInsert = newChunks.filter(c => !existingTopics.has(c.topic))

  if (toInsert.length === 0) {
    console.log('All chunks already exist. Nothing to insert.')
    return
  }

  console.log(`Inserting ${toInsert.length} new knowledge chunks…`)
  const { error } = await supabase.from('insurance_knowledge').insert(toInsert)

  if (error) {
    console.error('Error inserting chunks:', error)
    process.exit(1)
  }

  console.log(`✓ Added ${toInsert.length} new BC insurance knowledge chunks.`)
  toInsert.forEach(c => console.log(`  · ${c.topic}`))
}

run()
