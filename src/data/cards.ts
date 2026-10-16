/* Locked v1.0 handoff data. Do not derive values from UI references. */
export const CARDS = [
  {
    "id": "T1",
    "name": "Foundational EdTech & AI Professional Development",
    "category": "Teacher Professional Capacity",
    "cost": 2,
    "sensing": 0,
    "modelling": 2,
    "acting": 1,
    "supporters": [
      "L1",
      "L2",
      "L4"
    ]
  },
  {
    "id": "T2",
    "name": "Data & Assessment Literacy",
    "category": "Teacher Professional Capacity",
    "cost": 3,
    "sensing": 1,
    "modelling": 3,
    "acting": 0,
    "supporters": [
      "T1",
      "P3",
      "I3"
    ]
  },
  {
    "id": "T3",
    "name": "AI-Enhanced Lesson Design Expertise",
    "category": "Teacher Professional Capacity",
    "cost": 3,
    "sensing": 0,
    "modelling": 3,
    "acting": 2,
    "supporters": [
      "T1",
      "T4",
      "P1"
    ]
  },
  {
    "id": "T4",
    "name": "Professional Learning Communities (PLCs)",
    "category": "Teacher Professional Capacity",
    "cost": 3,
    "sensing": 1,
    "modelling": 2,
    "acting": 2,
    "supporters": [
      "L2",
      "L3",
      "I2"
    ]
  },
  {
    "id": "S1",
    "name": "Digital Literacy Foundations (Find, Think, Apply, Create)",
    "category": "Student Digital & AI Agency",
    "cost": 2,
    "sensing": 1,
    "modelling": 1,
    "acting": 1,
    "supporters": [
      "I1",
      "T1",
      "G2"
    ]
  },
  {
    "id": "S2",
    "name": "AI Literacy & Critical Evaluation",
    "category": "Student Digital & AI Agency",
    "cost": 3,
    "sensing": 1,
    "modelling": 2,
    "acting": 1,
    "supporters": [
      "S1",
      "T1",
      "G1"
    ]
  },
  {
    "id": "S3",
    "name": "Self-Directed Learning & Metacognition",
    "category": "Student Digital & AI Agency",
    "cost": 3,
    "sensing": 1,
    "modelling": 2,
    "acting": 2,
    "supporters": [
      "S1",
      "P3",
      "S2"
    ]
  },
  {
    "id": "S4",
    "name": "AI-Assisted Creation & Collaboration",
    "category": "Student Digital & AI Agency",
    "cost": 3,
    "sensing": 0,
    "modelling": 2,
    "acting": 3,
    "supporters": [
      "S2",
      "P4",
      "I1"
    ]
  },
  {
    "id": "P1",
    "name": "Active & Collaborative e-Pedagogy",
    "category": "Pedagogy & Assessment",
    "cost": 2,
    "sensing": 0,
    "modelling": 1,
    "acting": 2,
    "supporters": [
      "T1",
      "T4",
      "I2"
    ]
  },
  {
    "id": "P2",
    "name": "Differentiated & Personalised Learning",
    "category": "Pedagogy & Assessment",
    "cost": 4,
    "sensing": 1,
    "modelling": 2,
    "acting": 3,
    "supporters": [
      "T2",
      "I3",
      "T3"
    ]
  },
  {
    "id": "P3",
    "name": "Technology-Enhanced Formative Assessment",
    "category": "Pedagogy & Assessment",
    "cost": 3,
    "sensing": 2,
    "modelling": 1,
    "acting": 2,
    "supporters": [
      "T2",
      "I2",
      "T4"
    ]
  },
  {
    "id": "P4",
    "name": "Authentic Learning & 21CC Development",
    "category": "Pedagogy & Assessment",
    "cost": 3,
    "sensing": 1,
    "modelling": 2,
    "acting": 3,
    "supporters": [
      "P1",
      "S4",
      "G4"
    ]
  },
  {
    "id": "I1",
    "name": "Connected Devices & Learning Spaces",
    "category": "Technology & Data Infrastructure",
    "cost": 3,
    "sensing": 1,
    "modelling": 0,
    "acting": 2,
    "supporters": [
      "L1",
      "L4",
      "G2"
    ]
  },
  {
    "id": "I2",
    "name": "Integrated Digital Learning Platform (SLS-centred)",
    "category": "Technology & Data Infrastructure",
    "cost": 3,
    "sensing": 2,
    "modelling": 0,
    "acting": 1,
    "supporters": [
      "T1",
      "P1",
      "L4"
    ]
  },
  {
    "id": "I3",
    "name": "Learning Analytics & Student Insights",
    "category": "Technology & Data Infrastructure",
    "cost": 4,
    "sensing": 3,
    "modelling": 2,
    "acting": 0,
    "supporters": [
      "T2",
      "P3",
      "G1"
    ]
  },
  {
    "id": "I4",
    "name": "AI-Powered Learning & Feedback Tools",
    "category": "Technology & Data Infrastructure",
    "cost": 5,
    "sensing": 1,
    "modelling": 3,
    "acting": 3,
    "supporters": [
      "T3",
      "S3",
      "S2"
    ]
  },
  {
    "id": "L1",
    "name": "Shared EdTech Vision & Strategic Roadmap",
    "category": "School Leadership & Culture",
    "cost": 2,
    "sensing": 1,
    "modelling": 2,
    "acting": 1,
    "supporters": [
      "G3",
      "L2",
      "G4"
    ]
  },
  {
    "id": "L2",
    "name": "Distributed Leadership & Teacher Champions",
    "category": "School Leadership & Culture",
    "cost": 3,
    "sensing": 1,
    "modelling": 2,
    "acting": 2,
    "supporters": [
      "L1",
      "T4",
      "L4"
    ]
  },
  {
    "id": "L3",
    "name": "Innovation & Experimentation Culture",
    "category": "School Leadership & Culture",
    "cost": 3,
    "sensing": 2,
    "modelling": 2,
    "acting": 1,
    "supporters": [
      "L2",
      "T4",
      "G4"
    ]
  },
  {
    "id": "L4",
    "name": "Implementation Capacity & Change Management",
    "category": "School Leadership & Culture",
    "cost": 3,
    "sensing": 1,
    "modelling": 1,
    "acting": 3,
    "supporters": [
      "L1",
      "L2",
      "G3"
    ]
  },
  {
    "id": "G1",
    "name": "AI Ethics, Privacy & Data Governance",
    "category": "Trust, Governance & Partnerships",
    "cost": 3,
    "sensing": 2,
    "modelling": 2,
    "acting": 0,
    "supporters": [
      "L1",
      "T1",
      "G4"
    ]
  },
  {
    "id": "G2",
    "name": "Cyber Wellness & Digital Inclusion",
    "category": "Trust, Governance & Partnerships",
    "cost": 3,
    "sensing": 1,
    "modelling": 1,
    "acting": 2,
    "supporters": [
      "G1",
      "S1",
      "G3"
    ]
  },
  {
    "id": "G3",
    "name": "Parent & Community Engagement",
    "category": "Trust, Governance & Partnerships",
    "cost": 2,
    "sensing": 2,
    "modelling": 0,
    "acting": 1,
    "supporters": [
      "L1",
      "G2",
      "L2"
    ]
  },
  {
    "id": "G4",
    "name": "External Partnerships & Innovation Networks",
    "category": "Trust, Governance & Partnerships",
    "cost": 3,
    "sensing": 1,
    "modelling": 2,
    "acting": 2,
    "supporters": [
      "L1",
      "L3",
      "G1"
    ]
  }
] as const;
