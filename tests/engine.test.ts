import { describe, it, expect } from 'vitest';
import { adoption, activeEngines, annualScore, capabilities, rewardEngines, createGame, endRound,
  previewPlan, confirmPlan, purchasePrice, apply, eventEffects, CARDS, ENGINES, PROFILES,
  type CardId, type CardValues, type GameState, type Progress, type EventId } from '../src/engine';
import { clamp } from '../src/engine/adoption';
const all = CARDS.map(c=>c.id);
const zero = () => ({sensing:0,modelling:0,acting:0});
const progress = (owned: readonly CardId[] = all): Progress => ({owned,boosts:{},permanent:zero(),agency:0,trust:0});
function scenario(owned: readonly CardId[], event: EventId | null = null): GameState {
 const s=createGame('Technology-Ready',1);
 return {...s,owned,startOwned:[...owned],effects:eventEffects(event,owned),event};
}
function frozen<T>(value:T):T {
 if(value && typeof value==='object') {Object.freeze(value);Object.values(value).forEach(frozen);}
 return value;
}
describe('adoption',()=>{
 it('base, supporters, persistent pp, shock pp, clamping and ownership only',()=>{
  expect(adoption(['T1'])).toEqual({T1:40});
  expect(adoption(['T1','L1']).T1).toBe(60);
  expect(adoption(['T1','L1','L2']).T1).toBe(80);
  expect(adoption(['T1','L1','L2','L4'],{T1:60}).T1).toBe(100);
  expect(adoption(['T1'],{}, {T1:90})).toEqual({T1:10});
  expect(adoption(['T1','L1'],{T1:10},{T1:20}).T1).toBe(50);
  expect(adoption([], {T1:60})).toEqual({});
 });
 it('support loops count once without recursion',()=>{
  expect(adoption(['P4','S4'])).toEqual({P4:60,S4:60});
  expect(adoption(['P4','S4','S4'])).toEqual({P4:60,S4:60});
 });
});
describe('investment transactions',()=>{
 it.each(PROFILES)('$name starts with exactly its two free cards, 8 budget and 3 actions',p=>{
  const s=createGame(p.name,0); expect(s.owned).toEqual(p.starting_cards);
  expect([s.budget,s.actions,s.round]).toEqual([8,3,1]);expect(s.purchased).toEqual([]);
 });
 it('preview can be discarded, confirmation atomically charges and recalculates ownership effects',()=>{
  const s=frozen(createGame('Strategically Led',5));
  const preview=previewPlan(s,['T1','G3']);expect(preview.budget).toBe(4);expect(preview.actions).toBe(1);
  expect(s.budget).toBe(8);expect(s.owned).toEqual(['L1','L4']);
  expect(confirmPlan(s,['T1','G3'])).toEqual(preview);
  expect(adoption(preview.owned).L1).toBe(60);
  expect(adoption(preview.owned).T1).toBe(80);
  expect(apply({type:'confirmPlan',cards:['T1','G3']},s)).toEqual(preview);
 });
 it('rejects duplicate, owned, unknown, overbudget and over-action plans without partial effects',()=>{
  const s=frozen(createGame('Technology-Ready',0));
  expect(()=>confirmPlan(s,['I1'])).toThrow('already owned');
  expect(()=>confirmPlan(s,['T1','T1'])).toThrow('Duplicate');
  expect(()=>confirmPlan(s,['T1','T2','T3','T4'])).toThrow('actions');
  expect(()=>confirmPlan(s,['I4','I3'])).toThrow('budget');
  expect(()=>confirmPlan(s,['X1' as CardId])).toThrow('Unknown');
  const next=confirmPlan(s,['T1']);expect(()=>confirmPlan(next,['T1'])).toThrow('owned');
  expect(s.budget).toBe(8);
 });
 it('discounts have floor 1, do not refund owned cards, support 4 dynamic actions',()=>{
  expect(purchasePrice('T1',{T1:9})).toBe(1);
  const s=createGame('Technology-Ready',0);
  const discounted={...s,effects:eventEffects('E05',s.owned)};
  expect(confirmPlan(discounted,[]).budget).toBe(8);
  const four={...s,actions:4,actionLimit:4,effects:{...s.effects,discounts:{T1:2,L1:2,G3:2,P1:2}}};
  expect(confirmPlan(four,['T1','L1','G3','P1']).actions).toBe(0);
  expect(clamp(1,2,4)).toBe(2);expect(clamp(5,2,4)).toBe(4);
 });
});
describe('engine eligibility and compounding',()=>{
 it.each(ENGINES)('$id requires all three owned at >=70%',engine=>{
  const ads=Object.fromEntries(engine.requirements.map(id=>[id,70]));
  expect(activeEngines(engine.requirements,ads)).toContain(engine.id);
  expect(activeEngines(engine.requirements.slice(1),ads)).not.toContain(engine.id);
  expect(activeEngines(engine.requirements,{...ads,[engine.requirements[0]]:69})).not.toContain(engine.id);
 });
 it('applies exactly six recurring effects with no general mitigation or extra event choice',()=>{
  const result=rewardEngines(progress(),{});
  expect(result.active).toHaveLength(6);expect(result.progress.permanent).toEqual({sensing:1,modelling:2,acting:1});
  expect(result.progress.agency).toBe(2);expect(result.progress.trust).toBe(2);
  const second=rewardEngines(result.progress,{});
  expect(second.progress.permanent).toEqual({sensing:2,modelling:4,acting:2});
  expect(second.progress.agency).toBe(4);expect(second.progress.trust).toBe(4);
 });
 it('retains gains during dormancy and earns again after shock expires',()=>{
  const first=rewardEngines(progress(['T2','P3','I3','T1','T4','I2','G1']),{});
  expect(first.active).toContain('Adaptive Teaching');
  const dormant=rewardEngines(first.progress,{I3:50});
  expect(dormant.active).not.toContain('Adaptive Teaching');expect(dormant.progress.permanent).toEqual(first.progress.permanent);
  const resumed=rewardEngines(dormant.progress,{});expect(resumed.progress.permanent.modelling).toBe(2);
 });
 it('Collective Teacher chooses lowest current T/P adoption with canonical ID ties and caps +60',()=>{
  let p={...progress(),boosts:{}};
  let result=rewardEngines(p,{}); expect(result.collectiveTarget).toBe('P1');expect(result.progress.boosts.P1).toBe(10);
  result=rewardEngines(progress(),{T1:80});expect(result.collectiveTarget).toBe('T1');
  expect(result.progress.boosts.T1).toBe(10);
  const boosted=Object.fromEntries(all.map(id=>[id,60])) as CardValues;
  result=rewardEngines({...progress(),boosts:boosted},{});expect(result.progress.boosts.P1).toBe(60);
  expect(adoption(all,result.progress.boosts).P1).toBe(100);
 });
 it('a boost can improve scoring adoption without awarding a newly activated engine twice',()=>{
  // T2 is the sole 60% T/P target. Collective lifts it to 70, enabling Adaptive only next evaluation.
  const owned:CardId[]=['T2','P3','I3','T3','T4','L2','L3','P1','G1','L1','I2'];
  const before=adoption(owned); expect(before.T2).toBe(80); // construct a focused 20pp shock
  const penalties={T2:20}; const reward=rewardEngines(progress(owned),penalties);
  expect(reward.active).not.toContain('Adaptive Teaching'); expect(reward.active).toContain('Collective Teacher');
  expect(reward.collectiveTarget).toBe('T2');
  expect(adoption(owned,reward.progress.boosts,penalties).T2).toBe(70);
  expect(reward.progress.permanent.modelling).toBe(1);
 });
 it('School Innovation gives budget only on the following opening evaluation, including its penalties',()=>{
  const owned:CardId[]=['L1','L3','L4','L2','G3','G4'];
  const s=scenario(owned);const next=endRound(s);
  expect(next.budget).toBe(10+next.effects.budget);
  expect(next.history[0]!.openingBudget).toBe(8);
  // Generic opening eligibility check under shock; no locked event currently targets L1/L3/L4.
  expect(activeEngines(owned,adoption(owned,{}, {L3:40}))).not.toContain('School Innovation');
  const final=endRound({...s,round:5});expect(final.phase).toBe('complete');expect(final.budget).toBe(8);
  expect(final.history[0]!.drawnEvent).toBeNull();
 });
});
describe('scoring and history',()=>{
 it('matches exact 16.24 example and applies temporary event adjustments once',()=>{
  const cap={sensing:10,modelling:12,acting:8};const e=eventEffects(null,[]);
  expect(annualScore(cap,['Adaptive Teaching'],4,2,e)).toBeCloseTo(16.24);
  expect(annualScore(cap,['Adaptive Teaching'],4,2,{...e,learningImpact:2,agency:-2})).toBeCloseTo(16.74);
 });
 it('weights effective capabilities and includes current-year permanent rewards before score',()=>{
  expect(capabilities(['T1'],{T1:40},{sensing:1,modelling:2,acting:3})).toEqual({sensing:1,modelling:2.8,acting:3.4});
  const next=endRound(scenario(all)); const r=next.history[0]!;
  expect(r.permanent).toEqual({sensing:1,modelling:2,acting:1});
  expect(r.capabilities).toEqual(capabilities(all,r.adoption,r.permanent));
  expect(r.annualScore).toBeCloseTo(annualScore(r.capabilities,r.activeEngines,2,2,r.effects));
  expect(r.cumulativeScore).toBe(next.score);
 });
 it('retains stable snapshots and budget/action accounting, never caps cumulative score',()=>{
  let s=confirmPlan(createGame('Technology-Ready',8),['T1','L1']);s=endRound(s);
  const first=structuredClone(s.history[0]);const r=first!;
  expect([r.budgetSpent,r.budgetRemaining,r.actionsSpent,r.actionsRemaining]).toEqual([4,4,2,1]);
  s=endRound(s);expect(s.history[0]).toEqual(first);
  let rich=scenario(all); for(let i=0;i<5;i++)rich=endRound(rich);
  expect(rich.score).toBeGreaterThan(100);
  expect(rich.score).toBeCloseTo(rich.history.reduce((n,r)=>n+r.annualScore,0));
 });
});
describe('round progression and deterministic random state',()=>{
 it('draws exactly four unique events after years 1–4, never Year 5; refreshes resources',()=>{
  let s=createGame('Technology-Ready',12);
  for(let i=1;i<=5;i++) {
   const before=s; s=endRound(frozen(s));expect(s.history).toHaveLength(i);
   if(i<5) {expect(s.round).toBe(i+1);expect(s.event).toBe(s.history[i-1]!.drawnEvent);expect(s.budget).toBe(8+s.effects.budget);expect(s.actions).toBe(clamp(3+s.effects.actions,2,4));}
   else expect(s.rng).toBe(before.rng);
  }
  const drawn=s.history.map(r=>r.drawnEvent).filter(Boolean);expect(new Set(drawn).size).toBe(4);
  expect(s.remainingEvents).toHaveLength(20);expect(s.history[0]!.event).toBeNull();expect(s.history[4]!.drawnEvent).toBeNull();
  expect(()=>endRound(s)).toThrow('complete');expect(()=>confirmPlan(s,[])).toThrow('complete');
 });
 it('freezes event conditionals and shock targets until the next opening',()=>{
  const s=scenario(['I2'],'E04');const bought=confirmPlan(s,['G1','I4']);
  expect(bought.effects.penalties).toEqual({}); // newly bought I4 receives no shock
  const risk=scenario(['I2','I4'],'E04');const mitigation=confirmPlan(risk,['G1']);
  expect(mitigation.effects.penalties.I4).toBe(20); // cannot retroactively mitigate
  const scored=endRound(mitigation);expect(scored.history[0]!.effects.penalties.I4).toBe(20);
 });
 it('event penalties and agency effects expire rather than accumulating into permanent pools',()=>{
  let s=scenario(['I2','I4'],'E20');s=endRound(s);
  expect(s.history[0]!.effects.agency).toBe(-3);expect(s.agency).toBe(0);
  const shock=scenario(['I2'],'E11');const next=endRound({...shock,remainingEvents:['E05']});
  expect(next.effects.penalties).toEqual({});expect(adoption(next.owned,next.boosts,next.effects.penalties).I2).toBe(40);
  expect(next.budget).toBe(9);expect(next.history[0]!.adoption.I2).toBe(20);
 });
 it('replays identically through JSON save/resume and explicit actions',()=>{
  const run=(seed:number)=>{let s=createGame('random',seed);for(let i=0;i<5;i++)s=apply({type:'endRound'},JSON.parse(JSON.stringify(s)) as GameState);return s;};
  expect(run(123)).toEqual(run(123));expect(run(123).history).not.toEqual(run(124).history);
  for(const seed of [-1,1.5,NaN,Infinity,2**32])expect(()=>createGame('random',seed)).toThrow('uint32');
 });
 it('random profile selection reaches all four profiles across deterministic seeds',()=>{
  expect(new Set(Array.from({length:200},(_,seed)=>createGame('random',seed).profile)).size).toBe(4);
 });
});
