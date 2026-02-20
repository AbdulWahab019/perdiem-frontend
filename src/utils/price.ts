/**
 * Price formatting utilities.
 * Converts Square Money amounts (in cents) to human-readable currency strings.
 */

import type { MoneyDTO } from "../types/catalog.types";

/**
 * Formats a money amount in cents to a currency string.
 * e.g. { amount: 1250, currency: "USD" } → "$12.50"
 */
export function formatMoney(money: MoneyDTO): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency || "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(money.amount / 100);
}

/**
 * Formats cents directly to currency string.
 * e.g. formatPrice(1250, "USD") → "$12.50"
 */
export function formatPrice(amountInCents: number, currency = "USD"): string {
  return formatMoney({ amount: amountInCents, currency });
}
