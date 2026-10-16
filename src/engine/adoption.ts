import { CARDS } from '../data/cards';
import type { CardId, CardValues } from './types';
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function adoption(owned: readonly CardId[], boosts: CardValues = {}, penalties: CardValues = {}): CardValues {
  const ids = new Set(owned);
  return Object.fromEntries(CARDS.filter(c => ids.has(c.id)).map(c => [c.id,
    clamp(40 + 20 * c.supporters.filter(s => ids.has(s)).length + (boosts[c.id] ?? 0) - (penalties[c.id] ?? 0), 10, 100),
  ]));
}
