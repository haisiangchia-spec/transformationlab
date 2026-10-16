import {
  CARDS,
  ENGINES,
  EVENTS,
  type Capability,
  type CardId,
  type EngineId,
} from "../engine";
import { classify } from "../engine/classification";
import { replay, type Session } from "../ui/session";
export const DIMENSIONS = ["sensing", "modelling", "acting"] as const;
export function chartScale(values: readonly Capability[]) {
  const max = Math.max(
    1,
    ...values.flatMap((c) => DIMENSIONS.map((d) => c[d])),
  );
  const rough = max / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10]
    .map((n) => n * magnitude)
    .find((n) => n >= rough)!;
  const upper = Math.ceil(max / step) * step;
  return {
    upper,
    ticks: Array.from(
      { length: Math.round(upper / step) + 1 },
      (_, i) => i * step,
    ),
  };
}
export function buildReport(session: Session) {
  const state = replay(session);
  if (state.phase !== "complete" || state.history.length !== 5)
    throw new Error("A final report requires five completed years");
  const rounds = state.history;
  const final = rounds[4]!; // Preserve Year-5 penalties and rewarding engine set.
  const purchased = rounds.flatMap((r) => r.purchased);
  const spending = Object.fromEntries(
    ["T", "S", "P", "I", "L", "G"].map((c) => [c, 0]),
  ) as Record<string, number>;
  for (const r of rounds)
    for (const id of r.purchased) {
      const c = CARDS.find((c) => c.id === id)!;
      spending[id[0]!]! += Math.max(1, c.cost - (r.effects.discounts[id] ?? 0));
    }
  const engines = ENGINES.map((engine) => {
    const years = rounds
      .filter((r) => r.activeEngines.includes(engine.id))
      .map((r) => r.round);
    return {
      ...engine,
      years,
      activeInFinalYear: final.activeEngines.includes(engine.id),
      requirementsStatus: engine.requirements.map((id) => ({
        id,
        owned: final.owned.includes(id),
        adoption: final.adoption[id] ?? null,
      })),
    };
  });
  const eventHistory = rounds
    .filter((r) => r.event !== null)
    .map((r) => ({
      round: r.round,
      event: EVENTS.find((e) => e.id === r.event)!,
      effects: r.effects,
    }));
  const engineYears = engines.reduce((n, e) => n + e.years.length, 0);
  const bestYear = rounds.reduce(
    (best, r) => (r.annualScore > best.annualScore ? r : best),
    rounds[0]!,
  );
  const lowestDimension = DIMENSIONS.reduce(
    (low, d) => (final.capabilities[d] < final.capabilities[low] ? d : low),
    "sensing",
  );
  const firstEngineYear =
    rounds.find((r) => r.activeEngines.length)?.round ?? null;
  const finalActive = engines.filter((e) => e.activeInFinalYear);
  const candidates = engines
    .filter((e) => !e.activeInFinalYear)
    .map((e) => ({
      engine: e,
      ready: e.requirementsStatus.filter((r) => r.owned && r.adoption! >= 70)
        .length,
      owned: e.requirementsStatus.filter((r) => r.owned).length,
    }));
  candidates.sort(
    (a, b) =>
      b.ready - a.ready ||
      b.owned - a.owned ||
      ENGINES.findIndex((e) => e.id === a.engine.id) -
        ENGINES.findIndex((e) => e.id === b.engine.id),
  );
  const nextEngine = candidates[0]?.engine ?? null;
  const ownedCards = final.owned.map((id) => ({
    id,
    name: CARDS.find((c) => c.id === id)!.name,
    adoption: final.adoption[id]!,
    persistentBoost: final.boosts[id] ?? 0,
    penalty: final.effects.penalties[id] ?? 0,
  }));
  return {
    profile: state.profile,
    seed: session.seed,
    totalScore: state.score,
    classification: classify(rounds),
    rounds: structuredClone(rounds),
    finalCapabilities: { ...final.capabilities },
    permanent: { ...final.permanent },
    agency: final.agency,
    trust: final.trust,
    spending,
    purchased: [...purchased],
    ownedCards,
    engines,
    finalActive,
    eventHistory,
    engineYears,
    firstEngineYear,
    bestYear: bestYear.round,
    lowestDimension,
    nextEngine,
  };
}
export type Report = ReturnType<typeof buildReport>;
export function engineName(id: EngineId) {
  return ENGINES.find((e) => e.id === id)!.name;
}
export function cardName(id: CardId) {
  return CARDS.find((c) => c.id === id)!.name;
}
