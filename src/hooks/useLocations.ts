import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "../api/locations.api";

/** TanStack Query hook for fetching locations */
export function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchLocations,
    staleTime: 1000 * 60 * 60, // 1 hour — locations rarely change
    retry: 2,
  });
}
