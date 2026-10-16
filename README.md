# School Transformation Lab

A single-player HTML5 strategy game for Singapore school leaders, built with
React, TypeScript and Vite.

**Milestone 3:** playable Start, Gameplay and Final Report screens, powered by the validated
five-year engine. Choose one of four school profiles or randomise, plan investments,
connect adoption supporters, activate compounding Synergy Engines and respond to
four unique events. Confirmed years are saved in your browser.

The dark blue/cyan interface follows the supplied visual references, with Oxanium
headings and Inter body text installed through Fontsource. Campus/profile imagery
uses isolated artwork regions of the approved start reference; text, cards, values
and controls are real HTML. Card illustrations are decorative category symbols.

## Develop and validate

Requires Node.js 22.12+ (validated with 24.19.0) and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

`npm run build` checks TypeScript and builds the playable site into `dist/`.
`npm run preview` serves that production build. Vite uses relative asset paths so
it can be served beneath a GitHub Pages repository path. GitHub Pages publication
has not been configured or performed by this milestone.

For browser tests:

```sh
npx playwright install chromium
npm run test:e2e
```

If Chromium is already installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to its
executable path instead. The browser suite starts its own development server and
covers desktop, tablet and mobile viewports.

`npm run build:engine` retains the standalone ES module library build in
`dist-engine/`; engine code has no React or browser dependencies.

## Playing

1. Select a school profile, then **New Game**, or randomise the profile first.
   An optional seed makes the profile/event sequence reproducible.
2. Browse all 24 enablers; filter by category, ownership or affordability, or search.
   Select a card's title for full adoption and engine details.
3. Add/remove enablers to build a plan. The School Status panel previews raw
   capabilities before year-end rewards; header resources remain unspent.
4. **Confirm Investments** opens a review. Keep planning or confirm to purchase
   atomically and end the year. An empty plan can also end the year.
5. Review the scored year and next event, then begin the next year. After Year 5,
   explore the Final Report with the uncapped score, raw capability chart,
   five-year timeline, engine history, playstyle evidence and reflection prompts.

Only confirmed years are saved. Reloading or returning to the start screen clears
an unconfirmed plan. Resume returns to the saved year's opening. Starting a new
game asks before replacing the saved journey. No login or backend is required.
If browser storage fails, the game remains playable in the current page and shows
a notice. Saved data is a versioned command log replayed through the engine; invalid
saves are rejected rather than treated as trusted game state.

## Final Report and export

Use the year buttons or timeline to inspect each year's purchases, active event,
engine rewards, annual score and cumulative score. Chart series can be toggled;
the accessible table always retains all three raw capability values for all five
years. The axis scales dynamically without a 100-point ceiling. Final results
retain Year-5 penalties and do not award engine gains again.

Playstyle uses the user-approved [evidence-v1 rubric](docs/CLASSIFICATION.md): seven
canonical styles, documented weighted indices, measured evidence and deterministic
ties. It is an explainable heuristic, not a calibrated probability. No-purchase
games show an explicit insufficient-evidence fallback. It never changes gameplay.

**Export Report** offers **Print / Save as PDF** through the browser's print dialog
and **Download JSON**. Print styling includes the chart, data table, full engine
details and final inventory. JSON preserves full numerical precision, the rubric
version/features/indices, all year snapshots and the replayable seed/action log.
No wall-clock timestamps or personal data are required. “Play Again” returns to
profile selection and keeps the current saved report until a new game is confirmed.

## Scope and next milestone

Milestone 4 remains broader browser, accessibility and regression QA. Student
Agency and Stakeholder Trust are explicitly labelled cumulative engine gains;
independent full gauge scales remain undefined. No verbal score bands, win/loss
thresholds, normalised chart values or confidence percentages are invented.
GitHub Pages deployment remains separate and has not been enabled or published.

See [architecture and rule decisions](docs/ARCHITECTURE.md),
[authoritative specification](docs/handoff/GAME_DESIGN.md), and
[validation notes](docs/VALIDATION.md).
