"""Independent golden fixtures from supplied simulator. Run from repository root.
Only approved differences: opening-owned shock targets and canonical boost ties.
No third-party Python packages required; heuristic policies are not imported.
"""
import ast
import json
import random
from pathlib import Path
source = Path('docs/handoff/references/simulate_school_5round_I4S3.py').read_text()
tree = ast.parse(source)
allowed = {'COST','CAP','SUP','ENG','PROFILES'}
nodes = [n for n in tree.body if (isinstance(n, ast.Assign) and any(isinstance(t,ast.Name) and t.id in allowed for t in n.targets)) or (isinstance(n,ast.FunctionDef) and n.name in {'event_effect','adop','active_eng','cap_and_score'})]
ns = {}
exec(compile(ast.Module(body=nodes,type_ignores=[]),'<reference>','exec'),ns)
COST,CAP,SUP,ENG,PROFILES = [ns[k] for k in ['COST','CAP','SUP','ENG','PROFILES']]
records=[]
for profile,starting in PROFILES.items():
 for seed in range(10):
  rng=random.Random(seed); owned=set(starting); perm=[0,0,0];boost={};agency=trust=score=0; event=0; deck=list(range(1,25)); rounds=[]
  for year in range(1,6):
   b,a,disc,pen,im,ag,tr=ns['event_effect'](event,owned,rng)
   pen={k:v for k,v in pen.items() if k in owned}
   active=ns['active_eng'](owned,ns['adop'](owned,pen,boost))
   budget=max(0,8+b+(2 if 'School Innovation' in active else 0)); opening=budget; actions=max(2,min(4,3+a));purchased=[]
   for _ in range(actions):
    options=[k for k in COST if k not in owned and max(1,COST[k]-disc.get(k,0))<=budget]
    if not options:break
    k=rng.choice(options);purchased.append(k);owned.add(k);budget-=max(1,COST[k]-disc.get(k,0))
   ads=ns['adop'](owned,pen,boost); active=ns['active_eng'](owned,ads)
   if 'Adaptive Teaching' in active:perm[1]+=1
   if 'Self-Directed AI' in active:perm[2]+=1;agency+=2
   if 'Collective Teacher' in active:
    perm[1]+=1; dest=min((k for k in owned if k[0] in 'TP'),key=lambda k:(ads[k],k));boost[dest]=min(60,boost.get(dest,0)+10)
   if 'Trusted AI' in active:trust+=2
   if 'Networked Learning' in active:perm[0]+=1
   ads=ns['adop'](owned,pen,boost);cap,raw=ns['cap_and_score'](owned,ads,perm)
   annual=raw+0.5*im+(2 if 'Adaptive Teaching' in active else 0)+0.25*(agency+ag)+0.12*(trust+tr);score+=annual
   drawn=rng.choice(deck) if year<5 else 0
   if drawn:deck.remove(drawn)
   rounds.append(dict(event=f'E{event:02}' if event else None,purchased=purchased,cap=cap,annual=annual,score=score,adoption=ads,active=sorted(active),opening=opening,budget=budget,actions=actions,drawn=f'E{drawn:02}' if drawn else None))
   event=drawn
  records.append(dict(profile=profile,seed=seed,rounds=rounds))
Path('tests/fixtures/reference.json').write_text(json.dumps(dict(cost=COST,cap=CAP,supporters=SUP,games=records),indent=2)+'\n')
