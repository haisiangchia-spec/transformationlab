# Architecture and decisions — milestones 1–3

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
- `src/engine/index.ts`: public exports and independent engine library entry.

## React interface (milestone 2)

- `src/ui/App.tsx`: start/game navigation, persisted session, help/menu dialogs,
  year-end event reveals and the full Final Report.
- `Start.tsx`: four accessible profile radios, random profile selection, optional
  reproducible seed, game overview and resume/new-game replacement flow.
- `Gameplay.tsx`: scrollable 24-card catalogue, category/search/availability filters,
  adoption details, undoable plan, review/confirm, live capability previews, six
  engine requirements/rewards and the current opening-frozen event.
- `shared.tsx`: native modal dialogs with focus restoration, decorative symbols,
  artwork viewports, exact catalogue lookups and numeric formatting.
- `session.ts`: versioned profile/seed/action-log saves; validate commands and replay
  through the engine. The UI never supplies its own adoption, engine, cost or score
  formula. Invalid imports and commands are rejected. No raw saved state is trusted.
- `styles.css`: responsive desktop/tablet/mobile layouts and reduced-motion support.
- `src/main.tsx` / `index.html`: actual browser entry. Fontsource packages provide
  Oxanium headings/numerals and Inter body text without third-party font requests.

Plan previews call `previewPlan`; header resources show the remainder after the
current plan and recover when selections are removed. Engine-owned resources stay
uncommitted until the review dialog is accepted. Acceptance appends `confirmPlan` and `endRound` together,
replays and saves atomically, then reveals the completed-year result and next event.
UI previews show capability values before year-end rewards and never award them.
The 2–4 planning slots are derived from the engine's action limit. Seed generation
uses browser cryptographic randomness only at game creation; subsequent randomness
remains explicit engine PRNG state. Catalogue category, availability and search state stay mounted across rounds;
round transitions clear the confirmed plan without resetting these controls.
Unconfirmed plans are local UI state and clear
on leaving gameplay/reloading. Confirmed years persist through browser localStorage.

Campus/profile art is shown through isolated SVG viewports into the supplied
reference; no screenshot UI text or numbers are used. Card illustrations use
category symbols. All displayed game content and values come from engine data.
Independent agency/trust gauges are not fabricated: only approved engine gains
are labelled and shown. S/M/A is raw, with no percentage denominator or visual cap.

`vite.config.ts` builds the website with relative asset paths; `vite.engine.config.ts`
retains the standalone engine build. Pages deployment is not configured here.

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

## Report and classification (milestone 3)

The user approved an explainable deterministic heuristic with no match percentage,
raw uncapped charts, labelled annual/cumulative scores, engine-only agency/trust
and both print/PDF and JSON export. These are report conventions, not changes to
locked game mechanics.

- `src/engine/classification.ts`: pure report-only `evidence-v1` rubric. See
  [exact measurements, weights and ties](CLASSIFICATION.md). Canonical Random is
  player-facing Exploratory Investor. No-purchase games declare insufficient evidence.
- `src/report/model.ts`: replay the validated session and read completed history.
  The final snapshot preserves Year-5 penalties and pre-reward engine eligibility;
  it does not recompute a clean final year or award gains again. Factual reflection
  inputs use the best annual score, first rewarding engine, lowest final capability
  and an inactive engine's requirements. Ties use earliest year, S/M/A dimension
  order and engine catalogue order respectively. These are prompt selection rules,
  not scoring or achievement thresholds.
- `src/ui/FinalReport.tsx`: uncapped total, interactive five-year chart, explicit
  annual/cumulative timeline, per-year purchase/event/resource details, final
  capabilities and inventory, all six engine histories, transparent playstyle
  evidence and contextual reflection questions. Play Again preserves the old report
  until a replacement game is confirmed.
- `CapabilityChart.tsx`: responsive SVG with raw dynamic axes, series toggles,
  keyboard-operable year buttons, accessible SVG description and an always-present
  full data table. No chart library or external service is required.
- `src/report/export.ts`: versioned deterministic JSON with full-precision report,
  rubric provenance and replayable session, plus browser Blob download. Print uses
  the browser's native print/Save as PDF and dedicated light print CSS, expanding
  engine/rubric/inventory details. Cancelling print does not change the game.

No save migration is needed: existing milestone-2 command logs replay into the new
report. Export does not grant arbitrary imported state access; no report-import UI
was added. Independent agency/trust scales and verbal score-category thresholds
remain unresolved and intentionally absent. Raw charts and clearly labelled
annual/cumulative figures are the user's approved presentation defaults.

The event/edited-plan concern is resolved at the engine boundary: events apply only
on opening a year, before a plan can be previewed; a preview is not stored as game
state. There is no mid-year event application. Presentation can be decided later.

No new bonuses, rewards, timers, currencies, prerequisites, caps, random markets,
Trusted AI general mitigation or Networked Learning extra event choice were added.
