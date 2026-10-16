import {
  apply,
  createGame,
  PROFILES,
  CARDS,
  type Action,
  type GameState,
  type ProfileId,
} from "../engine";
export const SAVE_KEY = "school-transformation-lab:v1";
export interface Session {
  version: 1;
  profile: ProfileId | "random";
  seed: number;
  actions: Action[];
}
export function newSession(profile: Session["profile"], seed: number): Session {
  createGame(profile, seed); // Validate at the boundary.
  return { version: 1, profile, seed, actions: [] };
}
/** Reconstruct from validated commands, never trust arbitrary saved engine state. */
export function replay(session: Session): GameState {
  return session.actions.reduce(
    (state, action) => apply(action, state),
    createGame(session.profile, session.seed),
  );
}
export function readSession(raw: string | null): Session | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const s = value as Record<string, unknown>;
    if (
      s.version !== 1 ||
      typeof s.seed !== "number" ||
      !Number.isInteger(s.seed) ||
      s.seed < 0 ||
      s.seed > 0xffffffff
    )
      return null;
    if (s.profile !== "random" && !PROFILES.some((p) => p.name === s.profile))
      return null;
    if (!Array.isArray(s.actions) || s.actions.length > 125) return null;
    const actions: Action[] = [];
    for (const entry of s.actions) {
      if (!entry || typeof entry !== "object") return null;
      if (entry.type === "endRound") actions.push({ type: "endRound" });
      else if (
        entry.type === "confirmPlan" &&
        Array.isArray(entry.cards) &&
        entry.cards.length <= 4 &&
        entry.cards.every((id: unknown) => CARDS.some((c) => c.id === id))
      ) {
        actions.push({ type: "confirmPlan", cards: [...entry.cards] });
      } else return null;
    }
    const session: Session = {
      version: 1,
      profile: s.profile as Session["profile"],
      seed: s.seed,
      actions,
    };
    replay(session);
    return session;
  } catch {
    return null;
  }
}
export function finishYear(
  session: Session,
  cards: readonly import("../engine").CardId[],
): Session {
  const next = {
    ...session,
    actions: [
      ...session.actions,
      { type: "confirmPlan", cards: [...cards] },
      { type: "endRound" },
    ] as Action[],
  };
  replay(next); // Atomic validation before saving.
  return next;
}
