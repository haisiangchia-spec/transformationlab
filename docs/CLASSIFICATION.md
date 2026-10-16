# Playstyle rubric: evidence-v1

The user approved an explainable, deterministic, report-only heuristic for
milestone 3, with no confidence/match percentage. This rubric is a descriptive
mapping of in-game decisions, not a trained model, calibrated probability, skill
rating or change to game mechanics. It never changes budgets, adoption, rewards,
score or the saved action log.

## Measurements

Use actual historical purchases and event-adjusted prices (minimum 1), excluding
free starting cards. Measure all years supplied; the final report supplies five.
Every zero-denominator fraction is 0.

- Category spending share: actual purchased-card spend in that category / total spend.
- Relevant engine-year share: rewarding years / number of completed years supplied.
  Teacher uses Collective Teacher, Student uses Self-Directed AI, Governance uses
  Trusted AI. An engine counts only when it earned that year's rewards.
- Technology earliness: mean `(6 − purchaseYear) / 5` among infrastructure purchases.
- Supporter-linked purchase: the new card has an owned supporter or supports another
  owned card in that year's final ownership. Count each purchase once. Co-purchased
  cards count; purchase order within the same year does not change the measurement.
- Engine-essential purchase: removing the card from that year's final ownership
  would deactivate at least one engine that rewarded that year, recalculating
  adoption with that year's frozen penalties and **previous year's** persistent
  boosts (before current-year Collective Teacher rewards). Each purchase counts once.
- Event-aligned share: discounted purchases / all purchases made in affected years
  (Years 2–5). A purchase is discounted if its actual cost is below its printed cost.
  This measures use of opportunities, not whether the player consciously adapted.
- Category shift: mean total-variation distance between consecutive annual category
  spending distributions: `0.5 × sum(abs(currentShare − previousShare))`. Only affected
  years with positive spending in both years count. Each distribution uses actual
  spending across all six categories. A change alone does not prove event causation.

## Indices (0–1, not probabilities)

| Canonical ID | Player label | Index |
| --- | --- | --- |
| Random | Exploratory Investor | 1 − maximum other index |
| Technology-first | Technology Enthusiast | 0.8 × I spending share + 0.2 × technology earliness |
| Teacher-first | Teacher-First Leader | 0.8 × T spending share + 0.2 × Collective Teacher year share |
| Student-first | Student-Centred Leader | 0.8 × S spending share + 0.2 × Self-Directed AI year share |
| Governance-first | Risk-Averse Leader | 0.8 × G spending share + 0.2 × Trusted AI year share |
| Engine-focused | Synergy Optimiser | 0.35 × supporter-linked purchase share + 0.65 × engine-essential purchase share |
| Adaptive | Adaptive Strategist | 0.75 × event-aligned share + 0.25 × category shift |

Choose the largest unrounded index. Differences up to `1e-12` are ties, resolved
by the canonical table order. Display rounding does not influence selection.
With no purchases, all indices are 0, select Random and explicitly state that
there is insufficient evidence. The report shows evidence and the full rubric;
JSON export includes version, all indices and measured features. Indices are not
normalised to sum to 1 and must never be labelled confidence or match percentages.

These weights and mappings are explicit design conventions, not conclusions from
the supplied simulator's 5,000 games or its seven purchasing policies. Future
rubric changes should get a new version, tests and documentation. Current exports
retain their version and features for audit; game outcomes remain independent.
