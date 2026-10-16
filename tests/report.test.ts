import { describe, it, expect } from "vitest";
import { adoption, capabilities } from "../src/engine";
import { buildReport, chartScale } from "../src/report/model";
import { reportJSON } from "../src/report/export";
import { finishYear, newSession, replay } from "../src/ui/session";
function completed() {
  let s = newSession("Strategically Led", 123);
  s = finishYear(s, ["T1", "G3"]);
  for (let i = 0; i < 4; i++) s = finishYear(s, []);
  return s;
}
describe("final reporting and export", () => {
  it("requires a completed five-year journey", () =>
    expect(() => buildReport(newSession("random", 0))).toThrow(
      "five completed",
    ));
  it("uses the recorded final scoring snapshot, without clearing event penalties or awarding again", () => {
    const session = completed(),
      state = replay(session),
      before = JSON.stringify(session),
      r = buildReport(session),
      final = state.history[4]!;
    expect(r.finalCapabilities).toEqual(final.capabilities);
    expect(r.permanent).toEqual(final.permanent);
    expect(r.rounds).toEqual(state.history);
    expect(r.totalScore).toBe(state.score);
    expect(r.finalActive.map((e) => e.id)).toEqual(final.activeEngines);
    expect(r.agency).toBe(final.agency);
    expect(r.trust).toBe(final.trust);
    expect(r.eventHistory).toHaveLength(4);
    expect(r.rounds[4]!.drawnEvent).toBeNull();
    expect(JSON.stringify(session)).toBe(before);
  });
  it("retains an actual Year-5 adoption shock in the final chart and inventory", () => {
    let session = newSession("Technology-Ready", 0);
    for (let seed = 0; seed < 500; seed++) {
      session = newSession("Technology-Ready", seed);
      for (let i = 0; i < 5; i++) session = finishYear(session, []);
      if (replay(session).history[4]!.effects.penalties.I2! > 0) break;
    }
    const state = replay(session),
      report = buildReport(session);
    expect(state.history[4]!.effects.penalties.I2).toBeGreaterThan(0);
    const clean = capabilities(
      state.owned,
      adoption(state.owned, state.boosts, {}),
      state.permanent,
    );
    expect(report.finalCapabilities).not.toEqual(clean);
    expect(
      report.ownedCards.find((c) => c.id === "I2")!.penalty,
    ).toBeGreaterThan(0);
  });
  it("keeps annual and cumulative scores distinct and counts real adjusted spending, not free cards", () => {
    const r = buildReport(completed());
    expect(r.purchased).toEqual(["T1", "G3"]);
    expect(r.spending.T).toBe(2);
    expect(r.spending.G).toBe(2);
    expect(r.spending.L).toBe(0);
    expect(r.totalScore).toBeCloseTo(
      r.rounds.reduce((n, r) => n + r.annualScore, 0),
    );
    expect(r.bestYear).toBeGreaterThanOrEqual(1);
    expect(r.bestYear).toBeLessThanOrEqual(5);
    expect(r.ownedCards.map((c) => c.id)).toEqual(["L1", "L4", "T1", "G3"]);
  });
  it("exports stable full-precision data and replayable commands with rubric provenance", () => {
    const session = completed();
    const text = reportJSON(session),
      copy = JSON.parse(text);
    expect(reportJSON(session)).toBe(text);
    expect(copy.schemaVersion).toBe(1);
    expect(copy.rulesVersion).toBe("1.0");
    expect(copy.session).toEqual(session);
    expect(copy.report).toEqual(buildReport(session));
    expect(copy.report.classification.version).toBe("evidence-v1");
    expect(copy.report.totalScore).toBe(replay(copy.session).score);
    expect(text).not.toContain("confidence");
  });
  it("returned snapshots do not mutate session results", () => {
    const session = completed(),
      r = buildReport(session);
    r.rounds[0]!.capabilities.sensing = 999;
    expect(buildReport(session).rounds[0]!.capabilities.sensing).not.toBe(999);
  });
  it.each([0, 0.2, 1, 17, 100, 125, 1000])(
    "chart scale includes raw maximum %s without a 100 cap",
    (n) => {
      const scale = chartScale([
        { sensing: n, modelling: n / 2, acting: n / 3 },
      ]);
      expect(scale.upper).toBeGreaterThanOrEqual(n);
      expect(scale.upper).toBeGreaterThan(0);
      expect(scale.ticks[0]).toBe(0);
      expect(scale.ticks.at(-1)).toBe(scale.upper);
      if (n > 100) expect(scale.upper).toBeGreaterThan(100);
    },
  );
});
