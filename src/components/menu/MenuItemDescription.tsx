/**
 * Truncatable item description with "Show more" / "Show less" toggle.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuItemDescriptionProps {
  description: string | null;
  descriptionHtml: string | null;
}

export function MenuItemDescription({ description, descriptionHtml }: MenuItemDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = description;
  if (!text) return null;

  const TRUNCATE_AT = 100;
  const needsTruncation = text.length > TRUNCATE_AT;

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      <AnimatePresence mode="wait">
        {isExpanded || !needsTruncation ? (
          <motion.p
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {text}
          </motion.p>
        ) : (
          <motion.p
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {text.slice(0, TRUNCATE_AT)}…
          </motion.p>
        )}
      </AnimatePresence>

      {needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-xs font-medium text-brand hover:text-brand-dark dark:text-brand dark:hover:text-brand focus:outline-none focus-visible:underline"
          aria-expanded={isExpanded}
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
