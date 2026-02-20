/**
 * Menu group component.
 * Displays a category heading followed by staggered item cards.
 */

import { motion } from "framer-motion";
import type { MenuGroupDTO } from "../../types/catalog.types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuGroupProps {
  group: MenuGroupDTO;
}

export function MenuGroup({ group }: MenuGroupProps) {
  if (group.items.length === 0) return null;

  return (
    <section aria-labelledby={`category-heading-${group.categoryId ?? "uncategorized"}`}>
      {/* Category heading */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="px-4 pt-6 pb-3"
      >
        <h2
          id={`category-heading-${group.categoryId ?? "uncategorized"}`}
          className="text-lg font-bold text-gray-900 dark:text-white tracking-tight"
        >
          {group.categoryName}
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          {group.items.length} {group.items.length === 1 ? "item" : "items"}
        </p>
      </motion.div>

      {/* Item grid — 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="px-4 pb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {group.items.map((item, index) => (
          <MenuItemCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
