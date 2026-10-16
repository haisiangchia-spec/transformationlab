# Engine validation

Run `npm ci`, `npm test`, and `npm run build` from the repository root.
The build includes strict TypeScript checking and produces an ES module library,
not a playable UI.

- `data.test.ts`: all supplied fields preserved, unique IDs/references, exact costs,
  S/M/A and supporters crosschecked with the supplied simulator.
- `events.test.ts`: every event's discounts and opening conditionals; unmitigated,
  partially mitigated and fully mitigated shocks, including E09/E12 AND conditions,
  opening-owned targets, revised budget deltas and temporary outcome adjustments.
- `engine.test.ts`: adoption pp/caps/loops, all profiles, atomic/discardable plans,
  invalid purchases, four actions, discounts/no refunds, six engines' thresholds,
  recurring gains, dormancy, boost caps/ties and non-cascading rewards, School
  Innovation timing, score formula, historical snapshots, four unique draws,
  Year-5 handling, seeded replays and JSON save/resume.
- `reference.test.ts`: 40 independently computed five-year scenarios (all four
  profiles, 10 purchase-policy seeds each), comparing each year's adoption, active
  engines, S/M/A, annual/cumulative score, budget and action limit. These scenarios
  include active rewards for every engine. Event-branch unit tests cover all 24
  events; the reference scenarios alone encounter 23.

`tests/generate_reference.py` extracts only the original simulator's data and pure
functions using Python's standard library (no NumPy needed). It computes golden
fixtures separately from the TypeScript engine. Two documented corrections apply:
opening-owned shock targets (user-confirmed) and canonical Collective Teacher ties
(spec-permitted). Its purchase policy is a test fixture generator, not a game rule
or playstyle classifier. Regenerate with `python tests/generate_reference.py`.

The reference tests inject their event schedule by constraining the remaining
deck. They compare game rules, not Python and JavaScript PRNG algorithms. Separate
engine tests verify seeded event selection, no replacement, random profiles and
replay. Seeds reproduce this engine's runs, not the original simulator's heuristic
policies or reported 5,000-game balance aggregate.

No browser/UI tests have run: no visual implementation exists at this milestone.
The mandatory future UI/classifier/chart checks in the handoff remain deferred.
