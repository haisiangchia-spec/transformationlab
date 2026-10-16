import { CARDS } from "../data/cards";
import { adoption } from "./adoption";
import { activeEngines } from "./synergies";
import type { CardId, CardValues, RoundRecord } from "./types";
export const CLASSIFIER_VERSION = "evidence-v1";
export const PLAYSTYLES = [
  { id: "Random", label: "Exploratory Investor" },
  { id: "Technology-first", label: "Technology Enthusiast" },
  { id: "Teacher-first", label: "Teacher-First Leader" },
  { id: "Student-first", label: "Student-Centred Leader" },
  { id: "Governance-first", label: "Risk-Averse Leader" },
  { id: "Engine-focused", label: "Synergy Optimiser" },
  { id: "Adaptive", label: "Adaptive Strategist" },
] as const;
export type PlaystyleId = (typeof PLAYSTYLES)[number]["id"];
export type EvidenceScores = Record<PlaystyleId, number>;
const fraction = (n: number, d: number) => (d === 0 ? 0 : n / d);
/** Fixed catalogue order resolves equal unrounded scores; no confidence semantics. */
export function choosePlaystyle(scores: EvidenceScores): PlaystyleId {
  const highest = Math.max(...PLAYSTYLES.map((p) => scores[p.id]));
  return PLAYSTYLES.find((p) => highest - scores[p.id] <= 1e-12)!.id;
}
/** Report-only evidence rubric. Full definitions: docs/CLASSIFICATION.md. */
export function classify(history: readonly RoundRecord[]) {
  const spend: Record<string, number> = { T: 0, S: 0, P: 0, I: 0, L: 0, G: 0 };
  let purchases = 0,
    linked = 0,
    instrumental = 0,
    eventPurchases = 0,
    discounted = 0,
    earlyTechnology = 0,
    technologyPurchases = 0,
    shifts = 0,
    shiftYears = 0;
  let previousSpend: Record<string, number> | null = null;
  let boosts: CardValues = {};
  for (const round of history) {
    const annual: Record<string, number> = {
      T: 0,
      S: 0,
      P: 0,
      I: 0,
      L: 0,
      G: 0,
    };
    for (const id of round.purchased) {
      const card = CARDS.find((c) => c.id === id)!;
      const cost = Math.max(1, card.cost - (round.effects.discounts[id] ?? 0));
      spend[id[0]!]! += cost;
      annual[id[0]!]! += cost;
      purchases++;
      if (
        card.supporters.some((s) => round.owned.includes(s)) ||
        CARDS.some(
          (c) =>
            c.id !== id &&
            round.owned.includes(c.id) &&
            (c.supporters as readonly CardId[]).includes(id),
        )
      )
        linked++;
      const without = round.owned.filter((c) => c !== id);
      const remainingActive = activeEngines(
        without,
        adoption(without, boosts, round.effects.penalties),
      );
      if (round.activeEngines.some((e) => !remainingActive.includes(e)))
        instrumental++;
      if (id.startsWith("I")) {
        technologyPurchases++;
        earlyTechnology += (6 - round.round) / 5;
      }
      if (round.event) {
        eventPurchases++;
        if (cost < card.cost) discounted++;
      }
    }
    const total = Object.values(annual).reduce((a, b) => a + b, 0);
    const previousTotal = previousSpend
      ? Object.values(previousSpend).reduce((a, b) => a + b, 0)
      : 0;
    if (round.event && total > 0 && previousTotal > 0 && previousSpend) {
      shifts +=
        Object.keys(spend).reduce(
          (n, c) =>
            n +
            Math.abs(annual[c]! / total - previousSpend![c]! / previousTotal),
          0,
        ) / 2;
      shiftYears++;
    }
    previousSpend = annual;
    boosts = round.boosts;
  }
  const totalSpent = Object.values(spend).reduce((a, b) => a + b, 0);
  const activeYears = (id: string) =>
    history.filter((r) => (r.activeEngines as readonly string[]).includes(id))
      .length;
  const engineYearShare = (id: string) =>
    fraction(activeYears(id), history.length);
  const features = {
    purchases,
    totalSpent,
    spend,
    linked,
    instrumental,
    eventPurchases,
    discounted,
    linkedShare: fraction(linked, purchases),
    instrumentalShare: fraction(instrumental, purchases),
    earlyTechnology: fraction(earlyTechnology, technologyPurchases),
    eventAlignedShare: fraction(discounted, eventPurchases),
    categoryShift: fraction(shifts, shiftYears),
    teacherEngineYears: activeYears("Collective Teacher"),
    studentEngineYears: activeYears("Self-Directed AI"),
    trustEngineYears: activeYears("Trusted AI"),
  };
  const scores: EvidenceScores = {
    Random: 0,
    "Technology-first":
      0.8 * fraction(spend.I!, totalSpent) + 0.2 * features.earlyTechnology,
    "Teacher-first":
      0.8 * fraction(spend.T!, totalSpent) +
      0.2 * engineYearShare("Collective Teacher"),
    "Student-first":
      0.8 * fraction(spend.S!, totalSpent) +
      0.2 * engineYearShare("Self-Directed AI"),
    "Governance-first":
      0.8 * fraction(spend.G!, totalSpent) +
      0.2 * engineYearShare("Trusted AI"),
    "Engine-focused":
      0.35 * features.linkedShare + 0.65 * features.instrumentalShare,
    Adaptive: 0.75 * features.eventAlignedShare + 0.25 * features.categoryShift,
  };
  scores.Random = purchases ? 1 - Math.max(...Object.values(scores)) : 0;
  const id = choosePlaystyle(scores);
  return {
    version: CLASSIFIER_VERSION,
    id,
    label: PLAYSTYLES.find((p) => p.id === id)!.label,
    scores,
    features,
    evidenceAvailable: purchases > 0,
  };
}
