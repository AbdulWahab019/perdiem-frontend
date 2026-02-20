/**
 * Category navigation tabs.
 * Horizontal scrollable tabs with smooth active indicator animation.
 * Always renders at least an "All" tab.
 */

import { useEffect, useRef, type KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useCategories } from "../../hooks/useCategories";
import { CategoryTabsSkeleton } from "../feedback/LoadingSkeleton";
import { cn } from "../../utils/cn";

interface CategoryTabsProps {
  locationId: string | null;
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryTabs({
  locationId,
  selectedCategoryId,
  onCategorySelect,
}: CategoryTabsProps) {
  const { data: categories, isLoading } = useCategories(locationId);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (!tabListRef.current) return;
    const activeTab = tabListRef.current.querySelector('[aria-selected="true"]');
    activeTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedCategoryId]);

  // Keyboard navigation: left/right arrows
  const handleKeyDown = (e: KeyboardEvent<HTMLElement>, currentIndex: number) => {
    const tabs = tabListRef.current?.querySelectorAll('[role="tab"]');
    if (!tabs) return;

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight") {
      nextIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    (tabs[nextIndex] as HTMLElement).focus();
    (tabs[nextIndex] as HTMLElement).click();
  };

  if (isLoading) {
    return <CategoryTabsSkeleton />;
  }

  // Always include "All" tab; append any fetched categories
  const allTabs = [
    { id: null as string | null, name: "All" },
    ...(categories ?? []).map((c) => ({ id: c.id, name: c.name })),
  ];

  // If only "All" exists, still render — user can see the navigation bar
  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Menu categories"
      className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-14 z-40 transition-colors duration-300"
    >
      {allTabs.map((tab, index) => {
        const isSelected = tab.id === selectedCategoryId;
        return (
          <Tab
            key={tab.id ?? "all"}
            id={`tab-${tab.id ?? "all"}`}
            label={tab.name}
            isSelected={isSelected}
            onSelect={() => onCategorySelect(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          />
        );
      })}
    </div>
  );
}

interface TabProps {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
}

function Tab({ id, label, isSelected, onSelect, onKeyDown }: TabProps) {
  return (
    <motion.button
      role="tab"
      id={id}
      aria-selected={isSelected}
      aria-controls="tabpanel-menu"
      onClick={onSelect}
      onKeyDown={onKeyDown}
      tabIndex={isSelected ? 0 : -1}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1 dark:focus-visible:ring-offset-gray-900",
        isSelected
          ? "text-white bg-brand"
          : "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
      )}
    >
      {label}
    </motion.button>
  );
}
