import { apiFetch } from "./client";
import type { CatalogResponse } from "../types/catalog.types";

/** Fetches menu items for a location, optionally filtered by category */
export async function fetchCatalog(
  locationId: string,
  categoryId?: string
): Promise<CatalogResponse> {
  const params = new URLSearchParams({ location_id: locationId });
  if (categoryId) params.append("category_id", categoryId);
  return apiFetch<CatalogResponse>(`/catalog?${params.toString()}`);
}
