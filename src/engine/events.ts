import type { CardId, EventEffects, EventId } from './types';
/** Freeze conditionals AND shock targets against opening ownership (spec §6). */
export function eventEffects(event: EventId | null, owned: readonly CardId[]): EventEffects {
  const e: EventEffects = {budget: 0, actions: 0, discounts: {}, penalties: {}, learningImpact: 0, agency: 0, trust: 0};
  const has = (...ids: CardId[]) => ids.every(id => owned.includes(id));
  const sale = (ids: CardId[], n: number) => ids.forEach(id => { e.discounts[id] = n; });
  const shock = (ids: CardId[], n: number) => ids.filter(id => has(id)).forEach(id => { e.penalties[id] = n; });
  switch (event) {
    case null: break;
    case 'E01': sale(['I4','I3','P3'],2); e.actions = +has('I2'); break;
    case 'E02': sale(['T1','T2','T3'],2); e.actions = +has('L2'); break;
    case 'E03': sale(['S1','S2','G2'],1); e.agency = has('S2') ? 0 : -2; break;
    case 'E04': sale(['G1'],2); shock(['I3','I4'],has('G1') ? 0 : 20); break;
    case 'E05': sale(['I1','I2'],2); e.budget = 1; break;
    case 'E06': e.actions = has('L1','I3') ? 0 : -1; e.budget = +has('L1','I3'); break;
    case 'E07': sale(['G2','S3','P2'],1); shock(['S1','S2','S3','S4'],has('G2') ? 0 : 10); break;
    case 'E08': sale(['I4','G1'],2); e.actions = +has('G1'); break;
    case 'E09': sale(['I4','S4'],2); shock(['I4'],has('G1','T3') ? 0 : 20); break;
    case 'E10': sale(['I3','I4','S4'],2); break;
    case 'E11': shock(['I2','I3','I4'],has('L4') ? 10 : 20); break;
    case 'E12': shock(['I4','S4'],has('G1','S2') ? 10 : 30); break;
    case 'E13': sale(['I3','T2'],2); e.learningImpact = has('I3','T2') ? 2 : 0; break;
    case 'E14': shock(['I2','I3','I4'],has('G1','L4') ? 0 : has('G1') ? 10 : 20); break;
    case 'E15': e.actions = has('L4') ? 0 : -1; shock(['T3','P2','P3'],20); break;
    case 'E16': shock(['S4','I4'],has('G3','G1') ? 0 : has('G3') ? 10 : 20); break;
    case 'E17': shock(['T4','L2'],has('T4','L2') ? 10 : 20); break;
    case 'E18': e.budget = has('L1') ? -1 : -2; break;
    case 'E19': shock(['I2','I4'],has('L4','P1') ? 10 : 30); break;
    case 'E20': e.agency = has('G2') ? 0 : -3; sale(['I1','G2'],2); break;
    case 'E21': sale(['T2','P3','L3'],1); e.actions = +has('L3'); e.learningImpact = has('T2','P3') ? 2 : 0; break;
    case 'E22': sale(['T4','L2'],2); e.actions = +has('G4'); break;
    case 'E23': sale(['G4','P4','I3'],1); e.budget = has('G4','L3') ? 2 : 0; break;
    case 'E24': sale(['L3','S4','P4'],2); e.actions = +has('L3'); break;
    default: throw new Error(`Unknown event: ${String(event)}`);
  }
  return e;
}
