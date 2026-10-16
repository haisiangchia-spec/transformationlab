import { EVENTS } from '../data/events';
import { PROFILES } from '../data/profiles';
import { adoption, clamp } from './adoption';
import { eventEffects } from './events';
import { activeEngines, rewardEngines } from './synergies';
import { annualScore, capabilities } from './scoring';
import { random, validateSeed } from './random';
import { confirmPlan } from './investment';
import type { Action, EventId, GameState, ProfileId, RoundRecord } from './types';
function openRound(state: GameState, event: EventId | null): GameState {
  const effects = eventEffects(event,state.owned);
  const innovation = activeEngines(state.owned,adoption(state.owned,state.boosts,effects.penalties)).includes('School Innovation');
  const budget = Math.max(0,8+effects.budget+(innovation ? 2 : 0));
  const actions = clamp(3+effects.actions,2,4);
  return {...state, event, effects, startOwned: [...state.owned], openingBudget: budget, budget, actionLimit: actions, actions, purchased: []};
}
export function createGame(profile: ProfileId | 'random', seed: number): GameState {
  validateSeed(seed);
  let rng = seed;
  if (profile === 'random') {
    const draw = random(rng); rng = draw.rng;
    profile = PROFILES[Math.floor(draw.value*PROFILES.length)]!.name;
  }
  const data = PROFILES.find(p => p.name === profile);
  if (!data) throw new Error(`Unknown profile: ${String(profile)}`);
  return openRound({ profile: data.name, round: 1, phase: 'investing', rng,
    owned: [...data.starting_cards], boosts: {}, permanent: {sensing:0,modelling:0,acting:0}, agency:0, trust:0,
    remainingEvents: EVENTS.map(e=>e.id), event:null, effects:eventEffects(null,[]), startOwned:[],
    openingBudget:0, budget:0, actionLimit:0, actions:0, purchased:[], history:[], score:0,
  },null);
}
export function endRound(state: GameState): GameState {
  if (state.phase !== 'investing') throw new Error('Game is complete');
  const next = structuredClone(state);
  const reward = rewardEngines(next,next.effects.penalties);
  const p = reward.progress;
  next.boosts=p.boosts; next.permanent=p.permanent; next.agency=p.agency; next.trust=p.trust;
  const ads = adoption(next.owned,next.boosts,next.effects.penalties);
  const cap = capabilities(next.owned,ads,next.permanent);
  const annual = annualScore(cap,reward.active,next.agency,next.trust,next.effects);
  next.score += annual;
  let drawnEvent: EventId | null = null;
  if (next.round < 5) {
    const draw = random(next.rng); next.rng=draw.rng;
    const index = Math.floor(draw.value*next.remainingEvents.length);
    drawnEvent = next.remainingEvents[index]!;
    next.remainingEvents = next.remainingEvents.filter(id => id !== drawnEvent);
  }
  const record: RoundRecord = {
    round:next.round, event:next.event, effects:structuredClone(next.effects),
    startOwned:[...next.startOwned], owned:[...next.owned], purchased:[...next.purchased], adoption:ads,
    activeEngines:reward.active, capabilities:cap, permanent:{...next.permanent}, boosts:{...next.boosts},
    agency:next.agency, trust:next.trust, collectiveTarget:reward.collectiveTarget,
    annualScore:annual, cumulativeScore:next.score,
    openingBudget:next.openingBudget, budgetSpent:next.openingBudget-next.budget, budgetRemaining:next.budget,
    actionLimit:next.actionLimit, actionsSpent:next.actionLimit-next.actions, actionsRemaining:next.actions,
    drawnEvent,
  };
  next.history=[...next.history,record];
  if (next.round === 5) return {...next,phase:'complete'};
  return openRound({...next,round:next.round+1},drawnEvent);
}
export function apply(action: Action, state: GameState): GameState {
  switch(action.type) {
    case 'confirmPlan': return confirmPlan(state,action.cards);
    case 'endRound': return endRound(state);
    default: throw new Error('Unknown action');
  }
}
