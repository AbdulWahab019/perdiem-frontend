/**
 * Empty state component.
 * Shown when there are no items to display.
 */

import { UtensilsCrossed } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  title = "No items found",
  description = "Try selecting a different category or location.",
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center gap-4 p-12 text-center ${className ?? ""}`}
    >
      <UtensilsCrossed
        className="h-12 w-12 text-gray-300 dark:text-gray-600"
        aria-hidden="true"
      />
      <div className="space-y-1">
        <p className="text-base font-medium text-gray-700 dark:text-gray-300">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
}
