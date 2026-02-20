/**
 * Unit tests for price formatting utilities.
 */

import { describe, it, expect } from "vitest";
import { formatMoney, formatPrice } from "../../../utils/price";

describe("formatMoney", () => {
  it("formats cents to a USD string", () => {
    expect(formatMoney({ amount: 1250, currency: "USD" })).toBe("$12.50");
  });

  it("formats whole dollar amounts with .00", () => {
    expect(formatMoney({ amount: 500, currency: "USD" })).toBe("$5.00");
  });

  it("formats zero", () => {
    expect(formatMoney({ amount: 0, currency: "USD" })).toBe("$0.00");
  });

  it("formats large amounts correctly", () => {
    expect(formatMoney({ amount: 9999, currency: "USD" })).toBe("$99.99");
  });

  it("uses USD as fallback when currency is empty string", () => {
    const result = formatMoney({ amount: 100, currency: "" });
    expect(result).toBe("$1.00");
  });
});

describe("formatPrice", () => {
  it("formats cents with default USD", () => {
    expect(formatPrice(1200)).toBe("$12.00");
  });

  it("formats cents with explicit currency", () => {
    const result = formatPrice(500, "USD");
    expect(result).toBe("$5.00");
  });

  it("formats a single cent correctly", () => {
    expect(formatPrice(1)).toBe("$0.01");
  });
});
