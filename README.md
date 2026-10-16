# School Transformation Lab

A single-player educational strategy game for Singapore school leaders.

**Milestone 1: deterministic game data and engine only.** No visual interface or
playable browser entry has been implemented. React is installed for the next
milestone; Vite currently builds the engine as an ES module library.

Requires Node.js 22.12+ (validated with 24.19.0) and npm.

```sh
npm ci
npm test
npm run typecheck
npm run build
```

The build emits `dist/school-transformation-engine.js`. It is not yet a GitHub
Pages site; a browser entry, React screens and Pages deployment come later.

## Engine API

```ts
import { createGame, previewPlan, apply, adoption } from './src/engine';

let game = createGame('Strategically Led', 123); // explicit uint32 seed
const preview = previewPlan(game, ['T1', 'G3']); // discard to undo; game unchanged
const previewAdoption = adoption(preview.owned, preview.boosts, preview.effects.penalties);
game = apply({ type: 'confirmPlan', cards: ['T1', 'G3'] }, game);
game = apply({ type: 'endRound' }, game);
```

Plans are atomic and validated before charging. Confirmation does not end the
year; `endRound` applies rewards and scoring once, records a snapshot, draws a
unique event (Years 1–4), and opens the next year. An empty plan is permitted.
Repeated confirmations may spend the remaining budget/actions. An invalid action
throws without mutating its input. Preview never commits purchases or draws randomness.

State contains only JSON-compatible data, including the PRNG state, so save/resume
can serialise it. No persistence or UI has been implemented. Treat restored state
as trusted engine output; this milestone does not validate arbitrary imported saves.

See [architecture and rule decisions](docs/ARCHITECTURE.md),
[authoritative specification](docs/handoff/GAME_DESIGN.md), and
[validation notes](docs/VALIDATION.md).
