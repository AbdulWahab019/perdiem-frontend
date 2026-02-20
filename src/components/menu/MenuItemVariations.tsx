/**
 * Price variations display for menu items.
 * Shows a dot-separated list for ≤3 variations, or an expandable accordion for more.
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MenuItemVariationDTO } from "../../types/catalog.types";
import { formatMoney } from "../../utils/price";

interface MenuItemVariationsProps {
  variations: MenuItemVariationDTO[];
}

export function MenuItemVariations({ variations }: MenuItemVariationsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (variations.length === 0) {
    return <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Price varies</p>;
  }

  // Single variation — just show the price
  if (variations.length === 1) {
    const v = variations[0];
    return (
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        {v.pricingType === "FIXED_PRICING" && v.priceMoney
          ? formatMoney(v.priceMoney)
          : "Market Price"}
      </p>
    );
  }

  // Multiple variations — inline pill list for ≤3, accordion for more
  if (variations.length <= 3) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {variations.map((v) => (
          <VariationPill key={v.id} variation={v} />
        ))}
      </div>
    );
  }

  // Accordion for 4+ variations
  const firstVariation = variations[0];
  const minPrice = getMinPrice(variations);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus-visible:underline"
        aria-expanded={isExpanded}
        aria-label="Show price variations"
      >
        <span className="font-bold">
          {minPrice !== null ? `From ${formatMoney({ amount: minPrice, currency: firstVariation.priceMoney?.currency ?? "USD" })}` : "Market Price"}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex flex-wrap gap-1.5">
              {variations.map((v) => (
                <VariationPill key={v.id} variation={v} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function VariationPill({ variation }: { variation: MenuItemVariationDTO }) {
  const priceStr =
    variation.pricingType === "FIXED_PRICING" && variation.priceMoney
      ? formatMoney(variation.priceMoney)
      : "Market Price";

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs text-gray-700 dark:text-gray-300">
      <span className="font-medium">{variation.name}</span>
      <span className="text-gray-500 dark:text-gray-400">{priceStr}</span>
    </span>
  );
}

function getMinPrice(variations: MenuItemVariationDTO[]): number | null {
  const prices = variations
    .filter((v) => v.pricingType === "FIXED_PRICING" && v.priceMoney)
    .map((v) => v.priceMoney!.amount);

  if (prices.length === 0) return null;
  return Math.min(...prices);
}
