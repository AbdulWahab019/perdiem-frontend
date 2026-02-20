/** Category data from /api/catalog/categories */
export interface CategoryDTO {
  id: string;
  name: string;
  itemCount: number;
}

export interface CategoriesResponse {
  categories: CategoryDTO[];
}
