/**
 * Integration test: Full menu browsing flow.
 * Location selection → categories load → items render.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../../context/ThemeContext";
import { LocationProvider } from "../../context/LocationContext";
import { LocationSelector } from "../../components/location/LocationSelector";
import { CategoryTabs } from "../../components/category/CategoryTabs";
import { MenuList } from "../../components/menu/MenuList";
import { mockLocations, mockCategories } from "../mocks/handlers";

function AppTestWrapper({ selectedLocationId }: { selectedLocationId?: string }) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });

  const initialLocations = selectedLocationId
    ? mockLocations.filter((l) => l.id === selectedLocationId)
    : mockLocations;

  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <LocationProvider availableLocations={initialLocations}>
          {!selectedLocationId ? (
            <LocationSelector />
          ) : (
            <>
              <CategoryTabs
                locationId={selectedLocationId}
                selectedCategoryId={null}
                onCategorySelect={vi.fn()}
              />
              <MenuList
                locationId={selectedLocationId}
                selectedCategoryId={null}
                searchQuery=""
              />
            </>
          )}
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe("Menu browsing flow", () => {
  it("shows location selector initially", async () => {
    render(<AppTestWrapper />);

    await waitFor(() => {
      expect(screen.getByText("Downtown")).toBeInTheDocument();
    });
  });

  it("shows all locations in the selector", async () => {
    render(<AppTestWrapper />);

    await waitFor(() => {
      expect(screen.getByText("Downtown")).toBeInTheDocument();
      expect(screen.getByText("Uptown")).toBeInTheDocument();
    });
  });

  it("loads categories for a selected location", async () => {
    render(<AppTestWrapper selectedLocationId="LOC_1" />);

    await waitFor(() => {
      expect(screen.getByText("Burgers")).toBeInTheDocument();
      expect(screen.getByText("Drinks")).toBeInTheDocument();
    });
  });

  it("renders menu items for a location", async () => {
    render(<AppTestWrapper selectedLocationId="LOC_1" />);

    await waitFor(() => {
      expect(screen.getByText("Classic Burger")).toBeInTheDocument();
    });
  });

  it("renders the price for menu items", async () => {
    render(<AppTestWrapper selectedLocationId="LOC_1" />);

    await waitFor(() => {
      expect(screen.getByText("$12.00")).toBeInTheDocument();
    });
  });

  it("renders All tab as first category tab", async () => {
    render(<AppTestWrapper selectedLocationId="LOC_1" />);

    await waitFor(() => {
      const allTab = screen.getByRole("tab", { name: "All" });
      expect(allTab).toBeInTheDocument();
    });
  });
});
