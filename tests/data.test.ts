import { describe, it, expect } from 'vitest';
import { CARDS, EVENTS, ENGINES, PROFILES } from '../src/engine';
import handoff from '../docs/handoff/GAME_DATA_REFERENCE.json';
import reference from './fixtures/reference.json';
describe('locked catalogue integrity', () => {
  it('preserves every supplied field without changes', () => {
    expect(CARDS).toEqual(handoff.cards); expect(EVENTS).toEqual(handoff.events);
    expect(ENGINES).toEqual(handoff.engines); expect(PROFILES).toEqual(handoff.profiles);
  });
  it.each(CARDS)('$id matches simulator costs, capabilities, and supporter IDs', c => {
    expect(c.cost).toBe(reference.cost[c.id]);
    expect([c.sensing,c.modelling,c.acting]).toEqual(reference.cap[c.id]);
    expect(c.supporters).toEqual(reference.supporters[c.id]);
    expect(new Set(c.supporters).size).toBe(3);
    c.supporters.forEach(s => expect(CARDS.some(c=>c.id===s)).toBe(true));
  });
  it('has exactly 24 cards, 24 events, 6 engines, 4 profiles, valid distinct references', () => {
    expect(new Set(CARDS.map(c=>c.id)).size).toBe(24);
    expect(EVENTS.map(e=>e.id)).toEqual(Array.from({length:24},(_,i)=>`E${String(i+1).padStart(2,'0')}`));
    expect(new Set(ENGINES.map(e=>e.id)).size).toBe(6); expect(PROFILES).toHaveLength(4);
    for (const p of PROFILES) {expect(new Set(p.starting_cards).size).toBe(2);}
    for (const e of ENGINES) {expect(new Set(e.requirements).size).toBe(3); e.requirements.forEach(id=>expect(CARDS.some(c=>c.id===id)).toBe(true));}
    expect(CARDS.find(c=>c.id==='S3')!.supporters).toEqual(['S1','P3','S2']);
    expect(CARDS.find(c=>c.id==='I4')!.supporters).toEqual(['T3','S3','S2']);
  });
});
