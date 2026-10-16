import { it, expect } from "vitest";
import { finishYear, newSession, readSession, replay } from "../src/ui/session";
it("saves confirmed commands and replays identical state through five years", () => {
  let session = newSession("Strategically Led", 123);
  session = finishYear(session, ["T1", "G3"]);
  expect(replay(session).round).toBe(2);
  for (let i = 0; i < 4; i++) session = finishYear(session, []);
  const loaded = readSession(JSON.stringify(session));
  expect(loaded).toEqual(session);
  expect(replay(loaded!)).toEqual(replay(session));
  expect(replay(loaded!).phase).toBe("complete");
});
it("rejects broken saves and invalid, excessive or post-completion commands", () => {
  for (const raw of [
    null,
    "{",
    "null",
    "{}",
    JSON.stringify({ version: 2 }),
    JSON.stringify({ ...newSession("random", 1), seed: -1 }),
    JSON.stringify({ ...newSession("random", 1), profile: "Unknown" }),
  ])
    expect(readSession(raw)).toBeNull();
  const s = newSession("Technology-Ready", 0);
  for (const actions of [
    [{ type: "cheat" }],
    [{ type: "confirmPlan", cards: ["X1"] }],
    [{ type: "confirmPlan", cards: ["I1"] }],
    [{ type: "confirmPlan", cards: ["T1", "T1"] }],
    Array(6).fill({ type: "endRound" }),
    Array(126).fill({ type: "endRound" }),
  ])
    expect(readSession(JSON.stringify({ ...s, actions }))).toBeNull();
});
it("invalid year confirmation is atomic", () => {
  const s = newSession("Technology-Ready", 9);
  const before = JSON.stringify(s);
  expect(() => finishYear(s, ["I1"])).toThrow();
  expect(JSON.stringify(s)).toBe(before);
});
