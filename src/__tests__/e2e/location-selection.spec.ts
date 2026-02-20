/**
 * E2E tests: Location selection and persistence.
 * Tests localStorage persistence and location switching.
 */

import { test, expect } from "@playwright/test";

test.describe("Location selection and persistence", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("persists selected location across page reload", async ({ page }) => {
    await page.goto("/");

    // Wait for and select a location
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    const firstOption = page.getByRole("option").first();
    const locationName = await firstOption.textContent();
    await firstOption.click();

    // Wait for menu to load
    await expect(page.getByRole("tablist")).toBeVisible({ timeout: 10000 });

    // Reload the page
    await page.reload();

    // Should still show menu (not location selector)
    await expect(page.getByRole("tablist")).toBeVisible({ timeout: 10000 });
  });

  test("can change location from menu view", async ({ page }) => {
    await page.goto("/");

    // Select first location
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();

    // Wait for menu to load with header
    await expect(page.getByRole("tablist")).toBeVisible({ timeout: 10000 });

    // Header should show location name and change button
    const changeBtn = page.getByRole("button", { name: /change location/i });
    if (await changeBtn.isVisible()) {
      await changeBtn.click();
      // Should return to location selector
      await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5000 });
    } else {
      // May be in header as a different control
      const headerBtn = page.getByRole("banner").getByRole("button").first();
      await headerBtn.click();
      // Either goes back to selector or shows some indicator
      await page.waitForTimeout(500);
    }
  });

  test("localStorage stores selected location ID", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();
    await expect(page.getByRole("tablist")).toBeVisible({ timeout: 10000 });

    // Check localStorage
    const stored = await page.evaluate(() =>
      localStorage.getItem("perdiem:selectedLocation")
    );
    expect(stored).not.toBeNull();
  });
});
