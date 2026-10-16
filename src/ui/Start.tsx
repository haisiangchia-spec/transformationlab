import { useState, type CSSProperties } from "react";
import { PROFILES } from "../engine";
import { Art, Brand, CardTag, Footer, Icon, card } from "./shared";
import type { Session } from "./session";
const profiles = [
  {
    scene: "technology",
    icon: "building",
    color: "#4ecbff",
    description:
      "Strong devices and platforms. Bring your teaching practice and people along.",
  },
  {
    scene: "teacher",
    icon: "people",
    color: "#bd9aff",
    description:
      "A culture of professional learning. Build the infrastructure to turn ideas into impact.",
  },
  {
    scene: "student",
    icon: "graduate",
    color: "#46ebc2",
    description:
      "Digital and AI literacy foundations. Help learners take their next step with confidence.",
  },
  {
    scene: "leadership",
    icon: "compass",
    color: "#ffca62",
    description:
      "A shared vision and capacity for change. Connect your strategy to everyday practice.",
  },
] as const;
export function Start({
  session,
  onStart,
  onResume,
  onHelp,
}: {
  session: Session | null;
  onStart: (profile: Session["profile"], seed: number) => void;
  onResume: () => void;
  onHelp: () => void;
}) {
  const [selected, setSelected] =
    useState<Session["profile"]>("Technology-Ready");
  const [seed, setSeed] = useState(() =>
    String(crypto.getRandomValues(new Uint32Array(1))[0]!),
  );
  const [error, setError] = useState("");
  function start() {
    const n = Number(seed);
    if (!seed.trim() || !Number.isInteger(n) || n < 0 || n > 0xffffffff) {
      setError("Enter a whole number from 0 to 4294967295.");
      return;
    }
    setError("");
    onStart(selected, n);
  }
  return (
    <div className="start-screen">
      <header className="start-header">
        <Brand />
        <p className="eyebrow">
          STUDENTS <span>·</span> TEACHERS <span>·</span> TECHNOLOGY
        </p>
        <span className="edition">FIVE YEARS. A SHARED FUTURE.</span>
      </header>
      <main id="main">
        <section className="start-hero" aria-labelledby="game-title">
          <Art scene="hero" />
          <div className="hero-copy">
            <p className="eyebrow cyan">
              YOUR SCHOOL. YOUR CHOICES. LASTING CHANGE.
            </p>
            <h1 id="game-title">
              SCHOOL
              <br />
              TRANSFORMATION <span>LAB</span>
            </h1>
            <p className="tagline">
              Helping our Students Flourish in an AI Future
            </p>
            <div className="hero-actions">
              <button className="button primary" onClick={start}>
                <Icon name="play" className="play-mark" />
                <span>
                  NEW GAME<small>START YOUR JOURNEY</small>
                </span>
                <Icon name="arrow" />
              </button>
              <button className="button" onClick={onHelp}>
                <Icon name="book" />
                <span>
                  HOW TO PLAY<small>LEARN THE GAME</small>
                </span>
              </button>
              <button
                className={`button ${selected === "random" ? "selected" : ""}`}
                onClick={() => setSelected("random")}
                aria-pressed={selected === "random"}
              >
                <Icon name="shuffle" />
                <span>
                  RANDOMISE PROFILE
                  <small>
                    {selected === "random"
                      ? "RANDOM PROFILE SELECTED"
                      : "LET FATE DECIDE"}
                  </small>
                </span>
              </button>
            </div>
          </div>
        </section>
        {session && (
          <div className="resume-banner">
            <span>
              <strong>Your school journey is saved.</strong> Continue from your
              last confirmed year.
            </span>
            <button className="button compact" onClick={onResume}>
              RESUME GAME <Icon name="arrow" />
            </button>
          </div>
        )}
        <div className="start-layout">
          <section className="profile-section" aria-labelledby="profiles-title">
            <div className="section-heading">
              <h2 id="profiles-title">CHOOSE YOUR STARTING SCHOOL</h2>
              <span className="heading-line" />
            </div>
            <p className="section-intro">
              Different strengths. Different pathways. One shared goal.
            </p>
            <div
              className="profile-grid"
              role="radiogroup"
              aria-label="Starting school profile"
            >
              {PROFILES.map((p, index) => {
                const v = profiles[index]!;
                return (
                  <label
                    className={`profile ${selected === p.name ? "chosen" : ""}`}
                    key={p.name}
                    style={{ "--accent": v.color } as CSSProperties}
                  >
                    <input
                      type="radio"
                      name="profile"
                      value={p.name}
                      checked={selected === p.name}
                      onChange={() => setSelected(p.name)}
                    />
                    <div className="profile-top">
                      <Icon name={v.icon} />
                      <h3>
                        {p.name}
                        <br />
                        School
                      </h3>
                      <span className="selected-check">
                        <Icon name="check" />
                      </span>
                    </div>
                    <p>{v.description}</p>
                    <Art scene={v.scene} />
                    <div className="profile-cards">
                      <span className="eyebrow">STARTING CARDS · 2</span>
                      {p.starting_cards.map((id) => (
                        <div key={id}>
                          <CardTag id={id} />
                          <span>{card(id).name}</span>
                        </div>
                      ))}
                    </div>
                    <span className="profile-select">
                      {selected === p.name
                        ? "PROFILE SELECTED"
                        : "SELECT THIS PROFILE"}
                      <Icon name={selected === p.name ? "check" : "arrow"} />
                    </span>
                  </label>
                );
              })}
            </div>
            <details className="seed-options">
              <summary>Reproducible game seed</summary>
              <label htmlFor="seed">
                Use the same seed, profile and choices to replay a journey.
              </label>
              <div>
                <input
                  id="seed"
                  inputMode="numeric"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  aria-describedby={error ? "seed-error" : undefined}
                />
                <button
                  className="text-button"
                  onClick={() =>
                    setSeed(
                      String(crypto.getRandomValues(new Uint32Array(1))[0]!),
                    )
                  }
                >
                  Generate seed
                </button>
              </div>
            </details>
            {error && (
              <p role="alert" id="seed-error" className="error">
                {error}
              </p>
            )}
          </section>
          <aside className="overview panel">
            <h2>GAME OVERVIEW</h2>
            <p className="eyebrow cyan">BUILD CONNECTIONS. CREATE IMPACT.</p>
            {[
              {
                icon: "sun",
                value: "5",
                title: "SCHOOL YEARS",
                text: "Every year is a chance to move forward.",
              },
              {
                icon: "layers",
                value: "8",
                title: "ANNUAL BUDGET",
                text: "A fresh budget, adjusted by events.",
              },
              {
                icon: "target",
                value: "3",
                title: "STANDARD INVESTMENTS",
                text: "Events can adjust this to 2–4.",
              },
              {
                icon: "book",
                value: "24",
                title: "ENABLER CARDS",
                text: "Invest in people, practice and technology.",
              },
              {
                icon: "network",
                value: "6",
                title: "SYNERGY ENGINES",
                text: "Build benefits that compound over time.",
              },
              {
                icon: "shuffle",
                value: "24",
                title: "POSSIBLE EVENTS",
                text: "Four unique events shape your journey.",
              },
            ].map((x) => (
              <div className="overview-row" key={x.title}>
                <Icon name={x.icon} />
                <b>{x.value}</b>
                <div>
                  <strong>{x.title}</strong>
                  <p>{x.text}</p>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
