import { describe, it, expect } from "vitest";
import {
  classify,
  choosePlaystyle,
  PLAYSTYLES,
  type EvidenceScores,
} from "../src/engine/classification";
import {
  CARDS,
  createGame,
  endRound,
  confirmPlan,
  type CardId,
  type RoundRecord,
} from "../src/engine";
const scores = (): EvidenceScores =>
  Object.fromEntries(PLAYSTYLES.map((p) => [p.id, 0])) as EvidenceScores;
function purchased(ids: CardId[]) {
  return endRound(confirmPlan(createGame("Technology-Ready", 1), ids)).history;
}
describe("approved evidence-v1 playstyle rubric", () => {
  it.each([
    [["I1", "I3"], "Technology-first"],
    [["T1", "T2", "T3"], "Teacher-first"],
    [["S1", "S2", "S3"], "Student-first"],
    [["G1", "G2", "G3"], "Governance-first"],
  ] as const)("category investment %j produces %s", (ids, label) => {
    // Technology profile already owns I1, so use strategic starting cards for this case.
    const game = createGame(
      label === "Technology-first" ? "Strategically Led" : "Technology-Ready",
      1,
    );
    expect(classify(endRound(confirmPlan(game, ids)).history).id).toBe(label);
  });
  it("labels an engine-essential purchase pattern as Synergy Optimiser", () => {
    const all = CARDS.map((c) => c.id),
      base = createGame("Technology-Ready", 1);
    const record = endRound({
      ...base,
      owned: all,
      purchased: ["T2", "P3", "I3"],
    }).history[0]!;
    const c = classify([record]);
    expect(c.id).toBe("Engine-focused");
    expect(c.features.instrumental).toBe(3);
    expect(c.features.linked).toBe(3);
    expect(c.scores["Engine-focused"]).toBe(1);
  });
  it("labels discounted event-year purchases plus category reallocation as Adaptive", () => {
    let seed = 0;
    while (endRound(createGame("Technology-Ready", seed)).event !== "E02")
      seed++;
    let game = confirmPlan(createGame("Technology-Ready", seed), ["G3"]);
    game = endRound(game);
    game = confirmPlan(game, ["T1", "T2", "T3"]);
    game = endRound(game);
    const c = classify(game.history);
    expect(c.id).toBe("Adaptive");
    expect(c.features.discounted).toBe(3);
    expect(c.features.categoryShift).toBe(1);
    expect(c.scores.Adaptive).toBe(1);
  });
  it("states insufficient evidence for no investments, retaining canonical Random key", () => {
    const c = classify(endRound(createGame("Technology-Ready", 0)).history);
    expect(c.id).toBe("Random");
    expect(c.label).toBe("Exploratory Investor");
    expect(c.evidenceAvailable).toBe(false);
    expect(Object.values(c.scores)).toEqual(Array(7).fill(0));
  });
  it("includes free starting cards as supporters but excludes their prices from spending", () => {
    const c = classify(purchased(["P1"]));
    expect(c.features.totalSpent).toBe(2);
    expect(c.features.spend.I).toBe(0);
    expect(c.features.linked).toBe(1);
  });
  it("is independent of within-year plan ordering, deterministic, finite and immutable", () => {
    const history = purchased(["T1", "T2", "T3"]);
    const before = JSON.stringify(history);
    const c = classify(history);
    const reordered = structuredClone(history) as RoundRecord[];
    reordered[0]!.purchased = [...reordered[0]!.purchased].reverse();
    expect(classify(reordered)).toEqual(c);
    expect(classify(history)).toEqual(c);
    expect(JSON.stringify(history)).toBe(before);
    Object.values(c.scores).forEach((score) => {
      expect(Number.isFinite(score)).toBe(true);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
  it("resolves exact and floating-point ties by documented canonical order, never rounded display", () => {
    const s = scores();
    s["Technology-first"] = 0.5;
    s["Teacher-first"] = 0.5;
    expect(choosePlaystyle(s)).toBe("Technology-first");
    s["Teacher-first"] += 1e-13;
    expect(choosePlaystyle(s)).toBe("Technology-first");
    s["Teacher-first"] += 0.001;
    expect(choosePlaystyle(s)).toBe("Teacher-first");
  });
  it("resolves near-tie chains relative to the global maximum", () => {
    const s = scores();
    s["Technology-first"] = 0.5;
    s["Teacher-first"] = 0.5 + 0.9e-12;
    s["Student-first"] = 0.5 + 1.8e-12;
    expect(choosePlaystyle(s)).toBe("Teacher-first");
  });
  it.each(PLAYSTYLES)(
    "can select canonical $id and has no confidence field",
    (p) => {
      const s = scores();
      s[p.id] = 1;
      expect(choosePlaystyle(s)).toBe(p.id);
      expect(classify([])).not.toHaveProperty("confidence");
    },
  );
});
