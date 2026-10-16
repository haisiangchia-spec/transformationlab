import { it, expect } from 'vitest';
import reference from './fixtures/reference.json';
import { createGame, confirmPlan, endRound, type EventId, type CardId, type ProfileId } from '../src/engine';
// Event schedule is injected through explicit remaining-deck state. PRNG itself is tested separately.
it.each(reference.games)('matches independent Python reference: $profile seed $seed (five rounds)',game=>{
 let s=createGame(game.profile as ProfileId,game.seed);
 for(const round of game.rounds) {
  expect(s.event).toBe(round.event);expect(s.openingBudget).toBe(round.opening);expect(s.actionLimit).toBe(round.actions);
  s=confirmPlan(s,round.purchased as CardId[]);
  if(round.drawn)s={...s,remainingEvents:[round.drawn as EventId]};
  s=endRound(s);const actual=s.history.at(-1)!;
  expect(actual.adoption).toEqual(round.adoption);
  expect([...actual.activeEngines].sort()).toEqual(round.active);
  expect(actual.capabilities.sensing).toBeCloseTo(round.cap[0]!,10);
  expect(actual.capabilities.modelling).toBeCloseTo(round.cap[1]!,10);
  expect(actual.capabilities.acting).toBeCloseTo(round.cap[2]!,10);
  expect(actual.annualScore).toBeCloseTo(round.annual,10);expect(actual.cumulativeScore).toBeCloseTo(round.score,10);
  expect(actual.budgetRemaining).toBe(round.budget);
 }
 expect(s.phase).toBe('complete');
});
