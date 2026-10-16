import { CARDS } from '../data/cards';
import type { Capability, CardId, CardValues, EngineId, EventEffects } from './types';
export function capabilities(owned: readonly CardId[], ads: CardValues, permanent: Capability): Capability {
  const result = {...permanent};
  for (const card of CARDS) if (owned.includes(card.id)) {
    for (const d of ['sensing','modelling','acting'] as const) result[d] += card[d] * (ads[card.id] ?? 0) / 100;
  }
  return result;
}
export function annualScore(cap: Capability, active: readonly EngineId[], agency: number, trust: number, effects: EventEffects): number {
  return Math.min(cap.sensing,cap.modelling,cap.acting) + (cap.sensing+cap.modelling+cap.acting)/6
    + 0.5*effects.learningImpact + (active.includes('Adaptive Teaching') ? 2 : 0)
    + 0.25*(agency+effects.agency) + 0.12*(trust+effects.trust);
}
