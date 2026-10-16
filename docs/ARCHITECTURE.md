# Milestone 1 architecture and decisions

## Boundaries

- `src/data/`: verbatim typed catalogue from the supplied JSON: 24 enablers,
  24 events (including scenario text), six engines and four profiles.
- `src/engine/types.ts`: domain IDs, capabilities, event modifiers, progress,
  serialisable game state, actions and round-report snapshots.
- `adoption.ts`: nonrecursive owned supporter counting and percentage-point caps.
- `events.ts`: all 24 event effects resolved once against opening ownership.
- `investment.ts`: price quotes and atomic preview/confirmation; no purchase prerequisites.
- `synergies.ts`: eligibility and persistent year-end rewards, canonical card-ID ties.
- `scoring.ts`: effective raw S/M/A and exact uncapped annual formula.
- `random.ts`: explicit uint32 Mulberry32 state; seeded profile/event selection.
- `rounds.ts`: five-year transition boundary and report history. No React, DOM,
  network, timers, ambient randomness or storage dependencies.
- `src/engine/index.ts`: public exports; Vite library entry for this milestone.

React and TypeScript dependencies are prepared. Visual components, font loading,
responsive layout, browser persistence and deployment are intentionally deferred.
The later UI must use Oxanium headings/numerals and Inter body text, with the three
supplied images as visual references only. Raw engine values drive all future charts.

## Annual lifecycle

1. Freeze event conditionals and penalty targets using opening ownership.
2. Evaluate School Innovation under that year's penalties and persistent boosts;
   initialise fresh budget and action limits. No leftover budget carries over.
3. Preview/discard/confirm investments; adoption can be queried from each preview.
4. On `endRound`, sample eligible engines once using current penalties. Apply that
   active set's permanent rewards and Collective Teacher boost once.
5. Recalculate adoption and capabilities after rewards, then score using the
   pre-reward active set and cumulative engine agency/trust. Event outcome adjustments
   stay temporary. There is no extra same-year reward cascade.
6. Snapshot scoring values, purchased/owned cards, active rewarding engines,
   event effects, boosts, permanent gains, agency/trust pools and resource accounting.
7. Draw from the remaining deck after Years 1–4; open the next year. Year 5 remains
   scored under its event penalties and ends with no draw. No artificial clean-year
   recalculation is substituted for the fifth-year report.

History's `activeEngines` means the engines eligible for that year's rewards;
`adoption` contains post-reward scoring adoption. A new engine enabled by the
Collective Teacher boost can therefore appear eligible on a fresh query without
being in that year's rewarding set. This follows the supplied simulator timing.

## Confirmed rule conflict resolution

The simulator stores shocks for all targeted IDs, causing later purchases in that
year to receive them. The written design says shocks affect only owned relevant
cards and that event modifiers are evaluated at the start of the year. **The user
explicitly confirmed the written rule:** only opening-owned cards are shocked.
Purchasing a mitigator later does not erase an opening shock; purchasing a new
shock-target card later does not incur that shock. All other opening conditionals
stay frozen, including action bonuses and learning/agency adjustments.

Collective Teacher adoption ties use ascending canonical card ID, as explicitly
permitted by the specification. Eligibility is not re-evaluated for a second
reward pass. School Innovation pays only at the next opening evaluation; it never
credits same-year cash or a nonexistent Year 6.

## Unresolved design choices, intentionally not implemented

These do not block the locked engine milestone:

- Independent Student Agency / Stakeholder Trust gauge baselines and scales.
  State exposes only the approved cumulative engine gains and temporary event deltas.
- Explainable classification algorithm, ties and confidence semantics. Seven labels
  are documented in the handoff, but no classifier or invented match percentage exists.
- Score-category verbal thresholds or absolute win/loss criteria.
- Raw versus visually normalised S/M/A presentation; scoring remains raw and uncapped.
- Export format (PDF, print or another format).
- Annual versus cumulative score in round highlight chips; history retains both.

The event/edited-plan concern is resolved at the engine boundary: events apply only
on opening a year, before a plan can be previewed; a preview is not stored as game
state. There is no mid-year event application. Presentation can be decided later.

No new bonuses, rewards, timers, currencies, prerequisites, caps, random markets,
Trusted AI general mitigation or Networked Learning extra event choice were added.
