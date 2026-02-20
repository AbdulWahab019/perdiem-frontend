/**
 * Integration test: Search flow.
 * Type query → items filter → clear → all items restore.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchBar } from "../../components/search/SearchBar";
import { MenuList } from "../../components/menu/MenuList";
import { ThemeProvider } from "../../context/ThemeContext";

function makeQC() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: 0 } },
  });
}

describe("Search flow", () => {
  it("SearchBar calls onSearch after typing", async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "burger" } });
    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledWith("burger");
    vi.useRealTimers();
  });

  it("SearchBar calls onSearch with empty string on clear", () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();

    render(<SearchBar onSearch={onSearch} />);

    const input = screen.getByRole("searchbox");
    fireEvent.change(input, { target: { value: "burger" } });
    vi.advanceTimersByTime(300);

    const clearBtn = screen.getByLabelText("Clear search");
    fireEvent.click(clearBtn);

    expect(onSearch).toHaveBeenLastCalledWith("");
    vi.useRealTimers();
  });

  it("MenuList shows empty state when search has no matches", async () => {
    render(
      <QueryClientProvider client={makeQC()}>
        <ThemeProvider>
          <MenuList
            locationId="LOC_1"
            selectedCategoryId={null}
            searchQuery="zzznomatch999"
          />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/no results for/i)).toBeInTheDocument();
    });
  });

  it("MenuList shows items when search matches", async () => {
    render(
      <QueryClientProvider client={makeQC()}>
        <ThemeProvider>
          <MenuList
            locationId="LOC_1"
            selectedCategoryId={null}
            searchQuery="burger"
          />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Classic Burger")).toBeInTheDocument();
    });
  });

  it("MenuList shows all items when search is empty", async () => {
    render(
      <QueryClientProvider client={makeQC()}>
        <ThemeProvider>
          <MenuList
            locationId="LOC_1"
            selectedCategoryId={null}
            searchQuery=""
          />
        </ThemeProvider>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Classic Burger")).toBeInTheDocument();
      expect(screen.getByText("Lemonade")).toBeInTheDocument();
    });
  });
});
