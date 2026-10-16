import { CARDS } from '../data/cards';
import type { CardId, CardValues, GameState } from './types';
export function purchasePrice(id: CardId, discounts: CardValues): number {
  const card = CARDS.find(c => c.id === id);
  if (!card) throw new Error(`Unknown card: ${String(id)}`);
  return Math.max(1, card.cost - (discounts[id] ?? 0));
}
export function previewPlan(state: GameState, cards: readonly CardId[]): GameState {
  if (state.phase !== 'investing') throw new Error('Game is complete');
  if (new Set(cards).size !== cards.length) throw new Error('Duplicate cards in plan');
  if (cards.some(id => state.owned.includes(id))) throw new Error('Card already owned');
  if (cards.length > state.actions) throw new Error('Insufficient actions');
  const cost = cards.reduce((n,id) => n + purchasePrice(id,state.effects.discounts),0);
  if (cost > state.budget) throw new Error('Insufficient budget');
  return {...structuredClone(state), owned: [...state.owned,...cards], purchased: [...state.purchased,...cards], budget: state.budget-cost, actions: state.actions-cards.length};
}
/** Atomic commit; preview has the same validation and never mutates its input. */
export const confirmPlan = previewPlan;
