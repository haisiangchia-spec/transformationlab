/* Locked v1.0 handoff data. Do not derive values from UI references. */
export const ENGINES = [
  {
    "id": "Adaptive Teaching",
    "name": "Adaptive Teaching Intelligence",
    "requirements": [
      "T2",
      "P3",
      "I3"
    ],
    "reward": "+1 permanent Modelling per active year; +2 annual Transformation Score while active."
  },
  {
    "id": "Self-Directed AI",
    "name": "Self-Directed AI Learners",
    "requirements": [
      "S2",
      "S3",
      "I4"
    ],
    "reward": "+1 permanent Acting and +2 cumulative Student Agency per active year."
  },
  {
    "id": "Collective Teacher",
    "name": "Collective Teacher Intelligence",
    "requirements": [
      "T3",
      "T4",
      "L2"
    ],
    "reward": "+1 permanent Modelling; +10 pp persistent adoption boost to the lowest-adoption owned Teacher or Pedagogy card per active year (individual boost capped at +60 pp)."
  },
  {
    "id": "School Innovation",
    "name": "School Innovation Engine",
    "requirements": [
      "L1",
      "L3",
      "L4"
    ],
    "reward": "+2 budget at start of the following year while engine is active at that year’s opening evaluation."
  },
  {
    "id": "Trusted AI",
    "name": "Trusted AI Ecosystem",
    "requirements": [
      "G1",
      "G2",
      "G3"
    ],
    "reward": "+2 cumulative Stakeholder Trust per active year; NO additional general 50% AI-risk mitigation in v1.0."
  },
  {
    "id": "Networked Learning",
    "name": "Networked Learning Ecosystem",
    "requirements": [
      "G4",
      "P4",
      "S4"
    ],
    "reward": "+1 permanent Sensing per active year; NO additional event choice in v1.0."
  }
] as const;
