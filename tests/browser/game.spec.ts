import { test, expect, type Page } from "@playwright/test";
import { createGame, endRound, confirmPlan } from "../../src/engine";
import { SAVE_KEY, replay } from "../../src/ui/session";
async function start(page: Page, profile = "Technology-Ready", seed = 123) {
  await page.goto("/");
  await page.getByRole("radio", { name: new RegExp(profile) }).check();
  await page.getByText("Reproducible game seed", { exact: true }).click();
  await page
    .getByLabel("Use the same seed, profile and choices to replay a journey.")
    .fill(String(seed));
  await page.getByRole("button", { name: /NEW GAME/ }).click();
  await expect(
    page.getByRole("heading", { name: "AVAILABLE ENABLERS" }),
  ).toBeVisible();
}
async function advance(page: Page, year: number) {
  const button = page.getByRole("button", {
    name: /^(CONFIRM INVESTMENTS|END YEAR)/,
  });
  await button.click();
  await page
    .getByRole("button", { name: `CONFIRM & END YEAR ${year}`, exact: true })
    .click();
  if (year < 5) {
    await expect(
      page.getByRole("dialog", { name: `Year ${year} complete` }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: `BEGIN YEAR ${year + 1}`, exact: true })
      .click();
  }
}
test("start screen profiles, help, fonts and responsive bounds", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("radio")).toHaveCount(4);
  await expect(
    page.getByRole("heading", {
      name: "SCHOOL TRANSFORMATION LAB",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: /HOW TO PLAY/ }).click();
  await expect(page.getByRole("dialog", { name: "How to play" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /HOW TO PLAY/ })).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () =>
        document.fonts.check("16px Oxanium") &&
        document.fonts.check("16px Inter"),
    ),
  ).toBe(true);
});
test("planning is reversible, filters work, details show locked supporters; spending waits for confirmation", async ({
  page,
}) => {
  await start(page, "Strategically Led");
  await page
    .getByRole("button", { name: "Add T1 to plan", exact: true })
    .click();
  await expect(page.getByTestId("budget")).toHaveText("6 / 8");
  await expect(page.getByTestId("actions")).toHaveText("2 / 3");
  await page
    .getByRole("button", { name: "Remove T1 from investment slot" })
    .click();
  await expect(page.getByTestId("budget")).toHaveText("8 / 8");
  await expect(page.getByTestId("actions")).toHaveText("3 / 3");
  await page.getByRole("button", { name: "Student (S)", exact: true }).click();
  await expect(page.getByTestId(/^card-/)).toHaveCount(4);
  await page.getByRole("button", { name: /View details for S3:/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("S1");
  await expect(dialog).toContainText("P3");
  await expect(dialog).toContainText("S2");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page
    .getByRole("button", { name: "Add T1 to plan", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Add G3 to plan", exact: true })
    .click();
  await page.getByRole("button", { name: /^CONFIRM INVESTMENTS/ }).click();
  await page
    .getByRole("button", { name: "KEEP PLANNING", exact: true })
    .click();
  await expect(page.getByTestId("budget")).toHaveText("4 / 8");
  await expect(page.getByTestId("actions")).toHaveText("1 / 3");
  const uncommitted = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    SAVE_KEY,
  );
  expect(uncommitted.actions).toEqual([]);
  await advance(page, 1);
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    SAVE_KEY,
  );
  expect(saved.actions).toEqual([
    { type: "confirmPlan", cards: ["T1", "G3"] },
    { type: "endRound" },
  ]);
  const expected = endRound(
    confirmPlan(createGame("Strategically Led", 123), ["T1", "G3"]),
  );
  await expect(page.getByTestId("budget")).toHaveText(
    `${expected.budget} / ${expected.openingBudget}`,
  );
  await expect(
    page.getByRole("heading", { name: "CURRENT EVENT" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("plays all five years and resumes a completed game without a fifth event", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await start(page, "Student-Centred", 88);
  for (let year = 1; year <= 5; year++) {
    for (let i = 0; i < 4; i++) {
      const available = page.locator(
        'button[aria-label^="Add "]:not(:disabled)',
      );
      if (!(await available.count())) break;
      await available.first().click();
    }
    await advance(page, year);
  }
  await expect(
    page.getByRole("heading", { name: "Your school journey is complete." }),
  ).toBeVisible();
  await expect(page).toHaveTitle("Final Report · School Transformation Lab");
  const saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)!),
    SAVE_KEY,
  );
  expect(
    saved.actions.filter((a: { type: string }) => a.type === "endRound"),
  ).toHaveLength(5);
  const expected = replay(saved);
  expect(expected.history.filter((r) => r.drawnEvent)).toHaveLength(4);
  expect(expected.owned.length).toBeGreaterThan(2);
  await expect(page.locator(".final-score")).toHaveText(
    new Intl.NumberFormat("en-SG", { maximumFractionDigits: 2 }).format(
      expected.score,
    ),
  );
  await page.reload();
  await page.getByRole("button", { name: /RESUME GAME/ }).click();
  await expect(
    page.getByRole("heading", { name: "Your school journey is complete." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("event-granted fourth investment slot is rendered from engine state", async ({
  page,
}) => {
  let seed = 0;
  while (seed < 1000) {
    const next = endRound(createGame("Technology-Ready", seed));
    if (next.actions === 4) break;
    seed++;
  }
  await start(page, "Technology-Ready", seed);
  await advance(page, 1);
  await expect(page.getByTestId("plan-slot")).toHaveCount(4);
  await expect(page.getByTestId("actions")).toHaveText("4 / 4");
});
test("keyboard can select profile, plan, review and confirm a year", async ({
  page,
}) => {
  await start(page, "Collaborative Teaching", 44);
  const add = page.getByRole("button", { name: "Add L1 to plan", exact: true });
  await add.focus();
  await page.keyboard.press("Enter");
  const confirm = page.getByRole("button", { name: /^CONFIRM INVESTMENTS/ });
  await confirm.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "CONFIRM & END YEAR 1", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Year 1 complete" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "BEGIN YEAR 2", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("saved game survives reload and unconfirmed plan is cleared", async ({
  page,
}) => {
  await start(page);
  await advance(page, 1);
  await page
    .getByRole("button", { name: "Add T1 to plan", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: /RESUME GAME/ }).click();
  await expect(
    page.getByRole("button", { name: "Add T1 to plan", exact: true }),
  ).toBeVisible();
  await expect(page.getByTestId("actions")).toHaveText(/^[234] \/ [234]$/);
});
test("corrupt saved data shows notice and permits starting fresh", async ({
  page,
}) => {
  await page.addInitScript(
    (key) => localStorage.setItem(key, "not valid JSON"),
    SAVE_KEY,
  );
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText(
    "saved game could not be read",
  );
  await expect(page.getByRole("button", { name: /RESUME GAME/ })).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: /NEW GAME/ }).click();
  await expect(
    page.getByRole("heading", { name: "AVAILABLE ENABLERS" }),
  ).toBeVisible();
});

test("catalogue category, availability and search persist into the next year", async ({
  page,
}) => {
  await start(page);
  await page.getByRole("button", { name: "Teacher (T)", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Card availability" })
    .selectOption("available");
  await page.getByRole("searchbox", { name: "Search enablers" }).fill("AI");
  await page
    .getByRole("button", { name: "Add T1 to plan", exact: true })
    .click();
  await advance(page, 1);
  await expect(
    page.getByRole("button", { name: "Teacher (T)", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("combobox", { name: "Card availability" }),
  ).toHaveValue("available");
  await expect(
    page.getByRole("searchbox", { name: "Search enablers" }),
  ).toHaveValue("AI");
  await expect(page.getByTestId("card-T1")).toHaveCount(0);
  await expect(page.getByTestId("card-T3")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Remove T1 from investment slot" }),
  ).toHaveCount(0);
});
test("random profile option sits above cards and can be replaced by a specific profile", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-actions button")).toHaveCount(2);
  const option = page.getByRole("button", {
    name: "Choose a random profile",
    exact: true,
  });
  await expect(page.locator(".profile-introduction")).toContainText(
    "Different strengths.",
  );
  await option.click();
  await expect(
    page.getByRole("button", { name: "Random profile selected", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("radio", { checked: true })).toHaveCount(0);
  await page.getByRole("radio", { name: /Student-Centred/ }).check();
  await expect(
    page.getByRole("button", { name: "Choose a random profile", exact: true }),
  ).toHaveAttribute("aria-pressed", "false");
  await option.click();
  await page.getByRole("button", { name: /NEW GAME/ }).click();
  await expect(
    page.getByRole("heading", { name: "AVAILABLE ENABLERS" }),
  ).toBeVisible();
});
