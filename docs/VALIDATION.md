# Validation — milestones 1–3

Run `npm ci`, `npm test`, and `npm run build` from the repository root.
The default build includes strict TypeScript checking and produces the playable
React site. `npm run build:engine` produces the separate ES module library.

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

## Milestone 2 browser and save validation

`tests/session.test.ts` checks versioned command-log roundtrips, five-year replay,
malformed saves, invalid IDs/actions and atomic failure without mutation.

`tests/browser/game.spec.ts` runs in Chromium at desktop (1600×1000), tablet
(834×1112, touch) and mobile (390×844, touch) sizes. It covers profile selection,
help/escape/focus restoration, local fonts, horizontal layout bounds, category
filters and locked S3 details, reversible plans, live header resource previews with no engine commitment until
confirmation, cancelled review, committed actions and next-year engine resources,
full five-year journeys with purchases and engine-matching final scores, unique
four-event handling, dynamic fourth action slot, keyboard confirmation, reload/
resume and corrupt-save recovery. Tests use real browser localStorage and the same
engine as the app. Responsive screenshots were also inspected manually.

Run `npm run test:e2e` after `npx playwright install chromium`, or supply the
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` environment variable for an existing Chromium.
The suite starts a Vite development server on port 4173. The current cloud machine
uses `/usr/bin/chromium`. Browser binaries and runtime processes are not committed.

No cross-browser Safari/Firefox validation or GitHub Pages deployment is claimed.
Milestone-3 report/classifier/export coverage is listed below.

Milestone 2 results: 161 unit/reference tests and 21 Chromium browser tests passed.
Both website and standalone engine builds passed. A production-build smoke test
under `/transformationlab/` verified relative assets, local fonts, investment
confirmation, year-end scoring and the next-year event without request or runtime
errors. This local subdirectory test is not a published GitHub Pages deployment.

## Milestone 3 validation

`tests/classification.test.ts` checks the seven canonical labels, actual category
spending, engine-essential purchases, event-aligned purchases and category shifts,
no-purchase evidence handling, starting-card exclusion, within-year purchase-order
invariance, finite bounded indices, deterministic ties and absence of confidence.
Controlled snapshot fixtures isolate engine-essential evidence; they are not new
starting profiles or modifications to game rules.

`tests/report.test.ts` checks completed-only reports, exact year snapshots, final
rewarding engines, persistent gains, actual spending, annual/cumulative totals,
full-precision deterministic export and replayable commands. A real seeded game
with an actual Year-5 I2 shock verifies that final adoption penalties are retained.
Raw chart domain cases include maxima above 100 and all-zero data.

`tests/browser/report.spec.ts` exercises the report at the same desktop/tablet/mobile
sizes as gameplay: chart/timeline keyboard selection, data table, evidence rubric,
JSON download contents and filename, print invocation after dialog dismissal,
expanded print engine/inventory content and actual PDF generation. It also verifies
replay/menu preserve a finished journey until replacement is confirmed. Existing
five-year gameplay tests now finish on the full report and compare the displayed
score to engine replay.

The PDF test generates a real Chromium PDF; selecting a save destination in an
interactive browser's native print dialog remains the user's action. No server,
PDF upload, external reporting service or calibrated playstyle confidence is used.

Milestone 3 results: 192 unit/reference/report tests and 33 Chromium browser checks
passed across desktop, tablet and mobile. Type checking, website build and engine
library build passed. A production report was exercised under `/transformationlab/`
with no failed requests or runtime errors; desktop/tablet screenshots and a rendered
A4 PDF were inspected. PDF text includes the rubric version, all engine descriptions
and final inventory. No actual Pages publication is implied by this local test.

UI refinements: browser checks cover header deductions/restoration, uncommitted
saves during planning, category/availability/search persistence between years,
and random profile selection above the cards instead of in the hero actions.
Current refinement validation: all 192 unit/reference tests and 39 Chromium
browser checks passed. The production build also passed.
