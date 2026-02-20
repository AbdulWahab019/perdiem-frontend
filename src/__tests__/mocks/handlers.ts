/**
 * MSW request handlers for frontend tests.
 * Intercepts API calls and returns mock responses.
 */

import { http, HttpResponse } from "msw";

export const mockLocations = [
  {
    id: "LOC_1",
    name: "Downtown",
    status: "ACTIVE" as const,
    address: { line1: "100 Main St", city: "Chicago", state: "IL", postalCode: "60601", country: "US" },
    timezone: "America/Chicago",
  },
  {
    id: "LOC_2",
    name: "Uptown",
    status: "ACTIVE" as const,
    address: null,
    timezone: "America/Chicago",
  },
];

export const mockCategories = [
  { id: "CAT_1", name: "Burgers", itemCount: 3 },
  { id: "CAT_2", name: "Drinks", itemCount: 5 },
];

export const mockMenuItems = [
  {
    id: "ITEM_1",
    name: "Classic Burger",
    description: "A juicy beef patty with fresh toppings",
    descriptionHtml: null,
    imageUrl: null,
    categoryId: "CAT_1",
    categoryName: "Burgers",
    variations: [
      {
        id: "VAR_1",
        name: "Regular",
        pricingType: "FIXED_PRICING",
        priceMoney: { amount: 1200, currency: "USD" },
      },
    ],
  },
  {
    id: "ITEM_2",
    name: "Lemonade",
    description: "Fresh-squeezed lemonade",
    descriptionHtml: null,
    imageUrl: null,
    categoryId: "CAT_2",
    categoryName: "Drinks",
    variations: [
      {
        id: "VAR_2",
        name: "Small",
        pricingType: "FIXED_PRICING",
        priceMoney: { amount: 350, currency: "USD" },
      },
      {
        id: "VAR_3",
        name: "Large",
        pricingType: "FIXED_PRICING",
        priceMoney: { amount: 500, currency: "USD" },
      },
    ],
  },
];

export const mockCatalogResponse = {
  menuGroups: [
    { categoryId: "CAT_1", categoryName: "Burgers", items: [mockMenuItems[0]] },
    { categoryId: "CAT_2", categoryName: "Drinks", items: [mockMenuItems[1]] },
  ],
  totalCount: 2,
};

export const handlers = [
  http.get("/api/locations", () => {
    return HttpResponse.json({ locations: mockLocations });
  }),

  http.get("/api/catalog/categories", () => {
    return HttpResponse.json({ categories: mockCategories });
  }),

  http.get("/api/catalog", () => {
    return HttpResponse.json(mockCatalogResponse);
  }),
];

export const errorHandlers = [
  http.get("/api/locations", () => {
    return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }),
  http.get("/api/catalog/categories", () => {
    return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }),
  http.get("/api/catalog", () => {
    return HttpResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }),
];
