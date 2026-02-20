/**
 * Integration test: Dark mode toggle.
 * Toggle → class applied → persists in localStorage.
 *
 * Toggle cycle: system → light → dark → system
 * matchMedia is mocked to return false (system = light).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../context/ThemeContext";
import { Header } from "../../components/layout/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocationProvider } from "../../context/LocationContext";

function TestWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={qc}>
      <ThemeProvider>
        <LocationProvider>
          <Header />
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

describe("Dark mode", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders a dark mode toggle button", () => {
    render(<TestWrapper />);
    // Button label is one of "Switch to light mode", "Switch to dark mode", "Switch to system theme"
    const toggleBtn = screen.getByRole("button", { name: /switch to/i });
    expect(toggleBtn).toBeInTheDocument();
  });

  it("applies dark class when cycled to dark mode (click twice from system)", () => {
    render(<TestWrapper />);
    const toggleBtn = screen.getByRole("button", { name: /switch to/i });
    const htmlEl = document.documentElement;

    // Initial: system → matchMedia returns false → light → no dark class
    expect(htmlEl.classList.contains("dark")).toBe(false);

    // Click 1: system → light (still no dark class)
    fireEvent.click(toggleBtn);
    expect(htmlEl.classList.contains("dark")).toBe(false);

    // Click 2: light → dark (dark class added)
    fireEvent.click(screen.getByRole("button", { name: /switch to/i }));
    expect(htmlEl.classList.contains("dark")).toBe(true);
  });

  it("persists theme preference to localStorage after toggle", () => {
    render(<TestWrapper />);
    const toggleBtn = screen.getByRole("button", { name: /switch to/i });

    fireEvent.click(toggleBtn); // system → light

    const stored = localStorage.getItem("perdiem:theme");
    expect(stored).toBe('"light"');
  });

  it("removes dark class when cycling back from dark to system", () => {
    // Pre-set theme to dark
    localStorage.setItem("perdiem:theme", '"dark"');
    document.documentElement.classList.add("dark");

    render(<TestWrapper />);
    const htmlEl = document.documentElement;

    // Initial: dark
    expect(htmlEl.classList.contains("dark")).toBe(true);

    // Click: dark → system → matchMedia returns false → light → remove dark class
    fireEvent.click(screen.getByRole("button", { name: /switch to/i }));
    expect(htmlEl.classList.contains("dark")).toBe(false);
  });
});
