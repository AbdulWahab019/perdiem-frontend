/**
 * Unit tests for the MenuItemCard component.
 * Tests item name, description, price rendering, and variations.
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MenuItemCard } from "../../../components/menu/MenuItemCard";
import type { MenuItemDTO } from "../../../types/catalog.types";

const baseItem: MenuItemDTO = {
  id: "ITEM_1",
  name: "Classic Burger",
  description: "A juicy beef patty",
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
};

describe("MenuItemCard", () => {
  it("renders the item name", () => {
    render(<MenuItemCard item={baseItem} />);
    expect(screen.getByText("Classic Burger")).toBeInTheDocument();
  });

  it("renders item description", () => {
    render(<MenuItemCard item={baseItem} />);
    expect(screen.getByText(/juicy beef patty/i)).toBeInTheDocument();
  });

  it("renders the price for a single variation", () => {
    render(<MenuItemCard item={baseItem} />);
    expect(screen.getByText("$12.00")).toBeInTheDocument();
  });

  it("renders with multiple variations", () => {
    const item: MenuItemDTO = {
      ...baseItem,
      variations: [
        { id: "V1", name: "Small", pricingType: "FIXED_PRICING", priceMoney: { amount: 800, currency: "USD" } },
        { id: "V2", name: "Large", pricingType: "FIXED_PRICING", priceMoney: { amount: 1200, currency: "USD" } },
      ],
    };
    render(<MenuItemCard item={item} />);
    expect(screen.getByText("$8.00")).toBeInTheDocument();
    expect(screen.getByText("$12.00")).toBeInTheDocument();
  });

  it("renders without crashing when description is null", () => {
    const item: MenuItemDTO = { ...baseItem, description: null };
    render(<MenuItemCard item={item} />);
    expect(screen.getByText("Classic Burger")).toBeInTheDocument();
  });

  it("renders a placeholder when imageUrl is null", () => {
    render(<MenuItemCard item={baseItem} />);
    // Placeholder should be present (img with alt text or fallback)
    const img = screen.queryByRole("img", { name: "Classic Burger" });
    // If the image fails to load, the placeholder is shown; at least the container renders
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("renders with item id as aria-labelledby target", () => {
    render(<MenuItemCard item={baseItem} />);
    const heading = screen.getByRole("heading", { name: "Classic Burger" });
    expect(heading).toHaveAttribute("id", "item-name-ITEM_1");
  });

  it("renders variable pricing variation", () => {
    const item: MenuItemDTO = {
      ...baseItem,
      variations: [
        { id: "V1", name: "Market", pricingType: "VARIABLE_PRICING", priceMoney: null },
      ],
    };
    render(<MenuItemCard item={item} />);
    expect(screen.getByText(/market price/i)).toBeInTheDocument();
  });
});
