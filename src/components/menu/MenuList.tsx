/**
 * Full menu list component.
 * Fetches and displays items grouped by category.
 * Handles loading, error, and empty states.
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCatalog } from "../../hooks/useCatalog";
import { useSearch } from "../../hooks/useSearch";
import { MenuGroup } from "./MenuGroup";
import { MenuItemCard } from "./MenuItemCard";
import { MenuListSkeleton } from "../feedback/LoadingSkeleton";
import { ErrorState } from "../feedback/ErrorState";
import { EmptyState } from "../feedback/EmptyState";
import type { MenuItemDTO, MenuGroupDTO } from "../../types/catalog.types";

interface MenuListProps {
  locationId: string | null;
  selectedCategoryId: string | null;
  searchQuery?: string;
}

export function MenuList({ locationId, selectedCategoryId, searchQuery = "" }: MenuListProps) {
  const { data, isLoading, isError, error, refetch } = useCatalog(
    locationId,
    selectedCategoryId ?? undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const previousCategoryRef = useRef(selectedCategoryId);

  // Collect all items for searching — must be called before any early returns (Rules of Hooks)
  const allItems: MenuItemDTO[] = data?.menuGroups.flatMap((g) => g.items) ?? [];
  const filteredItems = useSearch(allItems, searchQuery);

  // Scroll to top when category changes
  useEffect(() => {
    if (previousCategoryRef.current !== selectedCategoryId) {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      previousCategoryRef.current = selectedCategoryId;
    }
  }, [selectedCategoryId]);

  if (isLoading) {
    return <MenuListSkeleton count={4} />;
  }

  if (isError) {
    return (
      <ErrorState
        message={(error as Error)?.message ?? "Failed to load menu items."}
        onRetry={() => refetch()}
        className="py-16"
      />
    );
  }

  if (!data || data.totalCount === 0) {
    return (
      <EmptyState
        title="No items found"
        description="This location doesn't have any menu items available."
        className="py-16"
      />
    );
  }

  // If searching and no results
  if (searchQuery && filteredItems.length === 0) {
    return (
      <EmptyState
        title={`No results for "${searchQuery}"`}
        description="Try a different search term."
        className="py-16"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      role="tabpanel"
      id="tabpanel-menu"
      aria-live="polite"
      aria-label="Menu items"
    >
      <AnimatePresence mode="wait">
        {searchQuery ? (
          // Search results: flat list with match count
          <motion.div
            key="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-4 pt-4 pb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
            </p>
            <div className="px-4 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredItems.map((item, index) => (
                <MenuItemCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </motion.div>
        ) : (
          // Normal view: grouped by category
          <motion.div
            key="grouped"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pb-8"
          >
            {data.menuGroups.map((group: MenuGroupDTO) => (
              <MenuGroup key={group.categoryId ?? "uncategorized"} group={group} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
