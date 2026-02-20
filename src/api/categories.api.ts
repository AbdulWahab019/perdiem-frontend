import { apiFetch } from "./client";
import type { CategoryDTO, CategoriesResponse } from "../types/category.types";

/** Fetches categories available at a specific location */
export async function fetchCategories(locationId: string): Promise<CategoryDTO[]> {
  const response = await apiFetch<CategoriesResponse>(
    `/catalog/categories?location_id=${encodeURIComponent(locationId)}`
  );
  return response.categories;
}
