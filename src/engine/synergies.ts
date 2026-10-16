import { ENGINES } from '../data/engines';
import { adoption } from './adoption';
import type { CardId, CardValues, EngineId, Progress } from './types';
export function activeEngines(owned: readonly CardId[], ads: CardValues): EngineId[] {
  return ENGINES.filter(e => e.requirements.every(id => owned.includes(id) && (ads[id] ?? 0) >= 70)).map(e => e.id);
}
/** Eligibility is sampled once, before rewards; boosts never cascade same-year rewards. */
export function rewardEngines(progress: Progress, penalties: CardValues) {
  const next = structuredClone(progress);
  const ads = adoption(next.owned, next.boosts, penalties);
  const active = activeEngines(next.owned, ads);
  let collectiveTarget: CardId | null = null;
  for (const id of active) {
    switch (id) {
      case 'Adaptive Teaching': next.permanent.modelling++; break;
      case 'Self-Directed AI': next.permanent.acting++; next.agency += 2; break;
      case 'Collective Teacher': {
        next.permanent.modelling++;
        const choices = next.owned.filter(c => c.startsWith('T') || c.startsWith('P'));
        choices.sort((a,b) => (ads[a] ?? 0) - (ads[b] ?? 0) || (a < b ? -1 : a > b ? 1 : 0));
        collectiveTarget = choices[0] ?? null;
        if (collectiveTarget) next.boosts[collectiveTarget] = Math.min(60,(next.boosts[collectiveTarget] ?? 0)+10);
        break;
      }
      case 'Trusted AI': next.trust += 2; break;
      case 'Networked Learning': next.permanent.sensing++; break;
      case 'School Innovation': break; // Opening-year budget only.
    }
  }
  return { progress: next, active, collectiveTarget };
}
