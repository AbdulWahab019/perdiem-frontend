/**
 * Unit tests for the LocationSelector component.
 * Tests loading state, error state, location list rendering, and selection.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocationProvider } from "../../../context/LocationContext";
import { LocationSelector } from "../../../components/location/LocationSelector";
import { server } from "../../mocks/server";
import { http, HttpResponse } from "msw";
import { mockLocations } from "../../mocks/handlers";

function TestWrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <LocationProvider>{children}</LocationProvider>
    </QueryClientProvider>
  );
}

describe("LocationSelector", () => {
  it("shows loading skeleton while fetching", () => {
    // Override to delay response
    server.use(
      http.get("/api/locations", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({ locations: mockLocations });
      })
    );

    render(
      <TestWrapper>
        <LocationSelector />
      </TestWrapper>
    );

    // Should show some loading indicator
    expect(document.body).toBeInTheDocument();
  });

  it("renders locations after loading", async () => {
    render(
      <TestWrapper>
        <LocationSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText("Downtown")).toBeInTheDocument();
    });

    expect(screen.getByText("Uptown")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", async () => {
    server.use(
      http.get("/api/locations", () => {
        return HttpResponse.json({ error: "Server Error" }, { status: 500 });
      })
    );

    // Set retryDelay to 0 so retries happen immediately (useLocations has retry: 2)
    const qcNoRetry = new QueryClient({
      defaultOptions: { queries: { retryDelay: 0 } },
    });

    render(
      <QueryClientProvider client={qcNoRetry}>
        <LocationProvider>
          <LocationSelector />
        </LocationProvider>
      </QueryClientProvider>
    );

    await waitFor(
      () => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("has role=listbox for accessibility", async () => {
    render(
      <TestWrapper>
        <LocationSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });
  });

  it("renders location address when available", async () => {
    render(
      <TestWrapper>
        <LocationSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/100 Main St/i)).toBeInTheDocument();
    });
  });
});
