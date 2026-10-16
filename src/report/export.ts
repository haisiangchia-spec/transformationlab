import { buildReport } from "./model";
import type { Session } from "../ui/session";
/** Stable output: no wall-clock timestamps, browser state or rounded source values. */
export function reportJSON(session: Session) {
  return (
    JSON.stringify(
      {
        schemaVersion: 1,
        rulesVersion: "1.0",
        game: "School Transformation Lab",
        session: structuredClone(session),
        report: buildReport(session),
      },
      null,
      2,
    ) + "\n"
  );
}
export function downloadReport(session: Session) {
  const url = URL.createObjectURL(
    new Blob([reportJSON(session)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `school-transformation-lab-${session.seed}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  // Allow the browser to consume the download before releasing its object URL.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
