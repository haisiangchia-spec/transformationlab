import { useMemo, useState } from "react";
import { EVENTS, PLAYSTYLES } from "../engine";
import {
  buildReport,
  cardName,
  engineName,
  DIMENSIONS,
  type Report,
} from "../report/model";
import { downloadReport } from "../report/export";
import { Art, Brand, CardTag, Footer, Icon, Modal, num } from "./shared";
import { CapabilityChart, dimensionColours } from "./CapabilityChart";
import type { Session } from "./session";

export function FinalReport({
  session,
  onMenu,
  onReplay,
}: {
  session: Session;
  onMenu: () => void;
  onReplay: () => void;
}) {
  const report = useMemo(() => buildReport(session), [session]);
  const [year, setYear] = useState(5);
  const [exporting, setExporting] = useState(false);
  const [notice, setNotice] = useState("");
  const record = report.rounds[year - 1]!;
  const currentEvent = EVENTS.find((e) => e.id === record.event);
  const drawn = EVENTS.find((e) => e.id === record.drawnEvent);
  return (
    <div className="report-screen">
      <header className="game-header report-header">
        <Brand />
        <div className="header-stat">
          <Icon name="check" />
          <span>
            GAME COMPLETE
            <strong>
              5 YEARS <small>PLAYED</small>
            </strong>
          </span>
        </div>
        <div className="header-stat report-profile">
          <Icon name="building" />
          <span>
            STARTING PROFILE<strong>{report.profile} School</strong>
          </span>
        </div>
        <button
          className="icon-button"
          onClick={onMenu}
          aria-label="Return to menu"
        >
          <Icon name="menu" />
        </button>
      </header>
      <main id="main">
        <section className="report-banner panel">
          <Art scene="hero" />
          <div>
            <p className="eyebrow cyan">YOUR SCHOOL'S FIVE-YEAR JOURNEY</p>
            <h1>FINAL REPORT</h1>
            <h2>Your school journey is complete.</h2>
            <p>
              Explore the connections you built, the choices you made and the
              progress that followed.
            </p>
          </div>
        </section>
        <div className="report-top">
          <section className="panel report-score">
            <h2>FINAL TRANSFORMATION SCORE</h2>
            <div className="score-orbit">
              <strong className="final-score">{num(report.totalScore)}</strong>
              <span>FIVE-YEAR TOTAL</span>
            </div>
            <p>
              Cumulative and uncapped. Every year contributes to your final
              score.
            </p>
            <div className="report-facts">
              <span>
                <b>{report.purchased.length}</b> enablers purchased
              </span>
              <span>
                <b>{report.ownedCards.length}</b> total owned
              </span>
              <span>
                <b>{report.engineYears}</b> active engine-years
              </span>
            </div>
          </section>
          <section className="panel report-chart">
            <div className="section-heading">
              <h2>PROGRESS ACROSS YEARS</h2>
              <a href="#report-data" className="text-button">
                View data
              </a>
            </div>
            <p className="small-note">
              Raw Sensing, Modelling and Acting · after annual rewards and
              current-year penalties
            </p>
            <CapabilityChart
              report={report}
              selected={year}
              onSelect={setYear}
            />
          </section>
          <section className="panel report-classification">
            <h2>PLAYSTYLE CLASSIFICATION</h2>
            <ClassificationPanel report={report} />
          </section>
        </div>
        <div className="report-body">
          <div className="report-main-column">
            <section className="panel report-timeline">
              <div className="section-heading">
                <h2>ROUND-BY-ROUND HIGHLIGHTS</h2>
                <span className="eyebrow">YOUR CHOICES, RECORDED</span>
              </div>
              <div className="timeline-years">
                {report.rounds.map((r) => (
                  <button
                    key={r.round}
                    aria-pressed={year === r.round}
                    onClick={() => setYear(r.round)}
                    aria-label={`View Year ${r.round} details`}
                  >
                    <span className="year-number">{r.round}</span>
                    <strong>YEAR {r.round}</strong>
                    <span>
                      {r.purchased.length} investment
                      {r.purchased.length === 1 ? "" : "s"}
                    </span>
                    <span>
                      {r.activeEngines.length} active engine
                      {r.activeEngines.length === 1 ? "" : "s"}
                    </span>
                    <small>
                      ANNUAL SCORE <b>{num(r.annualScore)}</b>
                    </small>
                    <small>
                      CUMULATIVE <b>{num(r.cumulativeScore)}</b>
                    </small>
                  </button>
                ))}
              </div>
              <div className="year-detail" aria-live="polite">
                <h3>Year {year} · Decisions and outcomes</h3>
                <div className="year-detail-grid">
                  <div>
                    <p className="eyebrow cyan">INVESTMENTS</p>
                    {record.purchased.length ? (
                      <ul className="report-purchases">
                        {record.purchased.map((id) => (
                          <li key={id}>
                            <CardTag id={id} />
                            <span>{cardName(id)}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No enablers purchased this year.</p>
                    )}
                    <p className="small-note">
                      Spent {record.budgetSpent} of {record.openingBudget}{" "}
                      budget · Used {record.actionsSpent} of{" "}
                      {record.actionLimit} investments
                    </p>
                    <p className="small-note">
                      Unused: {record.budgetRemaining} budget,{" "}
                      {record.actionsRemaining} investments. Resources did not
                      carry over.
                    </p>
                  </div>
                  <div>
                    <p className="eyebrow cyan">EVENT CONTEXT</p>
                    {currentEvent ? (
                      <>
                        <h4>
                          {currentEvent.id} · {currentEvent.name}
                        </h4>
                        <p>{currentEvent.next_year_effect}</p>
                        <p className="small-note">
                          Learning Impact adjustment:{" "}
                          {record.effects.learningImpact} · Temporary agency
                          adjustment: {record.effects.agency} · Temporary trust
                          adjustment: {record.effects.trust}
                        </p>
                        <p className="small-note">
                          Opening-owned adoption shocks:{" "}
                          {Object.entries(record.effects.penalties)
                            .filter(([, v]) => v! > 0)
                            .map(([id, v]) => `${id} −${v} pp`)
                            .join(", ") || "None"}
                        </p>
                      </>
                    ) : (
                      <p>No event affected Year 1.</p>
                    )}
                    <p className="small-note">
                      {drawn
                        ? `Revealed at year end for Year ${year + 1}: ${drawn.id} · ${drawn.name}.`
                        : "No event drawn after Year 5."}
                    </p>
                  </div>
                </div>
                <p className="year-engine-note">
                  <Icon name="network" />
                  <span>
                    <strong>Rewarding engines:</strong>{" "}
                    {record.activeEngines.map(engineName).join(" · ") ||
                      "None this year"}
                  </span>
                </p>
                {record.collectiveTarget && (
                  <p className="small-note">
                    Collective Teacher's adoption boost target:{" "}
                    {record.collectiveTarget} ·{" "}
                    {cardName(record.collectiveTarget)}.
                  </p>
                )}
              </div>
            </section>
            <section className="panel report-reflections">
              <h2>REFLECTION & INSIGHTS</h2>
              <div className="reflection-grid">
                <div>
                  <Icon name="target" />
                  <h3>Evidence from your journey</h3>
                  <p>
                    Your highest annual score was{" "}
                    <strong>
                      {num(report.rounds[report.bestYear - 1]!.annualScore)}
                    </strong>{" "}
                    in Year {report.bestYear}.
                  </p>
                  <p>
                    {report.firstEngineYear
                      ? `Your first rewarding engine activated in Year ${report.firstEngineYear}.`
                      : "No engine reached its reward threshold during this journey."}
                  </p>
                </div>
                <div>
                  <Icon name="network" />
                  <h3>Connections to explore</h3>
                  {report.nextEngine ? (
                    <>
                      <p>
                        {report.nextEngine.name} was not active for Year 5
                        rewards.
                      </p>
                      <p>
                        Requirements:{" "}
                        {report.nextEngine.requirementsStatus
                          .map(
                            (r) =>
                              `${r.id} (${r.owned ? `${num(r.adoption!)}%` : "not owned"})`,
                          )
                          .join(", ")}
                        . Each needs ownership and at least 70% adoption.
                      </p>
                    </>
                  ) : (
                    <p>
                      All six engines earned rewards in Year 5. Which
                      investments helped them stay active?
                    </p>
                  )}
                </div>
                <div>
                  <Icon name="compass" />
                  <h3>A question for your next school</h3>
                  <p>
                    {report.lowestDimension[0]!.toUpperCase() +
                      report.lowestDimension.slice(1)}{" "}
                    was your lowest final capability at{" "}
                    {num(report.finalCapabilities[report.lowestDimension])}.
                  </p>
                  <p>
                    Which human, pedagogical or infrastructure enablers could
                    strengthen that capability while supporting the others?
                  </p>
                </div>
              </div>
              <p className="small-note">
                These prompts describe your recorded choices. They do not
                establish educational impact beyond this fictional simulation.
              </p>
            </section>
          </div>
          <aside className="report-side">
            <section className="panel final-capabilities">
              <h2>FINAL CAPABILITY RESULTS</h2>
              <p className="small-note">
                Year 5 scoring snapshot · raw, uncapped values
              </p>
              {DIMENSIONS.map((d) => (
                <div
                  className="final-dimension"
                  key={d}
                  style={{ color: dimensionColours[d] }}
                >
                  <Icon
                    name={
                      d === "sensing"
                        ? "target"
                        : d === "modelling"
                          ? "network"
                          : "sun"
                    }
                  />
                  <span>{d}</span>
                  <strong>{num(report.finalCapabilities[d])}</strong>
                </div>
              ))}
              <div className="report-pools">
                <div>
                  <span>STUDENT AGENCY</span>
                  <strong>{report.agency}</strong>
                  <small>Cumulative engine gains</small>
                </div>
                <div>
                  <span>STAKEHOLDER TRUST</span>
                  <strong>{report.trust}</strong>
                  <small>Cumulative engine gains</small>
                </div>
              </div>
              <p className="small-note">
                Permanent engine contributions already included: S +
                {report.permanent.sensing} · M +{report.permanent.modelling} · A
                +{report.permanent.acting}. Year-5 event penalties remain
                included.
              </p>
            </section>
            <section className="panel report-engines">
              <h2>SYNERGY ENGINE JOURNEY</h2>
              <p className="small-note">
                {report.finalActive.length} active for Year 5 rewards ·
                permanent benefits are retained during dormancy.
              </p>
              {report.engines.map((e) => (
                <details
                  key={e.id}
                  className={`report-engine ${e.activeInFinalYear ? "rewarded" : ""}`}
                >
                  <summary>
                    <Icon name="network" />
                    <span>
                      {e.name}
                      <small>
                        {e.activeInFinalYear
                          ? "ACTIVE IN YEAR 5"
                          : e.years.length
                            ? "DORMANT IN YEAR 5"
                            : "NOT YET ACTIVATED"}
                      </small>
                    </span>
                  </summary>
                  <div>
                    <p>Rewarding years: {e.years.join(", ") || "None"}.</p>
                    <p>{e.reward}</p>
                    <div className="requirement-list">
                      {e.requirementsStatus.map((r) => (
                        <span key={r.id}>
                          <CardTag id={r.id} owned={r.owned} />
                          <small>
                            {r.owned ? `${num(r.adoption!)}%` : "Not owned"}
                          </small>
                        </span>
                      ))}
                    </div>
                  </div>
                </details>
              ))}
              <p className="small-note">
                Active status is sampled before year-end rewards. A Collective
                Teacher boost can raise scoring adoption without granting
                another engine a second reward pass.
              </p>
            </section>
          </aside>
        </div>
        <section className="panel report-data" id="report-data">
          <h2>THE DATA BEHIND YOUR JOURNEY</h2>
          <p className="small-note">
            Values below are displayed to two decimal places. JSON export
            retains full numerical precision.
          </p>
          <div
            className="report-table-scroll"
            tabIndex={0}
            aria-label="Five-year results table"
          >
            <table>
              <caption>Five-year raw capabilities and scores</caption>
              <thead>
                <tr>
                  <th scope="col">Year</th>
                  <th scope="col">Sensing</th>
                  <th scope="col">Modelling</th>
                  <th scope="col">Acting</th>
                  <th scope="col">Annual score</th>
                  <th scope="col">Cumulative score</th>
                  <th scope="col">Rewarding engines</th>
                </tr>
              </thead>
              <tbody>
                {report.rounds.map((r) => (
                  <tr key={r.round}>
                    <th scope="row">{r.round}</th>
                    <td>{num(r.capabilities.sensing)}</td>
                    <td>{num(r.capabilities.modelling)}</td>
                    <td>{num(r.capabilities.acting)}</td>
                    <td>{num(r.annualScore)}</td>
                    <td>{num(r.cumulativeScore)}</td>
                    <td>
                      {r.activeEngines.map(engineName).join(", ") || "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <details className="final-inventory">
            <summary>
              View final enablers and adoption ({report.ownedCards.length})
            </summary>
            <ul>
              {report.ownedCards.map((c) => (
                <li key={c.id}>
                  <CardTag id={c.id} />
                  <span>
                    {c.name}
                    <small>
                      Persistent boost +{c.persistentBoost} pp · Year-5 penalty
                      −{c.penalty} pp
                    </small>
                  </span>
                  <strong>{num(c.adoption)}%</strong>
                </li>
              ))}
            </ul>
          </details>
        </section>
        <nav className="report-actions" aria-label="Report actions">
          <button className="button primary" onClick={onReplay}>
            <Icon name="shuffle" />
            PLAY AGAIN
          </button>
          <button className="button" onClick={() => setExporting(true)}>
            <Icon name="book" />
            EXPORT REPORT
          </button>
          <button className="button" onClick={onMenu}>
            <Icon name="arrow" />
            RETURN TO MENU
          </button>
        </nav>
        <p className="report-provenance small-note">
          Starting school: {report.profile} · Seed: {report.seed} · Locked rules
          v1.0 · Fictional school initiatives and effects, not official MOE
          claims.
        </p>
      </main>
      <Footer />
      {notice && (
        <p role="status" className="export-notice">
          {notice}
        </p>
      )}
      {exporting && (
        <Modal
          title="Export your school report"
          onClose={() => setExporting(false)}
        >
          <p>Keep your results for reflection or compare a future journey.</p>
          <div className="export-options">
            <button
              className="button primary"
              onClick={() => {
                setExporting(false);
                requestAnimationFrame(() =>
                  requestAnimationFrame(() => window.print()),
                );
              }}
            >
              PRINT / SAVE AS PDF
              <Icon name="arrow" />
            </button>
            <p className="small-note">
              Opens your browser's print dialog. Choose “Save as PDF” if your
              browser supports it. The print layout includes the chart, tables
              and all engine details.
            </p>
            <button
              className="button"
              onClick={() => {
                try {
                  downloadReport(session);
                  setNotice("Report JSON downloaded.");
                  setExporting(false);
                } catch {
                  setNotice(
                    "The report could not be downloaded. Try the print option.",
                  );
                }
              }}
            >
              DOWNLOAD JSON
              <Icon name="arrow" />
            </button>
            <p className="small-note">
              Full-precision results, year snapshots and the replayable
              seed/action log. No personal data is required.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
function ClassificationPanel({ report }: { report: Report }) {
  const c = report.classification;
  const f = c.features;
  const explanations = {
    Random: `Your investment pattern was exploratory across the measured tendencies.`,
    "Technology-first": `${f.spend.I} of ${f.totalSpent} budget was invested in infrastructure, with earlier technology investment contributing to this label.`,
    "Teacher-first": `${f.spend.T} of ${f.totalSpent} budget was invested in teacher capacity. Collective Teacher earned rewards in ${f.teacherEngineYears} years.`,
    "Student-first": `${f.spend.S} of ${f.totalSpent} budget was invested in student agency. Self-Directed AI earned rewards in ${f.studentEngineYears} years.`,
    "Governance-first": `${f.spend.G} of ${f.totalSpent} budget was invested in governance. Trusted AI earned rewards in ${f.trustEngineYears} years.`,
    "Engine-focused": `${f.linked} of ${f.purchases} purchases connected adoption supporters; ${f.instrumental} purchases were necessary to an engine rewarding in their purchase year.`,
    Adaptive: `${f.discounted} of ${f.eventPurchases} purchases in event years used event discounts. Changes in annual category spending also contribute to this label.`,
  };
  return (
    <>
      <div className="classification-emblem">
        <Icon
          name={
            c.id === "Engine-focused"
              ? "network"
              : c.id === "Adaptive"
                ? "shuffle"
                : "compass"
          }
        />
      </div>
      <p className="eyebrow cyan">EXPLAINABLE HEURISTIC</p>
      <h3 data-testid="playstyle-label">{c.label}</h3>
      <p>
        {c.evidenceAvailable
          ? explanations[c.id]
          : "No purchases were made. This is the fallback label; there is insufficient investment evidence to infer a playstyle."}
      </p>
      <p className="small-note">
        A description of in-game choices, not a measured probability or
        assessment of leadership ability.
      </p>
      <details className="classification-method">
        <summary>Why this label? View the rubric</summary>
        <p>
          Evidence indices range from 0 to 1. The highest index wins; ties
          follow the canonical label order below. No confidence percentage is
          calculated.
        </p>
        <dl className="rubric-scores">
          {PLAYSTYLES.map((p) => (
            <div key={p.id}>
              <dt>{p.label}</dt>
              <dd>{num(c.scores[p.id])}</dd>
            </div>
          ))}
        </dl>
        <p>
          Category styles: 0.8 × share of actual spending + 0.2 × relevant
          engine-year share. Technology uses purchase earliness instead of
          engine share.
        </p>
        <p>
          Synergy: 0.35 × supporter-linked purchase share + 0.65 ×
          engine-essential purchase share. Adaptive: 0.75 × discounted purchase
          share in event years + 0.25 × mean change in category spending
          distribution.
        </p>
        <p>
          Exploratory: 1 − highest other index. With no purchases, all indices
          are 0 and Exploratory is a fallback. Starting cards are not counted as
          investment spending.
        </p>
        <p className="small-note">
          Rubric {c.version}. Export includes the full measured features and
          indices. Equal scores within 0.000000000001 use the order above.
          Rounded display values do not determine the winner.
        </p>
      </details>
    </>
  );
}
