import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { finishYear, newSession, SAVE_KEY } from "../../src/ui/session";
import { buildReport } from "../../src/report/model";
function completed() {
  let s = newSession("Strategically Led", 123);
  s = finishYear(s, ["T1", "G3"]);
  for (let i = 0; i < 4; i++) s = finishYear(s, []);
  return s;
}
// Keep Node tests independent of browser-only artwork/CSS imports in shared.tsx.
const number = (n: number) =>
  new Intl.NumberFormat("en-SG", { maximumFractionDigits: 2 }).format(n);
test.beforeEach(async ({ page }) => {
  const session = completed();
  await page.addInitScript(
    ({ key, session }) => localStorage.setItem(key, JSON.stringify(session)),
    { key: SAVE_KEY, session },
  );
  await page.goto("/");
  await page.getByRole("button", { name: /RESUME GAME/ }).click();
});
test("report shows engine-derived charts, year details, capabilities and explainable playstyle", async ({
  page,
}) => {
  const r = buildReport(completed());
  await expect(
    page.getByRole("heading", { name: "FINAL REPORT", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".final-score")).toHaveText(number(r.totalScore));
  await expect(page.getByTestId("playstyle-label")).toHaveText(
    r.classification.label,
  );
  await expect(
    page.getByRole("img", { name: /Five-year Sensing/ }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "View Year 1 details", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Year 1 · Decisions and outcomes" }),
  ).toBeVisible();
  await expect(page.locator(".report-purchases")).toContainText("T1");
  await expect(page.locator(".report-purchases")).toContainText("G3");
  await expect(page.locator(".year-detail")).toContainText(
    "No event affected Year 1.",
  );
  await page.getByRole("button", { name: "YEAR 5", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".year-detail")).toContainText(
    "No event drawn after Year 5.",
  );
  await page
    .getByText("Why this label? View the rubric", { exact: true })
    .click();
  await expect(page.locator(".rubric-scores > div")).toHaveCount(7);
  await expect(page.locator(".classification-method")).toContainText(
    "evidence-v1",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "modelling", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "modelling", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  const rows = page.getByRole("table").getByRole("row");
  await expect(rows).toHaveCount(6);
});
test("JSON download includes exact results, source commands and classification provenance", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "EXPORT REPORT", exact: true })
    .click();
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: /DOWNLOAD JSON/ }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe(
    "school-transformation-lab-123.json",
  );
  const payload = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(payload.report).toEqual(buildReport(completed()));
  expect(payload.session).toEqual(completed());
  expect(payload.report.classification.version).toBe("evidence-v1");
  await expect(page.getByRole("status")).toContainText(
    "Report JSON downloaded",
  );
});
test("print export invokes print after closing dialog; print layout includes full engine and inventory details", async ({
  page,
}, info) => {
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printed = "true";
    };
  });
  await page
    .getByRole("button", { name: "EXPORT REPORT", exact: true })
    .click();
  await page.getByRole("button", { name: /PRINT \/ SAVE AS PDF/ }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("html")).toHaveAttribute("data-printed", "true");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".report-engine > div").first()).toBeVisible();
  await expect(page.locator(".final-inventory > ul")).toBeVisible();
  await expect(page.locator(".report-actions")).toBeHidden();
  await expect(page.getByRole("table")).toBeVisible();
  const pdf = await page.pdf({
    path: info.outputPath("school-report.pdf"),
    format: "A4",
    printBackground: true,
  });
  expect(pdf.subarray(0, 4).toString()).toBe("%PDF");
  expect(pdf.length).toBeGreaterThan(10000);
});
test("menu and replay preserve the completed report until a new game is confirmed", async ({
  page,
}) => {
  await page.getByRole("button", { name: "PLAY AGAIN", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "CHOOSE YOUR STARTING SCHOOL",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: /NEW GAME/ }).click();
  await expect(
    page.getByRole("dialog", { name: "Start a new school journey?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "KEEP CURRENT GAME", exact: true })
    .click();
  await page.getByRole("button", { name: /RESUME GAME/ }).click();
  await expect(
    page.getByRole("heading", { name: "FINAL REPORT", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "RETURN TO MENU", exact: true })
    .click();
  await expect(page.getByRole("button", { name: /RESUME GAME/ })).toBeVisible();
});
