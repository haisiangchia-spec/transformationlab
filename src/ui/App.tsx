import { useEffect, useMemo, useState } from "react";
import { EVENTS, type CardId, type RoundRecord } from "../engine";
import { Start } from "./Start";
import { Gameplay } from "./Gameplay";
import { Icon, Modal, num } from "./shared";
import { FinalReport } from "./FinalReport";
import {
  SAVE_KEY,
  finishYear,
  newSession,
  readSession,
  replay,
  type Session,
} from "./session";
function initialSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return {
      session: readSession(raw),
      warning:
        raw !== null && !readSession(raw)
          ? "The saved game could not be read. You can start a new game."
          : "",
    };
  } catch {
    return {
      session: null,
      warning:
        "Browser storage is unavailable. You can play, but progress will not persist after closing this page.",
    };
  }
}
const initial = initialSave();
export function App() {
  const [session, setSession] = useState<Session | null>(initial.session);
  const [screen, setScreen] = useState<"start" | "game">("start");
  const [help, setHelp] = useState(false);
  const [menu, setMenu] = useState(false);
  const [warning, setWarning] = useState(initial.warning);
  const [replace, setReplace] = useState<Session | null>(null);
  const [summary, setSummary] = useState<RoundRecord | null>(null);
  const game = useMemo(() => (session ? replay(session) : null), [session]);
  useEffect(() => {
    if (!session) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(session));
    } catch {
      setWarning(
        "Your browser could not save this game. Keep this page open to retain progress.",
      );
    }
  }, [session]);
  useEffect(() => {
    document.title =
      screen === "game" && game
        ? game.phase === "complete"
          ? "Final Report · School Transformation Lab"
          : `Year ${game.round} · School Transformation Lab`
        : "School Transformation Lab";
  }, [screen, game?.round, game?.phase]);
  function start(next: Session) {
    setSession(next);
    setSummary(null);
    setScreen("game");
    setReplace(null);
  }
  function finish(cards: readonly CardId[]) {
    if (!session) return;
    try {
      const next = finishYear(session, cards);
      setSummary(replay(next).history.at(-1)!);
      setSession(next);
    } catch (e) {
      setWarning((e as Error).message);
    }
  }
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      {warning && (
        <div className="storage-warning" role="status">
          {warning}
          <button
            onClick={() => setWarning("")}
            aria-label="Dismiss storage notice"
          >
            ×
          </button>
        </div>
      )}
      {screen === "start" ? (
        <Start
          session={session}
          onStart={(profile, seed) => {
            const next = newSession(profile, seed);
            if (session) setReplace(next);
            else start(next);
          }}
          onResume={() => setScreen("game")}
          onHelp={() => setHelp(true)}
        />
      ) : game?.phase === "investing" ? (
        <Gameplay
          key={`${session?.seed}-${game.round}`}
          game={game}
          onFinish={finish}
          onMenu={() => setMenu(true)}
        />
      ) : (
        game && (
          <FinalReport
            session={session!}
            onMenu={() => setScreen("start")}
            onReplay={() => setScreen("start")}
          />
        )
      )}
      {help && (
        <Modal title="How to play" onClose={() => setHelp(false)} wide>
          <p className="modal-lead">
            Technology opens possibilities. People, practice and culture turn
            them into progress.
          </p>
          <div className="help-grid">
            <section>
              <h3>01 · Choose your school</h3>
              <p>
                Pick one of four profiles, each with two starting enablers, or
                randomise. Lead your school for five years.
              </p>
            </section>
            <section>
              <h3>02 · Build your plan</h3>
              <p>
                Each year starts with 8 budget and 3 investment actions,
                adjusted by the current event and qualifying School Innovation
                engine. Each enabler costs one action. Budget does not carry
                over.
              </p>
            </section>
            <section>
              <h3>03 · Connect your enablers</h3>
              <p>
                Adoption starts at 40%. Each owned supporter adds 20 percentage
                points. Persistent boosts and temporary event shocks also apply;
                adoption stays between 10% and 100%. Supporters are not buying
                prerequisites.
              </p>
            </section>
            <section>
              <h3>04 · Activate engines</h3>
              <p>
                Own all three required cards at 70% adoption or higher to
                activate an engine. Active engines earn recurring benefits.
                Permanent gains survive years when an engine is dormant.
              </p>
            </section>
            <section>
              <h3>05 · Adapt to events</h3>
              <p>
                Four unique events are drawn after Years 1–4. Each affects the
                following year only. Conditions and shock targets are fixed at
                that year's opening; newly purchased cards receive no opening
                shock.
              </p>
            </section>
            <section>
              <h3>06 · Make progress together</h3>
              <p>
                Your score combines balanced Sensing, Modelling and Acting with
                approved engine and event outcomes. It accumulates over five
                years and is uncapped. There is no absolute win/loss threshold.
              </p>
            </section>
          </div>
          <p className="notice">
            All initiatives, costs and effects are fictional learning scenarios,
            not official MOE claims. Only confirmed years are saved; an
            unconfirmed plan is cleared when you leave gameplay or reload.
          </p>
          <button className="button primary" onClick={() => setHelp(false)}>
            LET'S BUILD THE FUTURE
            <Icon name="arrow" />
          </button>
        </Modal>
      )}
      {menu && (
        <Modal title="Your school journey" onClose={() => setMenu(false)}>
          <div className="menu-actions">
            <button
              className="button"
              onClick={() => {
                setMenu(false);
                setHelp(true);
              }}
            >
              <Icon name="book" />
              HOW TO PLAY
            </button>
            <button
              className="button"
              onClick={() => {
                setMenu(false);
                setScreen("start");
              }}
            >
              <Icon name="arrow" />
              RETURN TO START
            </button>
            <button className="button primary" onClick={() => setMenu(false)}>
              KEEP PLAYING
            </button>
          </div>
          <p className="small-note">
            Confirmed years are saved automatically. Returning to start clears
            your unconfirmed plan.
          </p>
          {session && <p className="small-note">Game seed: {session.seed}</p>}
        </Modal>
      )}
      {replace && (
        <Modal
          title="Start a new school journey?"
          onClose={() => setReplace(null)}
        >
          <p>
            This replaces your saved game in this browser. Your current journey
            will remain until you start the new game.
          </p>
          <div className="modal-actions">
            <button className="button" onClick={() => setReplace(null)}>
              KEEP CURRENT GAME
            </button>
            <button className="button primary" onClick={() => start(replace)}>
              START NEW GAME
            </button>
          </div>
        </Modal>
      )}
      {summary && game?.phase !== "complete" && (
        <YearSummary
          record={summary}
          nextRound={game!.round}
          onClose={() => setSummary(null)}
        />
      )}
    </>
  );
}
function YearSummary({
  record,
  nextRound,
  onClose,
}: {
  record: RoundRecord;
  nextRound: number;
  onClose: () => void;
}) {
  const event = EVENTS.find((e) => e.id === record.drawnEvent);
  return (
    <Modal title={`Year ${record.round} complete`} onClose={onClose}>
      <p className="eyebrow cyan">YOUR SCHOOL IS MOVING FORWARD</p>
      <div className="summary-score">
        <span>
          Annual score<strong>{num(record.annualScore)}</strong>
        </span>
        <span>
          Cumulative score<strong>{num(record.cumulativeScore)}</strong>
        </span>
      </div>
      <p>
        Sensing <strong>{num(record.capabilities.sensing)}</strong> · Modelling{" "}
        <strong>{num(record.capabilities.modelling)}</strong> · Acting{" "}
        <strong>{num(record.capabilities.acting)}</strong>
      </p>
      <p>
        {record.activeEngines.length} engine
        {record.activeEngines.length === 1 ? "" : "s"} active at year end.
        Permanent gains and adoption boosts carry forward.
      </p>
      {event && (
        <section className="revealed-event">
          <span className="eyebrow">
            EVENT REVEALED · APPLIES TO YEAR {nextRound}
          </span>
          <h3>{event.name}</h3>
          <p>{event.description}</p>
          <p className="event-rule">{event.next_year_effect}</p>
        </section>
      )}
      <button className="button primary" onClick={onClose}>
        BEGIN YEAR {nextRound}
        <Icon name="arrow" />
      </button>
    </Modal>
  );
}
