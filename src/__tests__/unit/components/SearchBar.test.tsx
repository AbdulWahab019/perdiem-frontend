/**
 * Unit tests for the SearchBar component.
 * Tests debouncing, clear button, keyboard handling, and accessibility.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../../../components/search/SearchBar";

describe("SearchBar", () => {
  let onSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSearch = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it("renders with placeholder text", () => {
    render(<SearchBar onSearch={onSearch} />);
    expect(screen.getByPlaceholderText("Search menu...")).toBeInTheDocument();
  });

  it("renders with custom placeholder", () => {
    render(<SearchBar onSearch={onSearch} placeholder="Find items..." />);
    expect(screen.getByPlaceholderText("Find items...")).toBeInTheDocument();
  });

  it("has search role for accessibility", () => {
    render(<SearchBar onSearch={onSearch} />);
    expect(screen.getByRole("search")).toBeInTheDocument();
  });

  it("calls onSearch after debounce delay (300ms)", async () => {
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "burger" } });

    // Not called immediately
    expect(onSearch).not.toHaveBeenCalled();

    // Advance by 300ms
    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledWith("burger");
  });

  it("does not call onSearch before debounce delay", () => {
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "burger" } });
    vi.advanceTimersByTime(200); // Only 200ms

    expect(onSearch).not.toHaveBeenCalled();
  });

  it("debounces rapid typing to only call once", () => {
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "b" } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: "bu" } });
    vi.advanceTimersByTime(100);
    fireEvent.change(input, { target: { value: "bur" } });
    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledOnce();
    expect(onSearch).toHaveBeenCalledWith("bur");
  });

  it("shows clear button when input has text", async () => {
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");

    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();

    fireEvent.change(input, { target: { value: "hello" } });

    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("clears input and calls onSearch('') when clear button is clicked", () => {
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "burger" } });
    vi.advanceTimersByTime(300);

    const clearButton = screen.getByLabelText("Clear search");
    fireEvent.click(clearButton);

    expect((input as HTMLInputElement).value).toBe("");
    expect(onSearch).toHaveBeenLastCalledWith("");
  });

  it("clears input on Escape key press", () => {
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "burger" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect((input as HTMLInputElement).value).toBe("");
    expect(onSearch).toHaveBeenCalledWith("");
  });

  it("hides clear button when input is empty", async () => {
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole("searchbox");

    fireEvent.change(input, { target: { value: "burger" } });
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "" } });
    // AnimatePresence keeps the element in DOM during exit animation (opacity: 0)
    const clearBtn = screen.queryByLabelText("Clear search");
    if (clearBtn) {
      // If still in DOM due to exit animation, it should be hidden (opacity 0)
      expect(clearBtn).not.toBeVisible();
    } else {
      // Fully removed from DOM — also acceptable
      expect(clearBtn).toBeNull();
    }
  });
});
