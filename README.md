# School Transformation Lab

A single-player HTML5 strategy game for Singapore school leaders, built with
React, TypeScript and Vite.

**Milestone 2:** playable Start and Gameplay screens, powered by the validated
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
   see a basic completion summary with the real uncapped score and annual totals.

Only confirmed years are saved. Reloading or returning to the start screen clears
an unconfirmed plan. Resume returns to the saved year's opening. Starting a new
game asks before replacing the saved journey. No login or backend is required.
If browser storage fails, the game remains playable in the current page and shows
a notice. Saved data is a versioned command log replayed through the engine; invalid
saves are rejected rather than treated as trusted game state.

## Scope and next milestone

The full Final Report, historical charts, playstyle classification and export are
reserved for milestone 3. Independent gauge scales, classification/confidence,
verbal score thresholds, visual chart normalisation, export format and highlight
chip presentation still require design decisions. This interface displays raw
uncapped capabilities and clearly labelled cumulative engine agency/trust gains.

See [architecture and rule decisions](docs/ARCHITECTURE.md),
[authoritative specification](docs/handoff/GAME_DESIGN.md), and
[validation notes](docs/VALIDATION.md).
