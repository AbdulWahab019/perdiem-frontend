/**
 * Menu item card component.
 * Displays item image, name, description, and pricing.
 */

import { motion } from "framer-motion";
import type { MenuItemDTO } from "../../types/catalog.types";
import { MenuItemImage } from "./MenuItemImage";
import { MenuItemDescription } from "./MenuItemDescription";
import { MenuItemVariations } from "./MenuItemVariations";

interface MenuItemCardProps {
  item: MenuItemDTO;
  /** Animation delay index for staggered entrance */
  index?: number;
}

export function MenuItemCard({ item, index = 0 }: MenuItemCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3), ease: "easeOut" }}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      aria-labelledby={`item-name-${item.id}`}
    >
      {/* Item image */}
      <div className="aspect-3/2 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        <MenuItemImage
          src={item.imageUrl}
          alt={item.name}
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Item content */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h3
          id={`item-name-${item.id}`}
          className="font-semibold text-gray-900 dark:text-white text-[15px] leading-snug"
        >
          {item.name}
        </h3>

        {/* Description */}
        {item.description && (
          <MenuItemDescription
            description={item.description}
            descriptionHtml={item.descriptionHtml}
          />
        )}

        {/* Price / Variations */}
        <div className="pt-1">
          <MenuItemVariations variations={item.variations} />
        </div>
      </div>
    </motion.article>
  );
}
