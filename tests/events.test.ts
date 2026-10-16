import { it, expect } from 'vitest';
import { eventEffects, EVENTS, CARDS, type EventId, type CardId } from '../src/engine';
const all=CARDS.map(c=>c.id);
// Independent table from design §6. Each row: ID, discounts, base/fully mitigated budget,
// actions, learning, agency, and shock magnitude (targets checked separately below).
const rows: [EventId,Record<string,number>,number,number,number,number,number,number,number,number][] = [
 ['E01',{I4:2,I3:2,P3:2},0,0,0,1,0,0,0,0],
 ['E02',{T1:2,T2:2,T3:2},0,0,0,1,0,0,0,0],
 ['E03',{S1:1,S2:1,G2:1},0,0,0,0,0,0,-2,0],
 ['E04',{G1:2},0,0,0,0,0,0,0,0],
 ['E05',{I1:2,I2:2},1,1,0,0,0,0,0,0],
 ['E06',{},0,1,-1,0,0,0,0,0],
 ['E07',{G2:1,S3:1,P2:1},0,0,0,0,0,0,0,0],
 ['E08',{I4:2,G1:2},0,0,0,1,0,0,0,0],
 ['E09',{I4:2,S4:2},0,0,0,0,0,0,0,0],
 ['E10',{I3:2,I4:2,S4:2},0,0,0,0,0,0,0,0],
 ['E11',{},0,0,0,0,0,0,0,0], ['E12',{},0,0,0,0,0,0,0,0],
 ['E13',{I3:2,T2:2},0,0,0,0,0,2,0,0], ['E14',{},0,0,0,0,0,0,0,0],
 ['E15',{},0,0,-1,0,0,0,0,0], ['E16',{},0,0,0,0,0,0,0,0], ['E17',{},0,0,0,0,0,0,0,0],
 ['E18',{},-2,-1,0,0,0,0,0,0], ['E19',{},0,0,0,0,0,0,0,0],
 ['E20',{I1:2,G2:2},0,0,0,0,0,0,-3,0],
 ['E21',{T2:1,P3:1,L3:1},0,0,0,1,0,2,0,0],
 ['E22',{T4:2,L2:2},0,0,0,1,0,0,0,0],
 ['E23',{G4:1,P4:1,I3:1},0,2,0,0,0,0,0,0],
 ['E24',{L3:2,S4:2,P4:2},0,0,0,1,0,0,0,0],
];
it.each(rows)('%s discounts and unmitigated/fully mitigated outcomes', (id,discounts,b0,b1,a0,a1,l0,l1,g0,g1)=>{
 const empty=eventEffects(id,[]), full=eventEffects(id,all);
 expect(empty.discounts).toEqual(discounts); expect(full.discounts).toEqual(discounts);
 expect([empty.budget,full.budget,empty.actions,full.actions,empty.learningImpact,full.learningImpact,empty.agency,full.agency]).toEqual([b0,b1,a0,a1,l0,l1,g0,g1]);
 expect(empty.penalties).toEqual({}); expect(empty.trust).toBe(0);expect(full.trust).toBe(0);
});
const shocks: [EventId,CardId[],CardId[],number][] = [
 ['E04',['I3','I4'],[],20], ['E04',['I3','I4'],['G1'],0],
 ['E07',['S1','S2','S3','S4'],[],10], ['E07',['S1','S2','S3','S4'],['G2'],0],
 ['E09',['I4'],[],20],['E09',['I4'],['G1'],20],['E09',['I4'],['T3'],20],['E09',['I4'],['G1','T3'],0],
 ['E11',['I2','I3','I4'],[],20],['E11',['I2','I3','I4'],['L4'],10],
 ['E12',['I4','S4'],[],30],['E12',['I4','S4'],['G1'],30],['E12',['I4','S4'],['S2'],30],['E12',['I4','S4'],['G1','S2'],10],
 ['E14',['I2','I3','I4'],[],20],['E14',['I2','I3','I4'],['L4'],20],['E14',['I2','I3','I4'],['G1'],10],['E14',['I2','I3','I4'],['G1','L4'],0],
 ['E15',['T3','P2','P3'],[],20],['E15',['T3','P2','P3'],['L4'],20],
 ['E16',['S4','I4'],[],20],['E16',['S4','I4'],['G1'],20],['E16',['S4','I4'],['G3'],10],['E16',['S4','I4'],['G3','G1'],0],
 ['E17',['T4'],[],20],['E17',['L2'],[],20],['E17',['T4','L2'],[],10],
 ['E19',['I2','I4'],[],30],['E19',['I2','I4'],['L4'],30],['E19',['I2','I4'],['P1'],30],['E19',['I2','I4'],['L4','P1'],10],
];
it.each(shocks)('%s shocks %j with mitigators %j -> %i pp', (id,targets,mitigators,amount)=>{
 expect(eventEffects(id,[...targets,...mitigators]).penalties).toEqual(Object.fromEntries(targets.map(c=>[c,amount])));
});
it('defines all 24 branches and never penalises unowned targets',()=>{
 expect(rows).toHaveLength(EVENTS.length);
 expect(eventEffects('E11',['I2']).penalties).toEqual({I2:20});
});
it.each([['E06',['L1']],['E06',['I3']],['E13',['I3']],['E13',['T2']],['E21',['T2']],['E21',['P3']],['E23',['G4']],['E23',['L3']]] as [EventId,CardId[]][])('%s requires both conditional cards %j', (id,owned)=>{
 const result=eventEffects(id,owned);expect(result.budget).toBe(0);expect(result.learningImpact).toBe(0);
 if(id==='E06')expect(result.actions).toBe(-1);
});
