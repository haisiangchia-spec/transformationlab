# SCHOOL TRANSFORMATION LAB — AUTHORITATIVE GAME DESIGN SPECIFICATION

**Version:** 1.0 locked baseline · **Date:** 14 October 2026 · **Audience:** Codex implementation team · **Status:** Rules and content locked except items expressly marked “implementation clarification / unresolved.”

> **Source-of-truth priority:** (1) this document’s explicitly locked rules and tables; (2) last tested Python simulator where this document says “tested implementation”; (3) approved UI images for visual design only. Screenshots contain illustrative numbers, inaccurate codes, and sometimes invented card relationships: do not use them as mechanics. If this document explicitly identifies a discrepancy, preserve the rule written here and add a test. Do not silently invent rules.

## 1. Purpose, audience and educational premise

A single-player HTML5 strategy/card-tableau simulation for Singapore school leaders. In five school years, invest in complementary human, pedagogical, technological, leadership and governance enablers. Learning objective: owning technology is not sufficient; adoption, integration and self-reinforcing *human–AI* intelligence (Sensing, Modelling, Acting) are what improve outcomes. Responses to uncertain events reveal resilience and opportunity costs. Inspired by Singapore EdTech Masterplan 2030, SLS, national AI literacy, GovTech responsible-AI work and HQ-school research; the specific in-game initiatives, prices, and effects are fictional, not official MOE claims.

## 2. Locked high-level rules

| Rule | Locked value |
| --- | --- |
| Player count | 1 (school leader) |
| Duration | 5 rounds, each representing one school year |
| Base annual budget | 8 units, fresh each year |
| Base investment actions | 3 per year; event-adjusted range 2–4 |
| Starting profile | Player selects one of four, OR randomises uniformly |
| Starting enablers | Exactly two owned per chosen profile; no purchase charge |
| Card catalogue | All 24 visible/available all years (affordability still applies); no random market |
| Purchasing | Each enabler purchased at most once; each purchase costs 1 investment action and adjusted budget |
| Round investments UI | Up to 3 standard slots; event-granted fourth action must be supported dynamically |
| Event deck | 24 cards E01–E24; one event drawn after rounds 1–4, affecting next year; no event drawn after round 5 |
| Events repeat | No repeat within one playthrough |
| Featured opportunity mechanic | Removed; special offers originate only from events |
| Adoption | 40% base +20 percentage points per owned supporter, ± persistent bonuses / event penalties, clamped 10–100% |
| Synergy Engines | 6, only one unified combination tier; no separate ordinary-synergy layer |
| Engine activation | Each of its three required cards is owned and has adoption at least 70% |
| Transformation Score | Five-year cumulative uncapped formula defined in §7 |
| Winning / replay | Final report and replay; no absolute win/loss threshold yet locked |


**Budget interpretation used by the tested simulator:** each year starts with 8 plus that year’s event delta plus School Innovation’s qualifying +2; leftover budget does **not** roll forward. Annual budget is floored at 0. Each year’s action limit is `clamp(3 + eventActionDelta, 2, 4)`. Minimum adjusted purchase cost is 1. Event discounts do not refund owned cards. These are tested conventions and should be retained in v1.0.

## 3. Starting school profiles — locked

| Starting profile | Starting cards | Identity / intended weakness |
| --- | --- | --- |
| Technology-Ready School | I1 + I2 | Strong devices and platform adoption opportunity; teaching integration not yet mature. |
| Collaborative Teaching School | T1 + T4 | Professional development and PLCs; needs deeper technical and implementation infrastructure. |
| Student-Centred School | S1 + S2 | Digital and AI literacy foundations; must extend into self-directed learning and supported AI use. |
| Strategically Led School | L1 + L4 | Shared vision and implementation capacity; needs front-line pedagogy/innovation. |


No custom budget, adoption or action bonuses for starting profiles. Each starts with the same 8-unit budget. In the baseline simulation no distinction was applied to whether a card was starting-owned or bought later.

## 4. The 24 locked enabler cards

Each card has one ID, fixed printed price, printed Sensing/Modelling/Acting contributions and exactly three adoption supporters. “Supporters” are boosts, not purchasing prerequisites; they can be owned in any order and may support each other without recursive computation. Cost reductions T3/S4/P4/L4 from 4 to 3 were approved. Final S3 and I4 supporter substitutions are incorporated below.

### Teacher Professional Capacity

| ID | Enabler | Cost | S/M/A | Adoption supporters (+20 pp each) |
| --- | --- | --- | --- | --- |
| T1 | Foundational EdTech & AI Professional Development | 2 | 0/2/1 | L1, L2, L4 |
| T2 | Data & Assessment Literacy | 3 | 1/3/0 | T1, P3, I3 |
| T3 | AI-Enhanced Lesson Design Expertise | 3 | 0/3/2 | T1, T4, P1 |
| T4 | Professional Learning Communities (PLCs) | 3 | 1/2/2 | L2, L3, I2 |


### Student Digital & AI Agency

| ID | Enabler | Cost | S/M/A | Adoption supporters (+20 pp each) |
| --- | --- | --- | --- | --- |
| S1 | Digital Literacy Foundations (Find, Think, Apply, Create) | 2 | 1/1/1 | I1, T1, G2 |
| S2 | AI Literacy & Critical Evaluation | 3 | 1/2/1 | S1, T1, G1 |
| S3 | Self-Directed Learning & Metacognition | 3 | 1/2/2 | S1, P3, S2 |
| S4 | AI-Assisted Creation & Collaboration | 3 | 0/2/3 | S2, P4, I1 |


### Pedagogy & Assessment

| ID | Enabler | Cost | S/M/A | Adoption supporters (+20 pp each) |
| --- | --- | --- | --- | --- |
| P1 | Active & Collaborative e-Pedagogy | 2 | 0/1/2 | T1, T4, I2 |
| P2 | Differentiated & Personalised Learning | 4 | 1/2/3 | T2, I3, T3 |
| P3 | Technology-Enhanced Formative Assessment | 3 | 2/1/2 | T2, I2, T4 |
| P4 | Authentic Learning & 21CC Development | 3 | 1/2/3 | P1, S4, G4 |


### Technology & Data Infrastructure

| ID | Enabler | Cost | S/M/A | Adoption supporters (+20 pp each) |
| --- | --- | --- | --- | --- |
| I1 | Connected Devices & Learning Spaces | 3 | 1/0/2 | L1, L4, G2 |
| I2 | Integrated Digital Learning Platform (SLS-centred) | 3 | 2/0/1 | T1, P1, L4 |
| I3 | Learning Analytics & Student Insights | 4 | 3/2/0 | T2, P3, G1 |
| I4 | AI-Powered Learning & Feedback Tools | 5 | 1/3/3 | T3, S3, S2 |


### School Leadership & Culture

| ID | Enabler | Cost | S/M/A | Adoption supporters (+20 pp each) |
| --- | --- | --- | --- | --- |
| L1 | Shared EdTech Vision & Strategic Roadmap | 2 | 1/2/1 | G3, L2, G4 |
| L2 | Distributed Leadership & Teacher Champions | 3 | 1/2/2 | L1, T4, L4 |
| L3 | Innovation & Experimentation Culture | 3 | 2/2/1 | L2, T4, G4 |
| L4 | Implementation Capacity & Change Management | 3 | 1/1/3 | L1, L2, G3 |


### Trust, Governance & Partnerships

| ID | Enabler | Cost | S/M/A | Adoption supporters (+20 pp each) |
| --- | --- | --- | --- | --- |
| G1 | AI Ethics, Privacy & Data Governance | 3 | 2/2/0 | L1, T1, G4 |
| G2 | Cyber Wellness & Digital Inclusion | 3 | 1/1/2 | G1, S1, G3 |
| G3 | Parent & Community Engagement | 2 | 2/0/1 | L1, G2, L2 |
| G4 | External Partnerships & Innovation Networks | 3 | 1/2/2 | L1, L3, G1 |


### Adoption calculation (locked)

For each owned card `i`: `Adoption_i = clamp(40 + 20 * count(owned supporter IDs in SUPPORT_i) + persistentBoost_i − eventPenalty_i, 10, 100)`. Effective card capability is `printedCapability × (Adoption_i / 100)`. Cards not owned contribute nothing. Event penalties are in **percentage points** (pp), not relative percent. Support pairs and loops count once each, with no infinite propagation. Recalculate ownership/adoption after each successful purchase and before evaluating engines.

## 5. The six unified Synergy Engines — locked v1.0 rewards

| Engine | Required cards, all ≥70% adoption | Tested compounding effect |
| --- | --- | --- |
| Adaptive Teaching Intelligence | T2, P3, I3 | +1 permanent Modelling per active year; +2 annual Transformation Score while active. |
| Self-Directed AI Learners | S2, S3, I4 | +1 permanent Acting and +2 cumulative Student Agency per active year. |
| Collective Teacher Intelligence | T3, T4, L2 | +1 permanent Modelling; +10 pp persistent adoption boost to the lowest-adoption owned Teacher or Pedagogy card per active year (individual boost capped at +60 pp). |
| School Innovation Engine | L1, L3, L4 | +2 budget at start of the following year while engine is active at that year’s opening evaluation. |
| Trusted AI Ecosystem | G1, G2, G3 | +2 cumulative Stakeholder Trust per active year; NO additional general 50% AI-risk mitigation in v1.0. |
| Networked Learning Ecosystem | G4, P4, S4 | +1 permanent Sensing per active year; NO additional event choice in v1.0. |


**Engine timing:** determine active engines after purchases using current-year event penalties; apply active-year rewards at year end; score the year **after** accumulated permanent gains are applied. Permanent S/M/A gains and persistent adoption support remain if an engine later goes dormant; the dormant engine earns no new reward that year. For Collective Teacher, choose the owned T or P card with the lowest current adoption (ties may be broken deterministically by canonical card ID to avoid nondeterminism); add 10 pp to that card’s persistent bonus, capped at +60 pp per destination card; total adoption stays capped at 100%.

**School Innovation exception, tested:** qualifying +2 budget is evaluated at **the start of next year**, based on whether the engine is active then under next year’s current-event adoption penalties. An engine activated during the final round cannot provide future budget. Do not add a separate +2 at the end of the same year.

**Deliberately excluded from v1.0 (not used in last 5,000-game test):** additional 50% AI-risk reduction for Trusted AI Ecosystem; additional opportunity-event choice for Networked Learning; ordinary synergy tier; standalone final “Human–AI Learning Organisation” unlock.

## 6. Random events — 24 locked scenarios and effects

Events E01–E24 are fictional school-facing scenarios inspired by Singapore policy and research context. Card names E01/E12/E17/E21 incorporate final wording revisions. Numeric changes E05/E06/E18/E23 were accepted in the shorter-game balance revision. One event is drawn after rounds 1, 2, 3, and 4; it applies **to the following year** only, and then expires. No duplicates. Event modifiers are evaluated against cards owned at the **start** of the affected year (as in the tested code). Event effects may change purchase prices, budget, action count, card adoption and annual learning/agency outcomes.

### E01 — MOE Expands AI-Enabled Tools (Opportunity)
New centrally provided AI education features, including tools in SLS, reduce implementation costs.

**Next-year game effect:** I4, I3, P3: −2 each; if I2 owned, +1 investment action.


### E02 — National Teacher AI Upskilling Initiative (Opportunity)
Hypothetical national training and implementation support.

**Next-year game effect:** T1, T2, T3: −2 each; if L2 owned, +1 investment action.


### E03 — Updated AI Literacy Curriculum (Mixed)
MOE strengthens student AI literacy and responsible AI expectations.

**Next-year game effect:** S1, S2, G2: −1 each; if S2 absent, Student Agency event adjustment −2.


### E04 — New Responsible AI Guidelines (Mixed)
New governance expectations increase the importance of safe adoption.

**Next-year game effect:** G1: −2; if G1 absent, I3 and I4 adoption −20 pp.


### E05 — National Digital Learning Infrastructure Refresh (Opportunity)
Hypothetical device/connectivity refresh.

**Next-year game effect:** I1, I2: −2 each; next-year budget +1 (rebalanced from +2).


### E06 — MOE Requests an EdTech Implementation Review (Mixed)
School must document implementation progress and learning outcomes.

**Next-year game effect:** −1 action; if BOTH L1 and I3 owned, restore 1 action and add +1 budget (rebalanced from +2).


### E07 — MOE Inclusion and Well-Being Priority (Mixed)
Heightened emphasis on inclusion, well-being and digital development.

**Next-year game effect:** G2, S3, P2: −1 each; if G2 absent, S1–S4 adoption −10 pp.


### E08 — GovTech Secure AI Services Expansion (Opportunity)
Hypothetical school-relevant expansion of secure government AI services; not a claim of current school availability.

**Next-year game effect:** I4, G1: −2 each; if G1 owned, +1 action.


### E09 — Breakthrough in Agentic AI (Mixed)
Rapid improvement in multi-step AI agents creates both possibilities and oversight challenges.

**Next-year game effect:** I4, S4: −2 each; if EITHER G1 or T3 absent, I4 adoption −20 pp.


### E10 — AI Computing Costs Collapse (Opportunity)
Cheaper computing and accessible models reduce implementation costs.

**Next-year game effect:** I3, I4, S4: −2 each.


### E11 — Major Technology Platform Overhaul (Risk)
Major system upgrade causes retraining and workflow disruption.

**Next-year game effect:** I2, I3, I4 adoption −20 pp; −10 pp instead if L4 owned.


### E12 — AI Dangers Controversy (Risk)
Public concern over inaccurate outputs and relational/affective risks of relational AI, including emotional dependency, attachment, manipulation and displacement of human relationships.

**Next-year game effect:** I4, S4 adoption −30 pp; −10 pp instead if BOTH G1 and S2 owned.


### E13 — Breakthrough in Learning Analytics (Opportunity)
New analytical capabilities improve diagnosis of learning needs.

**Next-year game effect:** I3, T2: −2 each; if BOTH I3 and T2 owned, +2 event Learning Impact.


### E14 — Major Cybersecurity Vulnerability (Risk)
A vulnerability affects digital education services.

**Next-year game effect:** I2, I3, I4 adoption −20 pp; −10 pp if G1; 0 pp if BOTH G1 and L4.


### E15 — Teacher Workload Crisis (Risk)
Heavy workloads constrain teacher capacity to implement change.

**Next-year game effect:** −1 action unless L4 owned; T3, P2, P3 adoption −20 pp regardless.


### E16 — Parent Backlash Against AI (Risk)
Parents worry about AI replacing thinking and meaningful human interaction.

**Next-year game effect:** S4, I4 adoption −20 pp; −10 pp if G3; 0 pp if BOTH G3 and G1.


### E17 — Change of School Leadership & Departure of Teacher Champions (Risk)
Leadership turnover and movement of influential teachers disrupt momentum, direction and shared practice.

**Next-year game effect:** T4, L2 adoption −20 pp; −10 pp instead if BOTH T4 and L2 owned.


### E18 — Tightening School Budget (Risk)
Competing priorities constrain discretionary EdTech funding.

**Next-year game effect:** Budget −2; budget −1 instead if L1 owned (rebalanced from −3).


### E19 — Digital Learning Service Disruption (Risk)
A prolonged service disruption exposes dependencies.

**Next-year game effect:** I2, I4 adoption −30 pp; −10 pp instead if BOTH L4 and P1 owned.


### E20 — Widening Student Digital Divide (Mixed)
Evidence reveals unequal student access and digital confidence.

**Next-year game effect:** If G2 absent, Student Agency event adjustment −3; I1 and G2: −2 each.


### E21 — HQ-School Research Collaboration (Opportunity)
MOE Headquarters–school research collaboration may include Rapid Research, design-based research, implementation studies or longer-term work.

**Next-year game effect:** T2, P3, L3: −1 each; if L3 owned, +1 action; if BOTH T2 and P3 owned, +2 event Learning Impact.


### E22 — Cluster-Wide Professional Learning Network (Opportunity)
Neighbouring schools organise exchanges and implementation workshops.

**Next-year game effect:** T4, L2: −2 each; if G4 owned, +1 action.


### E23 — University–School AI Research Partnership (Opportunity)
Local research collaboration supports evaluation of AI pedagogy.

**Next-year game effect:** G4, P4, I3: −1 each; if BOTH G4 and L3 owned, +2 budget (rebalanced from +3).


### E24 — School Innovation Challenge (Opportunity)
An innovation challenge encourages piloting and evaluation of new learning approaches.

**Next-year game effect:** L3, S4, P4: −2 each; if L3 owned, +1 action.


**Global event implementation rules:** Max 4 / min 2 actions. Discounts never take an enabler below cost 1 and provide no refund. Adoption shocks affect only owned relevant cards and are removed next year. Conditionals check start-of-year owned cards. Temporary agency/trust adjustments affect the event year, not permanent agency/trust pools. E13 and E21 learning-impact bonuses enter the annual score at half-weight (see §7). E03/E20 agency adjustments enter at 0.25 weight (see §7). No event currently supplies a direct trust score adjustment in the tested code.

## 7. Locked Transformation Score — exact last-simulation formula

### Card capabilities and engine persistence

`C_d,t = Σ_{i owned at scoring time} [ printedCapability(i,d) × Adoption_i,t / 100 ] + PermanentEngineBonus_d,t`, where `d` is Sensing, Modelling or Acting. PermanentEngineBonus includes gains applied at end of the active year **before** that year’s scoring. Computed capability values are **not** inherently capped at 100.

### Integrated human–AI capability

`H_t = min(S_t, M_t, A_t) + (S_t + M_t + A_t)/6`

### Annual score

`R_t = H_t + 0.5 * LearningImpactEvent_t + 2 * 1[AdaptiveTeachingActive_t] + 0.25 * (CumulativeAgencyEngineGains_t + AgencyEventAdjustment_t) + 0.12 * (CumulativeTrustEngineGains_t + TrustEventAdjustment_t)`

### Final Transformation Score

`FinalScore = R_1 + R_2 + R_3 + R_4 + R_5`. **Uncapped**; do not label as “out of 100.” The last simulator’s `direct_imp` accumulator is nonauthoritative for scoring; the actual annual formula uses only the **current** event impact `im`, plus the explicit active Adaptive Teaching +2, so do not double-count event impact or Adaptive Teaching.

**Important semantic distinction:** Cumulative Agency/Trust terms in the scoring formula refer to the specific engine-generated accumulations (+2 per active Self-Directed/Trusted AI year), **not** the full 0–100-looking Student Agency and Stakeholder Trust visual gauges in the UI concepts. The gauges currently have no independently approved numerical baseline or conversion formula. Either clearly label them as engine-driven values in the first prototype or request a design decision before building full 0–100 gauges.

**Illustrative example:** If S=10, M=12, A=8, `H=8+(10+12+8)/6=13`. If no event bonus, Adaptive Teaching active, accumulated engine agency +4 and trust +2, `R=13+2+0.25*4+0.12*2=16.24`.

### Data to retain for end report

For each round, store actual S/M/A values after scoring-time engine rewards; annual `R_t`; cumulative score through t; owned and purchased cards; adoption and penalties; active engines; event drawn and its impact; budget and actions spent/remaining. These must drive the graph, timeline and narrative. The report’s example values in the artwork are not real game results.

## 8. Round sequence — implementation contract

1. Player chooses a profile or randomises; receive its 2 starting cards, round 1 budget 8 and 3 actions.
2. At the **start of each year**, apply the previously revealed event (none in Year 1), calculate event deltas, check start-of-year School Innovation eligibility for +2 budget; initialise spending/action limits.
3. Show 24-card catalogue filtered by category, affordability, owned state; player can add cards to investment plan, remove them, review prices and confirm. Purchases occur when plan is confirmed, or one by one if UI transaction logic faithfully reconciles budget and ownership. No duplicates.
4. Recalculate adoption, engine activation and capabilities. Apply active-year compounding engine rewards, then calculate and record annual score `R_t` using the **post-reward** state.
5. At the end of Years 1–4, draw a unique random event from the remaining deck and reveal its next-year effects.
6. Year 5 ends with no event draw; show Final Report and classification.

**Caution:** the latest Python simulator heuristically buys one card at a time and recalc/score after all annual investments. The visual dashboard is a staged “Add to Plan / Confirm Investments” interface. Codex should implement a transactional plan preview; neither a purchase nor an action is consumed until confirmed. If an event grants a fourth action, show a fourth slot dynamically despite the three standard empty slots in the approved mockup. This is an implementation clarification preserving the locked event action cap.

## 9. Seven playstyle classifications — names locked, classification algorithm NOT tested

| Playstyle | Classification evidence to consider |
| --- | --- |
| Random Investor | Diversified/inconsistent choices, few pursued supporters/engines; use “Exploratory Investor” as player-facing wording if preferred but preserve canonical key Random. |
| Technology Enthusiast | High share of budget and actions in I-category, early I3/I4. |
| Teacher-First Leader | High share of teacher investment and teacher-focused engine activation. |
| Student-Centred Leader | High share of S-category cards, earlier student-agency and Self-Directed engine focus. |
| Risk-Averse Leader | High share of G-category and early trust/governance investments; successful mitigation. |
| Synergy Optimiser | High proportion of purchases completing supporter links or engine prerequisites; efficient engine timing. |
| Adaptive Strategist | Investment reallocations after event changes, balanced category commitments and responsive purchases. |


The seven simulation-agent IDs are `Random`, `Technology-first`, `Teacher-first`, `Student-first`, `Governance-first`, `Engine-focused`, `Adaptive`. **Important:** in the tests, these were *purchasing policies*, not a trained classifier. “87% match” on the report mockup is illustrative. Before production, implement an explainable deterministic similarity classifier over historical purchases and event responses, document and unit test scoring/ties/confidence semantics. Do not pretend the screenshot’s 87% is a measured probability.

## 10. UI design — three approved reference screens

| Screen | Locked visual reference | Interaction / content contract |
| --- | --- | --- |
| Start | references/start_screen.png | Tech-blue/cyan futuristic style; heading “School Transformation Lab”; tagline “Helping our Students Flourish in an AI Future”; top label “STUDENTS - TEACHERS - TECHNOLOGY”; choose one of four profiles or randomise; remove top-right building slogans; footer “A Game for School Leaders”. |
| Gameplay | references/gameplay_screen.png | Single header row: round X of 5, budget, remaining investments, hamburger. No second navigation row. Scrollable/filterable card catalogue, card info and adoption support, right-side School Status; exactly 3 empty standard investment planning slots (support 4 if event grants), Confirm Investments; show current event. Subtitle “Invest in People, Practice, Technology and Culture to Transform your School”. |
| Final Report | references/final_report.png | Uncapped total Transformation Score; 5-round line chart of raw S/M/A; strategy classification from seven; active engines; five-round timeline; student agency above stakeholder trust; reflections; Play Again / Export Report / Return to Menu. No embedded slogans in hero art. |


**Typography:** tech-inspired `Oxanium` for headings and prominent numerals, `Inter` for readable paragraph/UI text. Respect licensing and use normal package/webfont installs; do not distribute font files separately. Visual assets can be selectively cropped/recreated from mockups, but interface text, chart data and controls must be real HTML/CSS, accessible and responsive. Do not use screenshot text as a source for card data (e.g. some screenshot labels are garbled and the example active engine requirements are incorrect).

## 11. Engineering and architecture

Recommended React + TypeScript + Vite, pure deterministic TypeScript game logic separate from React UI, JSON/TS data objects for cards/events/engines/profiles, Vitest for rules, Playwright for UI, Recharts for report, localStorage for save/resume. Suggested modules: `src/data/{enablers,profiles,events,engines}.ts`, `src/engine/{adoption,events,investment,synergies,rounds,scoring,classification}.ts`, `src/screens/{Start,Gameplay,FinalReport}.tsx`. Capture an optional seed for reproducible random events. Use a pure state transition `apply(action, state) -> nextState` or equivalent, with no implicit event mutation.

### Codex work order

Milestone 1: transcribe and verify all 24 cards, 24 events, 6 engines, 4 profiles and formulas; unit tests; ensure seeded simulations reproduce code behavior.
Milestone 2: implement real Start and Gameplay interactions against same tested engine.
Milestone 3: report, historical charts, classification and export.
Milestone 4: browser/E2E QA, accessibility, responsive layout, regression simulations.
**Rule:** require review before introducing new bonuses, timers, extra currencies, card prerequisites, reward caps or random marketplace mechanics.

## 12. Mandatory test checklist

- Assert exactly 24 unique enabler IDs, 24 unique event IDs, 6 engines, 4 profiles, and each profile has exactly 2 distinct starting cards.
- Assert S3 supporters **S1, P3, S2** and I4 supporters **T3, S3, S2**.
- Verify all COST and CAP fields match the tables.
- Verify 40% base adoption, each +20 pp supporter, event negative pp, persistent bonus, 10–100 cap, support-loop non-recursion.
- Verify one copy/card, budgets, 2–4 action range, discounts min 1 and no refund.
- Verify correct engine eligibility at ≥70%, deactivation/re-activation under shocks, persistent gains retained.
- Verify +10 pp Collective Teacher assignment, single-card +60 pp bonus cap, 100% adoption cap.
- Verify the School Innovation next-year +2 logic including disruption and last-round no-payoff.
- Verify exactly four non-repeating event draws, after years 1–4 only, affect year after draw.
- Verify event E09 only avoids AI adoption penalty if **both** G1 and T3 owned; E12 only mitigated if **both** G1 and S2 owned.
- Verify E05 +1 budget, E06 +1 conditional budget, E18 −2 (−1 mitigated), E23 +2 conditional budget.
- Verify annual score formula and no accidental double count; cap/effective capabilities and annual totals saved accurately.
- Verify no 100-point cap on total score and dynamic line-chart axis scaling.
- Verify report classifier outputs one of seven labels and does not claim calibrated percentages without validation.
- Verify full 5-round browser game works with mouse and keyboard; planning can be undone prior to confirmation; card catalogue scroll and category filter work.

## 13. Provenance, limits and intentionally unresolved implementation decisions

The last official balance run was **5,000 games, five rounds**, after I4 support changed from P2 to S3. Average final score 82.95; active engines 3.44; owned cards 16.30; first engine about Year 2.79, under heuristic agents. These are **descriptive simulation results**, not expected human outcomes or forced targets. Source provided as `references/simulate_school_5round_I4S3.py` (a Python reference/prototype, not production code). It uses approximations and minor heuristic tie breaks; test and refine, do not copy bugs.

**Not yet formally locked / must be specified before polished production release:** (a) definition/scales for independently displayed full Student Agency and Stakeholder Trust bars; (b) deterministic classification algorithm and whether to display a match percentage; (c) exact score-category verbal thresholds (“strong transformation”, etc.); (d) whether to visually normalise S/M/A to 0–100 or show raw uncapped values (raw values must govern score); (e) export format (PDF/print); (f) event interactions with a plan being edited (apply at year start only); (g) whether annual score or cumulative score appears in the round highlight chips. Avoid inventing game-altering effects for these UI decisions.

## 14. Locked-decision summary / conflict-resolution log

- **5 rounds** supersedes earlier 10- or 6-round plans.
- **Budget 8**, not 10; 3 standard actions (events can cause 2–4).
- All 24 cards always purchasable when affordable; **no featured random card market**.
- **Four locked starting profiles** instead of universal T1+I2.
- **One tier**: 6 Synergy Engines; no separate ordinary synergies / virtuous cycles.
- **No cap on Transformation Score**; “out of 100” removed from final report.
- Final S3 supporters are **S1/P3/S2** and I4 **T3/S3/S2**.
- Costs T3/S4/P4/L4 each **3**; I4 stays **5**.
- Event E01/E12/E17/E21 names and descriptions finalised; event balancing E05/E06/E18/E23 finalised.
- **Exactly six tested recurring/compounding engine effects**, with no extra Trusted AI mitigation or Networked Learning event-choice power.
- Three approved screens: Start, Gameplay and Final Report; art establishes style, not numerical truth.
