import { useQuery } from "@tanstack/react-query";
import { fetchCatalog } from "../api/catalog.api";

/**
 * TanStack Query hook for fetching catalog items.
 * Only runs when locationId is provided.
 * Re-fetches when locationId or categoryId changes.
 */
export function useCatalog(locationId: string | null, categoryId?: string) {
  return useQuery({
    queryKey: ["catalog", locationId, categoryId],
    queryFn: () => fetchCatalog(locationId!, categoryId),
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}
