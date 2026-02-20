/** Catalog/menu item data from /api/catalog */
export interface MoneyDTO {
  amount: number;     // In cents
  currency: string;   // ISO 4217 (e.g. "USD")
}

export interface MenuItemVariationDTO {
  id: string;
  name: string;
  priceMoney: MoneyDTO | null;
  pricingType: "FIXED_PRICING" | "VARIABLE_PRICING";
}

export interface MenuItemDTO {
  id: string;
  name: string;
  description: string | null;
  descriptionHtml: string | null;
  imageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  variations: MenuItemVariationDTO[];
}

export interface MenuGroupDTO {
  categoryId: string | null;
  categoryName: string;
  items: MenuItemDTO[];
}

export interface CatalogResponse {
  menuGroups: MenuGroupDTO[];
  totalCount: number;
}
