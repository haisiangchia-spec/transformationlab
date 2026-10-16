import { useState, type CSSProperties } from "react";
import {
  CARDS,
  ENGINES,
  EVENTS,
  adoption,
  activeEngines,
  capabilities,
  previewPlan,
  purchasePrice,
  type CardId,
  type GameState,
} from "../engine";
import {
  Brand,
  CardTag,
  Icon,
  Modal,
  card,
  category,
  categoryInfo,
  num,
} from "./shared";

export function Gameplay({
  game,
  onFinish,
  onMenu,
}: {
  game: GameState;
  onFinish: (cards: readonly CardId[]) => void;
  onMenu: () => void;
}) {
  const [plan, setPlan] = useState<CardId[]>([]);
  const [filter, setFilter] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<CardId | null>(null);
  const [review, setReview] = useState(false);
  const [error, setError] = useState("");
  const projected = previewPlan(game, plan);
  const actualAds = adoption(game.owned, game.boosts, game.effects.penalties);
  const ads = adoption(
    projected.owned,
    projected.boosts,
    projected.effects.penalties,
  );
  const cap = capabilities(projected.owned, ads, projected.permanent);
  const active = activeEngines(projected.owned, ads);
  const event = EVENTS.find((e) => e.id === game.event);
  function add(id: CardId) {
    try {
      previewPlan(game, [...plan, id]);
      setPlan([...plan, id]);
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  function remove(id: CardId) {
    setPlan(plan.filter((c) => c !== id));
    setError("");
  }
  const filtered = CARDS.filter((c) => {
    const owned = game.owned.includes(c.id),
      price = purchasePrice(c.id, game.effects.discounts);
    return (
      (filter === "all" || c.id.startsWith(filter)) &&
      (!search ||
        `${c.id} ${c.name}`.toLowerCase().includes(search.toLowerCase())) &&
      (availability === "all" ||
        (availability === "owned" && owned) ||
        (availability === "available" && !owned) ||
        (availability === "affordable" && !owned && price <= projected.budget))
    );
  });
  const planCost = game.budget - projected.budget;
  return (
    <div className="game-screen">
      <header className="game-header">
        <Brand />
        <div className="header-stat">
          <Icon name="target" />
          <span>
            ROUND{" "}
            <strong>
              {game.round} <small>OF 5</small>
            </strong>
          </span>
        </div>
        <div className="header-stat">
          <Icon name="layers" />
          <span>
            BUDGET
            <strong data-testid="budget">
              {game.budget} <small>/ {game.openingBudget}</small>
            </strong>
          </span>
        </div>
        <div className="header-stat">
          <Icon name="sun" />
          <span>
            REMAINING INVESTMENTS
            <strong data-testid="actions">
              {game.actions} <small>/ {game.actionLimit}</small>
            </strong>
          </span>
        </div>
        <button
          className="icon-button menu-button"
          aria-label="Open game menu"
          onClick={onMenu}
        >
          <Icon name="menu" />
        </button>
      </header>
      <main id="main" className="game-layout">
        <div className="investment-column">
          <section
            className="panel catalogue-panel"
            aria-labelledby="catalogue-title"
          >
            <div className="catalogue-heading">
              <div>
                <p className="eyebrow cyan">BUILD YOUR SCHOOL'S FUTURE</p>
                <h1 id="catalogue-title">AVAILABLE ENABLERS</h1>
                <p>
                  Invest in People, Practice, Technology and Culture to
                  Transform your School
                </p>
              </div>
              <span className="catalogue-count">
                {filtered.length} / 24 CARDS
              </span>
            </div>
            <div className="catalogue-tools">
              <div
                className="category-filters"
                role="group"
                aria-label="Filter by category"
              >
                <button
                  className={filter === "all" ? "active" : ""}
                  aria-pressed={filter === "all"}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                {Object.entries(categoryInfo).map(([id, c]) => (
                  <button
                    key={id}
                    className={filter === id ? "active" : ""}
                    aria-pressed={filter === id}
                    onClick={() => setFilter(id)}
                  >
                    {c.name} <span>({id})</span>
                  </button>
                ))}
              </div>
              <div className="search-row">
                <label className="search-field">
                  <span className="sr-only">Search enablers</span>
                  <input
                    type="search"
                    placeholder="Search enablers…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </label>
                <label>
                  <span className="sr-only">Card availability</span>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    aria-label="Card availability"
                  >
                    <option value="all">All cards</option>
                    <option value="available">Not owned</option>
                    <option value="affordable">Affordable</option>
                    <option value="owned">Owned</option>
                  </select>
                </label>
              </div>
            </div>
            <div
              className="catalogue-scroll"
              tabIndex={0}
              aria-label="Enabler catalogue"
            >
              <div className="enabler-grid">
                {filtered.map((c) => {
                  const meta = category(c.id),
                    owned = game.owned.includes(c.id),
                    planned = plan.includes(c.id),
                    price = purchasePrice(c.id, game.effects.discounts);
                  const blocked =
                    owned ||
                    (!planned &&
                      (price > projected.budget || projected.actions === 0));
                  return (
                    <article
                      className={`enabler ${owned ? "owned" : ""} ${planned ? "planned" : ""}`}
                      key={c.id}
                      style={{ "--accent": meta.color } as CSSProperties}
                      data-testid={`card-${c.id}`}
                    >
                      <div className="enabler-top">
                        <span>
                          <Icon name={meta.icon} />
                          {meta.name}
                        </span>
                        <CardTag id={c.id} />
                      </div>
                      <h2>
                        <button
                          onClick={() => setDetail(c.id)}
                          aria-label={`View details for ${c.id}: ${c.name}`}
                        >
                          {c.name}
                        </button>
                      </h2>
                      <div className="card-visual">
                        <Icon name={meta.icon} />
                        <span className="visual-orbit" />
                        <span className="visual-code">{c.id}</span>
                        <div className="visual-caption">
                          {owned
                            ? "IN YOUR SCHOOL"
                            : planned
                              ? "IN YOUR PLAN"
                              : "TRANSFORMATION ENABLER"}
                        </div>
                      </div>
                      <div
                        className="capability-chips"
                        aria-label="Printed capabilities"
                      >
                        <span title="Sensing">
                          S <b>{c.sensing}</b>
                        </span>
                        <span title="Modelling">
                          M <b>{c.modelling}</b>
                        </span>
                        <span title="Acting">
                          A <b>{c.acting}</b>
                        </span>
                      </div>
                      <div className="card-adoption">
                        <span>
                          {planned
                            ? "Planned adoption"
                            : owned
                              ? "Current adoption"
                              : "Adoption if added"}
                        </span>
                        <strong>
                          {owned || planned
                            ? ads[c.id]
                            : adoption(
                                [...projected.owned, c.id],
                                game.boosts,
                                game.effects.penalties,
                              )[c.id]}
                          %
                        </strong>
                      </div>
                      <div className="card-bottom">
                        <div className="cost">
                          <span>COST</span>
                          <strong>
                            {price < c.cost && <del>{c.cost}</del>}
                            {price}
                          </strong>
                        </div>
                        <div className="supporters">
                          <span>ADOPTION SUPPORT</span>
                          <div>
                            {c.supporters.map((id) => (
                              <CardTag
                                key={id}
                                id={id}
                                owned={projected.owned.includes(id)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <button
                        className={`button card-action ${planned ? "remove-action" : ""}`}
                        disabled={blocked}
                        onClick={() => (planned ? remove(c.id) : add(c.id))}
                        aria-label={
                          owned
                            ? `${c.id} owned`
                            : planned
                              ? `Remove ${c.id} from plan`
                              : `Add ${c.id} to plan`
                        }
                      >
                        {owned ? (
                          <>
                            <Icon name="check" />
                            OWNED
                          </>
                        ) : planned ? (
                          <>
                            <Icon name="close" />
                            REMOVE FROM PLAN
                          </>
                        ) : (
                          <>
                            {price > projected.budget
                              ? "OVER BUDGET"
                              : projected.actions === 0
                                ? "PLAN FULL"
                                : "ADD TO PLAN"}
                            <Icon name="plus" />
                          </>
                        )}
                      </button>
                    </article>
                  );
                })}
              </div>
              {!filtered.length && (
                <div className="empty-catalogue">
                  <Icon name="book" />
                  <h2>No matching enablers</h2>
                  <p>Try another search or filter.</p>
                  <button
                    className="button compact"
                    onClick={() => {
                      setFilter("all");
                      setSearch("");
                      setAvailability("all");
                    }}
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}
            </div>
          </section>
          <section className="panel plan-panel" aria-labelledby="plan-title">
            <div className="plan-heading">
              <h2 id="plan-title">INVESTMENTS THIS ROUND</h2>
              <span>
                {plan.length} / {game.actions} selected · {planCost} budget
                planned
              </span>
              {plan.length > 0 && (
                <button
                  className="text-button"
                  onClick={() => {
                    setPlan([]);
                    setError("");
                  }}
                >
                  Clear plan
                </button>
              )}
            </div>
            <p className="plan-hint">
              Plan freely. Budget and actions are spent only when you confirm.
            </p>
            <div className="plan-row">
              <div
                className="plan-slots"
                style={{ "--slots": game.actionLimit } as CSSProperties}
              >
                {Array.from({ length: game.actionLimit }, (_, i) => {
                  const id = plan[i];
                  return (
                    <div
                      className={`plan-slot ${id ? "filled" : ""} ${i >= game.actions ? "used" : ""}`}
                      key={i}
                      data-testid="plan-slot"
                    >
                      {id ? (
                        <>
                          <CardTag id={id} />
                          <span>{card(id).name}</span>
                          <button
                            className="icon-button"
                            onClick={() => remove(id)}
                            aria-label={`Remove ${id} from investment slot`}
                          >
                            <Icon name="close" />
                          </button>
                          <strong>
                            {purchasePrice(id, game.effects.discounts)} budget
                          </strong>
                        </>
                      ) : (
                        <>
                          <Icon name={i >= game.actions ? "check" : "plus"} />
                          <span>
                            {i >= game.actions
                              ? "ALREADY INVESTED"
                              : `${i + 1}. SELECT ENABLER`}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                className="button primary confirm-button"
                aria-label={plan.length ? "CONFIRM INVESTMENTS" : "END YEAR"}
                onClick={() => setReview(true)}
              >
                <Icon name="play" className="play-mark" />
                <span>
                  {plan.length ? "CONFIRM INVESTMENTS" : "END YEAR"}
                  <small>
                    {plan.length
                      ? "REVIEW PLAN & END YEAR"
                      : "CONTINUE WITHOUT INVESTING"}
                  </small>
                </span>
              </button>
            </div>
            <p className="plan-summary" aria-live="polite">
              After confirmation: <strong>{projected.budget} budget</strong> and{" "}
              <strong>
                {projected.actions} investment
                {projected.actions === 1 ? "" : "s"}
              </strong>{" "}
              unused. Unspent budget does not carry over.
            </p>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
          </section>
        </div>
        <aside className="school-column" aria-label="School status">
          <section className="panel status-panel">
            <div className="section-heading">
              <h2>SCHOOL STATUS</h2>
              <span className="status-profile">{game.profile} School</span>
            </div>
            <div className="preview-label">
              {plan.length
                ? "PLAN PREVIEW · BEFORE YEAR-END REWARDS"
                : "CURRENT CAPABILITIES · RAW VALUES"}
            </div>
            <div className="capabilities">
              {(["sensing", "modelling", "acting"] as const).map((d, i) => (
                <div className={`capability dimension-${i}`} key={d}>
                  <Icon name={["target", "network", "sun"][i]!} />
                  <div>
                    <span>{d}</span>
                    <strong data-testid={`capability-${d}`}>
                      {num(cap[d])}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
            <p className="small-note">
              Capabilities are uncapped. Adoption determines how much each
              enabler contributes.
            </p>
            <div className="engine-gains">
              <div>
                <span>STUDENT AGENCY</span>
                <strong>{game.agency}</strong>
                <small>Cumulative engine gains</small>
              </div>
              <div>
                <span>STAKEHOLDER TRUST</span>
                <strong>{game.trust}</strong>
                <small>Cumulative engine gains</small>
              </div>
            </div>
            <div className="score-strip">
              <span>
                TRANSFORMATION SCORE<small>Cumulative · completed years</small>
              </span>
              <strong>{num(game.score)}</strong>
            </div>
            <details className="owned-list" open>
              <summary>
                CURRENTLY OWNED CARDS <span>({game.owned.length})</span>
              </summary>
              <div>
                {game.owned.map((id) => (
                  <button key={id} onClick={() => setDetail(id)}>
                    <CardTag id={id} />
                    <span>
                      {card(id).name}
                      <small>{actualAds[id]}% adoption</small>
                    </span>
                  </button>
                ))}
              </div>
            </details>
          </section>
          <section className="panel engines-panel">
            <div className="section-heading">
              <h2>SYNERGY ENGINES</h2>
              <span className="count-badge">{active.length} / 6</span>
            </div>
            <p className="small-note">
              All three cards must be owned and each reach 70% adoption. Rewards
              compound at year end.
            </p>
            {ENGINES.map((e) => {
              const enabled = active.includes(e.id);
              return (
                <details
                  key={e.id}
                  className={`engine-item ${enabled ? "active-engine" : ""}`}
                >
                  <summary>
                    <Icon name="network" />
                    <span>{e.name}</span>
                    <em>
                      {enabled
                        ? plan.length
                          ? "READY IN PLAN"
                          : "ACTIVE"
                        : "BUILDING"}
                    </em>
                  </summary>
                  <div className="engine-body">
                    <div className="requirement-list">
                      {e.requirements.map((id) => (
                        <span key={id}>
                          <CardTag
                            id={id}
                            owned={projected.owned.includes(id)}
                          />
                          <small>
                            {projected.owned.includes(id)
                              ? `${ads[id]}%`
                              : "Not owned"}
                          </small>
                        </span>
                      ))}
                    </div>
                    <p>{e.reward}</p>
                  </div>
                </details>
              );
            })}
          </section>
          <section
            className={`panel event-panel ${event?.type === "Risk" ? "risk" : ""}`}
            aria-labelledby="event-title"
          >
            <div className="section-heading">
              <h2 id="event-title">CURRENT EVENT</h2>
              <span className="event-duration">
                {event ? "THIS YEAR ONLY" : "YEAR 1"}
              </span>
            </div>
            {event ? (
              <>
                <p className="eyebrow">
                  {event.id} · {event.type}
                </p>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
                <div className="event-rule">
                  <strong>THIS YEAR'S RULE</strong>
                  <p>{event.next_year_effect}</p>
                </div>
                <details>
                  <summary>Applied to your school</summary>
                  <ul>
                    <li>
                      Budget adjustment: {game.effects.budget > 0 ? "+" : ""}
                      {game.effects.budget}
                    </li>
                    <li>
                      Investment adjustment:{" "}
                      {game.effects.actions > 0 ? "+" : ""}
                      {game.effects.actions}
                    </li>
                    {Object.entries(game.effects.discounts).map(([id, n]) => (
                      <li key={id}>
                        {id}: −{n} purchase cost (minimum 1)
                      </li>
                    ))}
                    {Object.entries(game.effects.penalties)
                      .filter(([, n]) => n! > 0)
                      .map(([id, n]) => (
                        <li key={id}>
                          {id}: −{n} pp adoption
                        </li>
                      ))}
                    {game.effects.learningImpact !== 0 && (
                      <li>Learning Impact: +{game.effects.learningImpact}</li>
                    )}
                    {game.effects.agency !== 0 && (
                      <li>
                        Temporary Student Agency adjustment:{" "}
                        {game.effects.agency}
                      </li>
                    )}
                  </ul>
                  <p>
                    Conditions and adoption shocks were fixed at this year's
                    opening. Buying a mitigator now does not change them.
                  </p>
                </details>
              </>
            ) : (
              <div className="first-event">
                <Icon name="sun" />
                <h3>A fresh start</h3>
                <p>
                  No event affects your first year. Your first event will be
                  revealed at year end.
                </p>
              </div>
            )}
          </section>
        </aside>
      </main>
      {detail && (
        <CardDetails
          id={detail}
          game={projected}
          onClose={() => setDetail(null)}
        />
      )}
      {review && (
        <Modal
          title={`Review Year ${game.round} investments`}
          onClose={() => setReview(false)}
        >
          <p>
            Confirming buys your selected enablers and ends Year {game.round}.
            Your school's engine rewards and annual score are then calculated.
          </p>
          {plan.length ? (
            <ul className="review-list">
              {plan.map((id) => (
                <li key={id}>
                  <CardTag id={id} />
                  <span>{card(id).name}</span>
                  <strong>{purchasePrice(id, game.effects.discounts)}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p className="notice">You have selected no enablers this year.</p>
          )}
          <div className="review-totals">
            <span>
              Investment cost <strong>{planCost}</strong>
            </span>
            <span>
              Unused budget <strong>{projected.budget}</strong>
            </span>
            <span>
              Unused actions <strong>{projected.actions}</strong>
            </span>
          </div>
          <p className="small-note">
            Unused budget and actions expire.{" "}
            {game.round < 5
              ? "A unique event will be revealed for next year."
              : "This is your final year. No new event will be drawn."}
          </p>
          <div className="modal-actions">
            <button className="button" onClick={() => setReview(false)}>
              KEEP PLANNING
            </button>
            <button
              className="button primary"
              onClick={() => {
                onFinish(plan);
                setPlan([]);
                setReview(false);
              }}
            >
              CONFIRM & END YEAR {game.round}
              <Icon name="arrow" />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function CardDetails({
  id,
  game,
  onClose,
}: {
  id: CardId;
  game: GameState;
  onClose: () => void;
}) {
  const c = card(id);
  const owned = game.owned.includes(id);
  const hypothetical = owned ? game.owned : [...game.owned, id];
  const ads = adoption(hypothetical, game.boosts, game.effects.penalties);
  const rate = ads[id]!;
  return (
    <Modal title={`${id} · ${c.name}`} onClose={onClose}>
      <p className="eyebrow cyan">{category(id).full}</p>
      <div className="detail-stats">
        <span>
          Purchase cost
          <strong>{purchasePrice(id, game.effects.discounts)}</strong>
        </span>
        <span>
          {owned ? "Adoption" : "Adoption if added"}
          <strong>{rate}%</strong>
        </span>
      </div>
      <h3>Capabilities</h3>
      <p>
        Printed Sensing / Modelling / Acting:{" "}
        <strong>
          {c.sensing} / {c.modelling} / {c.acting}
        </strong>
      </p>
      <p>
        Effective contribution at {rate}% adoption:{" "}
        <strong>
          {num((c.sensing * rate) / 100)} / {num((c.modelling * rate) / 100)} /{" "}
          {num((c.acting * rate) / 100)}
        </strong>
      </p>
      <h3>Adoption supporters</h3>
      <p>
        Each owned supporter adds 20 percentage points to the 40% base. These
        are boosts, not purchase prerequisites.
      </p>
      <ul className="supporter-list">
        {c.supporters.map((s) => (
          <li key={s}>
            <CardTag id={s} owned={game.owned.includes(s)} />
            <span>{card(s).name}</span>
            <small>
              {game.owned.includes(s) ? "Owned · +20 pp" : "Not owned"}
            </small>
          </li>
        ))}
      </ul>
      <p>
        Persistent boost: +{game.boosts[id] ?? 0} pp · Current event penalty: −
        {game.effects.penalties[id] ?? 0} pp. Adoption is clamped to 10–100%.
      </p>
      <h3>Engine connections</h3>
      {ENGINES.filter((e) =>
        (e.requirements as readonly CardId[]).includes(id),
      ).map((e) => (
        <p key={e.id}>
          <strong>{e.name}</strong>
          <br />
          {e.requirements.join(" + ")} · all ≥70% adoption
        </p>
      ))}
      {!ENGINES.some((e) =>
        (e.requirements as readonly CardId[]).includes(id),
      ) && (
        <p>
          This card supports your school's adoption and capabilities without
          being a direct engine requirement.
        </p>
      )}
    </Modal>
  );
}
