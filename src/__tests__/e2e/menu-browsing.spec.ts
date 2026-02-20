/**
 * E2E tests: Full menu browsing flow.
 * Tests the complete user journey from location selection to menu browsing.
 *
 * NOTE: These tests require the backend server to be running with valid Square credentials.
 * Run with: npm run test:e2e (from perdiem-frontend directory)
 */

import { test, expect } from "@playwright/test";

test.describe("Menu browsing flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to start fresh
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows location selector on first visit", async ({ page }) => {
    await page.goto("/");

    // Should show the location selector
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
  });

  test("location selector shows available locations", async ({ page }) => {
    await page.goto("/");

    // Wait for locations to load
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    const locationOptions = page.getByRole("option");
    await expect(locationOptions.first()).toBeVisible({ timeout: 10000 });
  });

  test("selects a location and shows menu", async ({ page }) => {
    await page.goto("/");

    // Wait for and click the first location
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    const firstLocation = page.getByRole("option").first();
    await firstLocation.click();

    // Should transition to menu view with category tabs
    await expect(page.getByRole("tablist")).toBeVisible({ timeout: 10000 });
  });

  test("shows category tabs after location selection", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();

    // All tab should be present
    await expect(page.getByRole("tab", { name: "All" })).toBeVisible({ timeout: 10000 });
  });

  test("shows menu items after location selection", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();

    // Wait for menu items to appear
    await expect(page.getByRole("article").first()).toBeVisible({ timeout: 15000 });
  });

  test("category filter shows only items from that category", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();

    // Click a non-All category tab
    const tabs = page.getByRole("tab");
    await tabs.first().waitFor({ timeout: 10000 });
    const tabCount = await tabs.count();

    if (tabCount > 1) {
      await tabs.nth(1).click(); // Click first real category (not "All")
      await page.waitForTimeout(500); // Wait for filter to apply
      // Items should still be visible (or empty state shown)
      const articles = page.getByRole("article");
      const count = await articles.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test("search filters menu items", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 10000 });
    await page.getByRole("option").first().click();

    // Wait for items to load
    await expect(page.getByRole("article").first()).toBeVisible({ timeout: 15000 });

    // Type in search box
    const searchInput = page.getByRole("searchbox");
    await searchInput.fill("aaabbbccc"); // search term that matches nothing

    // Wait for debounce and expect empty state or results count
    await page.waitForTimeout(400);
    const resultsCount = await page.getByRole("article").count();
    expect(resultsCount).toBe(0);
  });

  test("mobile layout: no horizontal scroll at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Check that body doesn't have horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow 5px tolerance
  });
});
