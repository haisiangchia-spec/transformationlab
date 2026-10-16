/* Locked v1.0 handoff data. Do not derive values from UI references. */
export const EVENTS = [
  {
    "id": "E01",
    "name": "MOE Expands AI-Enabled Tools",
    "type": "Opportunity",
    "description": "New centrally provided AI education features, including tools in SLS, reduce implementation costs.",
    "next_year_effect": "I4, I3, P3: −2 each; if I2 owned, +1 investment action."
  },
  {
    "id": "E02",
    "name": "National Teacher AI Upskilling Initiative",
    "type": "Opportunity",
    "description": "Hypothetical national training and implementation support.",
    "next_year_effect": "T1, T2, T3: −2 each; if L2 owned, +1 investment action."
  },
  {
    "id": "E03",
    "name": "Updated AI Literacy Curriculum",
    "type": "Mixed",
    "description": "MOE strengthens student AI literacy and responsible AI expectations.",
    "next_year_effect": "S1, S2, G2: −1 each; if S2 absent, Student Agency event adjustment −2."
  },
  {
    "id": "E04",
    "name": "New Responsible AI Guidelines",
    "type": "Mixed",
    "description": "New governance expectations increase the importance of safe adoption.",
    "next_year_effect": "G1: −2; if G1 absent, I3 and I4 adoption −20 pp."
  },
  {
    "id": "E05",
    "name": "National Digital Learning Infrastructure Refresh",
    "type": "Opportunity",
    "description": "Hypothetical device/connectivity refresh.",
    "next_year_effect": "I1, I2: −2 each; next-year budget +1 (rebalanced from +2)."
  },
  {
    "id": "E06",
    "name": "MOE Requests an EdTech Implementation Review",
    "type": "Mixed",
    "description": "School must document implementation progress and learning outcomes.",
    "next_year_effect": "−1 action; if BOTH L1 and I3 owned, restore 1 action and add +1 budget (rebalanced from +2)."
  },
  {
    "id": "E07",
    "name": "MOE Inclusion and Well-Being Priority",
    "type": "Mixed",
    "description": "Heightened emphasis on inclusion, well-being and digital development.",
    "next_year_effect": "G2, S3, P2: −1 each; if G2 absent, S1–S4 adoption −10 pp."
  },
  {
    "id": "E08",
    "name": "GovTech Secure AI Services Expansion",
    "type": "Opportunity",
    "description": "Hypothetical school-relevant expansion of secure government AI services; not a claim of current school availability.",
    "next_year_effect": "I4, G1: −2 each; if G1 owned, +1 action."
  },
  {
    "id": "E09",
    "name": "Breakthrough in Agentic AI",
    "type": "Mixed",
    "description": "Rapid improvement in multi-step AI agents creates both possibilities and oversight challenges.",
    "next_year_effect": "I4, S4: −2 each; if EITHER G1 or T3 absent, I4 adoption −20 pp."
  },
  {
    "id": "E10",
    "name": "AI Computing Costs Collapse",
    "type": "Opportunity",
    "description": "Cheaper computing and accessible models reduce implementation costs.",
    "next_year_effect": "I3, I4, S4: −2 each."
  },
  {
    "id": "E11",
    "name": "Major Technology Platform Overhaul",
    "type": "Risk",
    "description": "Major system upgrade causes retraining and workflow disruption.",
    "next_year_effect": "I2, I3, I4 adoption −20 pp; −10 pp instead if L4 owned."
  },
  {
    "id": "E12",
    "name": "AI Dangers Controversy",
    "type": "Risk",
    "description": "Public concern over inaccurate outputs and relational/affective risks of relational AI, including emotional dependency, attachment, manipulation and displacement of human relationships.",
    "next_year_effect": "I4, S4 adoption −30 pp; −10 pp instead if BOTH G1 and S2 owned."
  },
  {
    "id": "E13",
    "name": "Breakthrough in Learning Analytics",
    "type": "Opportunity",
    "description": "New analytical capabilities improve diagnosis of learning needs.",
    "next_year_effect": "I3, T2: −2 each; if BOTH I3 and T2 owned, +2 event Learning Impact."
  },
  {
    "id": "E14",
    "name": "Major Cybersecurity Vulnerability",
    "type": "Risk",
    "description": "A vulnerability affects digital education services.",
    "next_year_effect": "I2, I3, I4 adoption −20 pp; −10 pp if G1; 0 pp if BOTH G1 and L4."
  },
  {
    "id": "E15",
    "name": "Teacher Workload Crisis",
    "type": "Risk",
    "description": "Heavy workloads constrain teacher capacity to implement change.",
    "next_year_effect": "−1 action unless L4 owned; T3, P2, P3 adoption −20 pp regardless."
  },
  {
    "id": "E16",
    "name": "Parent Backlash Against AI",
    "type": "Risk",
    "description": "Parents worry about AI replacing thinking and meaningful human interaction.",
    "next_year_effect": "S4, I4 adoption −20 pp; −10 pp if G3; 0 pp if BOTH G3 and G1."
  },
  {
    "id": "E17",
    "name": "Change of School Leadership & Departure of Teacher Champions",
    "type": "Risk",
    "description": "Leadership turnover and movement of influential teachers disrupt momentum, direction and shared practice.",
    "next_year_effect": "T4, L2 adoption −20 pp; −10 pp instead if BOTH T4 and L2 owned."
  },
  {
    "id": "E18",
    "name": "Tightening School Budget",
    "type": "Risk",
    "description": "Competing priorities constrain discretionary EdTech funding.",
    "next_year_effect": "Budget −2; budget −1 instead if L1 owned (rebalanced from −3)."
  },
  {
    "id": "E19",
    "name": "Digital Learning Service Disruption",
    "type": "Risk",
    "description": "A prolonged service disruption exposes dependencies.",
    "next_year_effect": "I2, I4 adoption −30 pp; −10 pp instead if BOTH L4 and P1 owned."
  },
  {
    "id": "E20",
    "name": "Widening Student Digital Divide",
    "type": "Mixed",
    "description": "Evidence reveals unequal student access and digital confidence.",
    "next_year_effect": "If G2 absent, Student Agency event adjustment −3; I1 and G2: −2 each."
  },
  {
    "id": "E21",
    "name": "HQ-School Research Collaboration",
    "type": "Opportunity",
    "description": "MOE Headquarters–school research collaboration may include Rapid Research, design-based research, implementation studies or longer-term work.",
    "next_year_effect": "T2, P3, L3: −1 each; if L3 owned, +1 action; if BOTH T2 and P3 owned, +2 event Learning Impact."
  },
  {
    "id": "E22",
    "name": "Cluster-Wide Professional Learning Network",
    "type": "Opportunity",
    "description": "Neighbouring schools organise exchanges and implementation workshops.",
    "next_year_effect": "T4, L2: −2 each; if G4 owned, +1 action."
  },
  {
    "id": "E23",
    "name": "University–School AI Research Partnership",
    "type": "Opportunity",
    "description": "Local research collaboration supports evaluation of AI pedagogy.",
    "next_year_effect": "G4, P4, I3: −1 each; if BOTH G4 and L3 owned, +2 budget (rebalanced from +3)."
  },
  {
    "id": "E24",
    "name": "School Innovation Challenge",
    "type": "Opportunity",
    "description": "An innovation challenge encourages piloting and evaluation of new learning approaches.",
    "next_year_effect": "L3, S4, P4: −2 each; if L3 owned, +1 action."
  }
] as const;
