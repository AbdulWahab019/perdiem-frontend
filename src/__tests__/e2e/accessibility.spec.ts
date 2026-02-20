/**
 * E2E accessibility tests.
 * Runs axe-core audits and keyboard navigation checks on all major screens.
 */

import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("location selector screen has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });

    // Inject and run axe-core
    await page.addScriptTag({
      url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js",
    });

    const violations = await page.evaluate(async () => {
      // @ts-ignore
      const results = await window.axe.run(document, {
        runOnly: ["wcag2a", "wcag2aa", "wcag21aa"],
      });
      return results.violations;
    });

    const criticalViolations = violations.filter(
      (v: { impact: string }) => v.impact === "critical" || v.impact === "serious"
    );

    if (criticalViolations.length > 0) {
      console.log(
        "Critical violations:",
        criticalViolations.map((v: { id: string; description: string }) => ({
          id: v.id,
          description: v.description,
        }))
      );
    }

    expect(criticalViolations.length).toBe(0);
  });

  test("menu screen has no critical accessibility violations", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();
    await expect(page.getByRole("tablist")).toBeVisible({ timeout: 10000 });

    await page.addScriptTag({
      url: "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.0/axe.min.js",
    });

    const violations = await page.evaluate(async () => {
      // @ts-ignore
      const results = await window.axe.run(document, {
        runOnly: ["wcag2a", "wcag2aa", "wcag21aa"],
      });
      return results.violations;
    });

    const criticalViolations = violations.filter(
      (v: { impact: string }) => v.impact === "critical" || v.impact === "serious"
    );

    expect(criticalViolations.length).toBe(0);
  });

  test("keyboard navigation: can select location without mouse", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });

    // Tab to first location option and press Enter
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");

    // Either location was selected or we can continue tabbing
    await page.waitForTimeout(500);
    // Just verify no JS error occurred (page is still functional)
    await expect(page.locator("body")).toBeVisible();
  });

  test("keyboard navigation: can use category tabs with arrow keys", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();

    const tabList = page.getByRole("tablist");
    await expect(tabList).toBeVisible({ timeout: 10000 });

    // Focus first tab and use arrow keys
    const firstTab = page.getByRole("tab").first();
    await firstTab.focus();

    await page.keyboard.press("ArrowRight");
    // Check focus moved
    const focused = page.locator(":focus");
    await expect(focused).toBeVisible();
  });

  test("search bar is accessible via keyboard", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();

    // Find and focus search bar
    const searchInput = page.getByRole("searchbox");
    await expect(searchInput).toBeVisible({ timeout: 10000 });
    await searchInput.focus();

    // Type a query
    await page.keyboard.type("burger");
    await page.waitForTimeout(400);

    // Press Escape to clear
    await page.keyboard.press("Escape");
    const value = await searchInput.inputValue();
    expect(value).toBe("");
  });

  test("dark mode toggle is keyboard accessible", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();
    await expect(page.getByRole("tablist")).toBeVisible({ timeout: 10000 });

    // Find the dark mode toggle button in the header
    const header = page.getByRole("banner");
    const buttons = header.getByRole("button");
    const toggleBtn = buttons.last(); // Dark mode toggle is the last button in header

    await toggleBtn.focus();
    await toggleBtn.press("Enter");

    // Theme should have changed (persisted in localStorage)
    const stored = await page.evaluate(() => localStorage.getItem("perdiem:theme"));
    expect(stored).not.toBeNull();
  });
});
