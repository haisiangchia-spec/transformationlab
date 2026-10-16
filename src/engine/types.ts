import type { CARDS } from '../data/cards';
import type { EVENTS } from '../data/events';
import type { ENGINES } from '../data/engines';
import type { PROFILES } from '../data/profiles';
export type CardId = typeof CARDS[number]['id'];
export type EventId = typeof EVENTS[number]['id'];
export type EngineId = typeof ENGINES[number]['id'];
export type ProfileId = typeof PROFILES[number]['name'];
export type CardValues = Partial<Record<CardId, number>>;
export interface Capability { sensing: number; modelling: number; acting: number }
export interface EventEffects {
  budget: number; actions: number; discounts: CardValues; penalties: CardValues;
  learningImpact: number; agency: number; trust: number;
}
export interface Progress {
  owned: readonly CardId[];
  boosts: CardValues;
  permanent: Capability;
  agency: number;
  trust: number;
}
export interface RoundRecord {
  round: number; event: EventId | null; effects: EventEffects;
  startOwned: readonly CardId[]; owned: readonly CardId[]; purchased: readonly CardId[];
  adoption: CardValues; activeEngines: readonly EngineId[];
  capabilities: Capability; permanent: Capability; boosts: CardValues;
  agency: number; trust: number; collectiveTarget: CardId | null;
  annualScore: number; cumulativeScore: number;
  openingBudget: number; budgetSpent: number; budgetRemaining: number;
  actionLimit: number; actionsSpent: number; actionsRemaining: number;
  drawnEvent: EventId | null;
}
export interface GameState extends Progress {
  profile: ProfileId; round: number; phase: 'investing' | 'complete';
  rng: number; remainingEvents: readonly EventId[];
  event: EventId | null; effects: EventEffects; startOwned: readonly CardId[];
  openingBudget: number; budget: number; actionLimit: number; actions: number;
  purchased: readonly CardId[]; history: readonly RoundRecord[]; score: number;
}
export type Action = { type: 'confirmPlan'; cards: readonly CardId[] } | { type: 'endRound' };
