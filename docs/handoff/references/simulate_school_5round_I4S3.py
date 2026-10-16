import random, math, statistics, csv, collections, json
import numpy as np
COST={'T1':2,'T2':3,'T3':3,'T4':3,'S1':2,'S2':3,'S3':3,'S4':3,'P1':2,'P2':4,'P3':3,'P4':3,'I1':3,'I2':3,'I3':4,'I4':5,'L1':2,'L2':3,'L3':3,'L4':3,'G1':3,'G2':3,'G3':2,'G4':3}
CAP={'T1':(0,2,1),'T2':(1,3,0),'T3':(0,3,2),'T4':(1,2,2),'S1':(1,1,1),'S2':(1,2,1),'S3':(1,2,2),'S4':(0,2,3),'P1':(0,1,2),'P2':(1,2,3),'P3':(2,1,2),'P4':(1,2,3),'I1':(1,0,2),'I2':(2,0,1),'I3':(3,2,0),'I4':(1,3,3),'L1':(1,2,1),'L2':(1,2,2),'L3':(2,2,1),'L4':(1,1,3),'G1':(2,2,0),'G2':(1,1,2),'G3':(2,0,1),'G4':(1,2,2)}
SUP={'T1':['L1','L2','L4'],'T2':['T1','P3','I3'],'T3':['T1','T4','P1'],'T4':['L2','L3','I2'],'S1':['I1','T1','G2'],'S2':['S1','T1','G1'],'S3':['S1','P3','S2'],'S4':['S2','P4','I1'],'P1':['T1','T4','I2'],'P2':['T2','I3','T3'],'P3':['T2','I2','T4'],'P4':['P1','S4','G4'],'I1':['L1','L4','G2'],'I2':['T1','P1','L4'],'I3':['T2','P3','G1'],'I4':['T3','S3','S2'],'L1':['G3','L2','G4'],'L2':['L1','T4','L4'],'L3':['L2','T4','G4'],'L4':['L1','L2','G3'],'G1':['L1','T1','G4'],'G2':['G1','S1','G3'],'G3':['L1','G2','L2'],'G4':['L1','L3','G1']}
ENG={'Adaptive Teaching':['T2','P3','I3'],'Self-Directed AI':['S2','S3','I4'],'Collective Teacher':['T3','T4','L2'],'School Innovation':['L1','L3','L4'],'Trusted AI':['G1','G2','G3'],'Networked Learning':['G4','P4','S4']}
PROFILES={'Technology-Ready':{'I1','I2'},'Collaborative Teaching':{'T1','T4'},'Student-Centred':{'S1','S2'},'Strategically Led':{'L1','L4'}}
STRATEGIES=['Random','Technology-first','Teacher-first','Student-first','Governance-first','Engine-focused','Adaptive']
ALL=list(COST)
EVENTS=list(range(1,25))
# 2026 locked event effects; returns delta budget, delta actions, discount map, adoption penalty map, outcome direct bonus

def event_effect(e, owned, rng):
 b=0; a=0; disc={}; pen={}; impact=0; agency=0; trust=0
 def sale(keys,n):
  for k in keys: disc[k]=max(disc.get(k,0),n)
 def shock(keys,n):
  for k in keys: pen[k]=pen.get(k,0)+n
 if e==1: sale(['I4','I3','P3'],2); a+=('I2'in owned)
 elif e==2: sale(['T1','T2','T3'],2); a+=('L2'in owned)
 elif e==3: sale(['S1','S2','G2'],1); agency-= 0 if 'S2'in owned else 2
 elif e==4: sale(['G1'],2); shock(['I3','I4'],0 if 'G1'in owned else 20)
 elif e==5: sale(['I1','I2'],2); b+=1
 elif e==6: a+= -1 + int('L1'in owned and 'I3'in owned); b+=int('L1'in owned and 'I3'in owned)
 elif e==7: sale(['G2','S3','P2'],1); shock(['S1','S2','S3','S4'],0 if 'G2'in owned else 10)
 elif e==8: sale(['I4','G1'],2); a+=int('G1'in owned)
 elif e==9: sale(['I4','S4'],2); shock(['I4'],20 if not {'G1','T3'}<=owned else 0) # original OR condition: if either missing
 elif e==10: sale(['I3','I4','S4'],2)
 elif e==11: shock(['I2','I3','I4'],10 if 'L4'in owned else 20)
 elif e==12: shock(['I4','S4'],10 if {'G1','S2'}<=owned else 30)
 elif e==13: sale(['I3','T2'],2); impact+=2 if {'I3','T2'}<=owned else 0
 elif e==14: shock(['I2','I3','I4'],0 if {'G1','L4'}<=owned else (10 if 'G1'in owned else 20))
 elif e==15: a-=int('L4'not in owned); shock(['T3','P2','P3'],20)
 elif e==16: shock(['S4','I4'],0 if {'G3','G1'}<=owned else (10 if 'G3'in owned else 20))
 elif e==17: shock(['T4','L2'],10 if {'T4','L2'}<=owned else 20)
 elif e==18: b+= -1 if 'L1'in owned else -2
 elif e==19: shock(['I2','I4'],10 if {'L4','P1'}<=owned else 30)
 elif e==20: agency-=0 if 'G2'in owned else 3; sale(['I1','G2'],2)
 elif e==21: sale(['T2','P3','L3'],1); a+=int('L3'in owned); impact+=2 if {'T2','P3'}<=owned else 0
 elif e==22: sale(['T4','L2'],2); a+=int('G4'in owned)
 elif e==23: sale(['G4','P4','I3'],1); b+=2 if {'G4','L3'}<=owned else 0
 elif e==24: sale(['L3','S4','P4'],2); a+=int('L3'in owned)
 return b,a,disc,pen,impact,agency,trust

def adop(owned,pen,boost):
 return {k:max(10,min(100,40+20*sum(t in owned for t in SUP[k])+boost.get(k,0)-pen.get(k,0))) for k in owned}
def active_eng(owned,ads):return {e for e,req in ENG.items() if all(k in owned and ads[k]>=70 for k in req)}
def cap_and_score(owned,ads,perm):
 cap=[perm[i]+sum(CAP[k][i]*ads[k]/100 for k in owned) for i in range(3)]
 score=min(cap)+sum(cap)/6
 return cap,score

def desirability(k,owned,strategy,year,disc,cash,actions,rng):
 c=max(1,COST[k]-disc.get(k,0)); early=7-year
 if strategy=='Random':return rng.random()
 favored={'Technology-first':'I','Teacher-first':'T','Student-first':'S','Governance-first':'G'}
 # Fast heuristic: capability, adoption support, and proximity to engines.
 basecap=CAP[k]
 capvalue=(min(basecap)*0.6+sum(basecap)*0.16)
 supportgain=sum(k in SUP[x] for x in owned)*0.35
 synergy=0
 unlocked=0
 for req in ENG.values():
  if k not in req:continue
  missing=sum(x not in owned for x in req)
  synergy += (3.0 if missing==1 else 1.2 if missing==2 else 0.35)
  if missing==1:unlocked+=1
 near_support=sum(x in SUP[k] for x in owned)*0.35
 val=capvalue+supportgain+synergy+near_support-0.32*c
 if strategy in favored:val+= 2.8 if k.startswith(favored[strategy]) else 0
 if strategy=='Engine-focused':val+=1.8*synergy+1.5*unlocked
 if strategy=='Adaptive':val+=(early/6)*(0.6*synergy+1.2*unlocked)+0.2*supportgain
 val+=rng.uniform(-0.16,0.16)
 return val

def simulate(profile,strategy,seed):
 rng=random.Random(seed); owned=set(PROFILES[profile]);perm=[0.,0.,0.]; boost={};budgets=[]; year_scores=[];engine_hist=[];event_hist=[]; purchased=[]; direct_imp=0;agency=0;trust=0; innovation=0; event=0; cumscore=0; first_engine=None; eng_count=collections.Counter(); agency_gain=0; trust_gain=0; total_discount=0; total_event_penalty=0; boosts=collections.Counter()
 for yr in range(1,6):
  ev=event_effect(event,owned,rng) if event else (0,0,{}, {},0,0,0)
  b,a,disc,pen,im,ag,tr=ev
  event_hist.append(event);direct_imp+=im;agency+=ag;trust+=tr; total_event_penalty+=sum(pen.values())
  prev_eng=active_eng(owned,adop(owned,pen,boost));budget=max(0,8+b+(2 if 'School Innovation' in prev_eng else 0)); actions=max(2,min(4,3+a));budgets.append(budget)
  for _ in range(actions):
   opts=[k for k in ALL if k not in owned and max(1,COST[k]-disc.get(k,0))<=budget]
   if not opts:break
   if strategy=='Random':k=rng.choice(opts)
   else:k=max(opts,key=lambda k:desirability(k,owned,strategy,yr,disc,budget,actions,rng))
   price=max(1,COST[k]-disc.get(k,0));total_discount+=COST[k]-price;budget-=price;owned.add(k);purchased.append(k)
  ads=adop(owned,pen,boost);eng=active_eng(owned,ads);engine_hist.append(len(eng))
  for e in eng:eng_count[e]+=1
  if eng and first_engine is None:first_engine=yr
  # engine rewards year end, governance against risk is accounted next year as lessening relevant penalties
  if 'Adaptive Teaching'in eng:perm[1]+=1; direct_imp+=2
  if 'Self-Directed AI'in eng:perm[2]+=1;agency+=2;agency_gain+=2
  if 'Collective Teacher'in eng:
   perm[1]+=1
   choices=[k for k in owned if k.startswith('T') or k.startswith('P')]
   if choices:
    dest=min(choices,key=lambda x:ads[x]);boost[dest]=min(60,boost.get(dest,0)+10);boosts[dest]+=10
  if 'School Innovation'in eng:innovation+=1
  if 'Trusted AI'in eng:trust+=2;trust_gain+=2
  if 'Networked Learning'in eng:perm[0]+=1
  # score evaluated after annual improvement (avoids engine reward being deferred to next round)
  cap,raw=cap_and_score(owned,adop(owned,pen,boost),perm)
  # Annual bonus integral: impact points, agency and trust add small bounded linear terms.
  annual=raw + 0.5*im + (2 if 'Adaptive Teaching'in eng else 0) + 0.25*(agency_gain+ag) + 0.12*(trust_gain+tr)
  year_scores.append(annual);cumscore+=annual
  event=rng.choice([e for e in EVENTS if e not in event_hist]) if yr<5 else 0
 finalads=adop(owned,{},boost);finalcap,finalbase=cap_and_score(owned,finalads,perm)
 return dict(profile=profile,strategy=strategy,seed=seed,score=cumscore,final_engines=len(active_eng(owned,finalads)),active_end=engine_hist[-1],engine_years=sum(engine_hist),first_engine=first_engine or 6,owned=len(owned),spent=sum(COST[k] for k in purchased),capS=finalcap[0],capM=finalcap[1],capA=finalcap[2],balance=min(finalcap)/max(finalcap),events=event_hist[1:],engine_hist=engine_hist,year_scores=year_scores,eng_count=dict(eng_count),purchased=purchased,budgets=budgets,event_penalty=total_event_penalty,discount_saved=total_discount)

