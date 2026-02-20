import { useMemo } from "react";
import type { MenuItemDTO } from "../types/catalog.types";

/**
 * Client-side search hook.
 * Filters menu items by name or description (case-insensitive).
 * Uses useMemo to avoid re-filtering on every render.
 *
 * @param items - The full list of menu items to search
 * @param query - The search query string
 * @returns Filtered items matching the query, or all items if query is empty
 */
export function useSearch(items: MenuItemDTO[], query: string): MenuItemDTO[] {
  return useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return items;

    const lowerQuery = trimmed.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.description?.toLowerCase().includes(lowerQuery) ?? false)
    );
  }, [items, query]);
}
