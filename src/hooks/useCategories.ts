import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/categories.api";

/**
 * TanStack Query hook for fetching categories by location.
 * Only runs when locationId is provided.
 */
export function useCategories(locationId: string | null) {
  return useQuery({
    queryKey: ["categories", locationId],
    queryFn: () => fetchCategories(locationId!),
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
