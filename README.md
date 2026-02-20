# perdiem-frontend

A mobile-first React SPA that displays restaurant menu items fetched from the perdiem backend. Built with React 19, Vite, and Tailwind CSS 4.

## Features

- **Location selector** — Choose from available Square locations with localStorage persistence
- **Category navigation** — Horizontal scrollable tabs with smooth animated active indicator
- **Menu items** — Name, description with "Show more" toggle, images with placeholder fallback, and prices/variations
- **Search bar** — 300ms debounced client-side filtering by name and description
- **Dark mode** — Light/Dark/System theme toggle persisted to localStorage
- **Mobile-first** — Optimized for 375px viewport (iPhone)
- **Loading states** — Animated skeleton screens
- **Error states** — User-friendly error messages with retry
- **Accessible** — ARIA labels, keyboard navigation, screen reader support

## Prerequisites

- Node.js 20+
- npm 9+
- perdiem-backend running on `http://localhost:3001`

## Setup

```bash
cd perdiem-frontend
npm install

# Optionally create a .env.local for custom settings
# VITE_API_BASE_URL=/api  (default, proxied to localhost:3001)
# VITE_API_KEY=           (leave empty for dev)
```

## Running

```bash
# Start the backend first (in perdiem-backend/)
# npm run dev

# Start the frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

For the full mobile experience, open Chrome DevTools → set viewport to **375 x 812** (iPhone 13).

## Views

### Location Selector (initial screen)
Full-screen card list of available restaurant locations. Tap/click to select. The selection persists across page refreshes.

### Menu View
After selecting a location:
- **Sticky header** — perdiem logo + selected location chip + dark mode toggle
- **Category tabs** — horizontally scrollable, "All" is always first, active tab has sliding underline
- **Search bar** — debounced input with clear (X) button and Escape key support
- **Menu items** — 16:9 image (lazy loaded), name, description, price(s) / variations

### Dark Mode
Toggle via the icon in the top-right corner of the header. Cycles through: **system → light → dark → system**.

## Architecture

```
src/
├── api/          # Fetch wrappers: fetchLocations, fetchCategories, fetchCatalog
├── context/      # ThemeContext (dark mode) + LocationContext (selected location)
├── hooks/        # TanStack Query hooks, useSearch, useDarkMode
├── components/
│   ├── layout/   # Header, MobileContainer
│   ├── location/ # LocationSelector
│   ├── category/ # CategoryTabs
│   ├── menu/     # MenuItemCard, MenuGroup, MenuList, MenuItemImage,
│   │             # MenuItemDescription, MenuItemVariations
│   ├── search/   # SearchBar
│   └── feedback/ # LoadingSkeleton, ErrorState, EmptyState
├── types/        # TypeScript DTOs (match backend shape)
└── utils/        # formatMoney, localStorage helpers, cn (tailwind-merge)
```

**State management:**
- **Server state** — TanStack Query v5 handles loading/error/stale/retry automatically
- **UI state** — React `useState` in `App.tsx` for selected category and search query
- **Persistent state** — `LocationContext` and `ThemeContext` sync with `localStorage`

**Data flow:**
```
App.tsx
  ├── LocationProvider (localStorage ↔ selectedLocationId)
  ├── ThemeProvider (localStorage ↔ theme, matchMedia for system)
  └── AppContent
        ├── [no location] → LocationSelector
        │     └── useLocations() → GET /api/locations
        └── [has location] → Header + CategoryTabs + SearchBar + MenuList
              ├── useCategories(locationId) → GET /api/catalog/categories
              └── useCatalog(locationId, categoryId) → GET /api/catalog
                    └── useSearch(items, query) → client-side filter (useMemo)
```

## Testing

```bash
# Unit + integration tests (Vitest + React Testing Library + MSW)
npm test

# With coverage report
npm run test:coverage

# Watch mode during development
npm run test:watch

# TypeScript type check
npm run typecheck

# E2E tests (requires both servers running on :3001 and :5173)
npm run test:e2e

# E2E with interactive Playwright UI
npm run test:e2e:ui
```

**Test layers:**

| Layer | Files | Tools | What it covers |
|-------|-------|-------|----------------|
| Unit | `src/__tests__/unit/` | Vitest + RTL | SearchBar debounce/clear/keyboard, MenuItemCard rendering, LocationSelector states, price formatting |
| Integration | `src/__tests__/integration/` | Vitest + RTL + MSW | Location→menu flow, search filter→clear→restore, dark mode toggle→persist |
| E2E | `src/__tests__/e2e/` | Playwright | Full browsing flow, location persistence, keyboard nav, axe-core accessibility audits |

**MSW** (`src/__tests__/mocks/`) intercepts all `/api/*` requests in unit/integration tests, returning deterministic fixture data. No network calls, no backend needed for unit/integration tests.

## Accessibility

- Location selector: `role="listbox"` / `role="option"` with keyboard navigation
- Category tabs: `role="tablist"` / `role="tab"` with `aria-selected`, arrow key navigation
- Search: `role="search"`, `aria-label="Search menu items"`, Escape to clear
- Error states: `role="alert"` for screen reader announcement
- All buttons have descriptive `aria-label`
- Dark mode toggle cycles through meaningful labels: "Switch to light mode", "Switch to dark mode", "Switch to system theme"

## Animations

Built with Framer Motion:
- Page transitions: `AnimatePresence` fade/slide between location selector and menu
- Staggered card entrance: 50ms delay per card
- Category tab indicator: `layoutId` animation for smooth slide
- Description expand/collapse: smooth height animation
- Clear button: scale+opacity enter/exit
- All animations disabled when `prefers-reduced-motion: reduce` (via `index.css`)

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| React 19 + Vite 7 | Latest versions from Vite scaffold. Forward-compatible and fast. |
| TanStack Query v5 | Declarative server-state with automatic caching, background refetch, retry. |
| Framer Motion | Smooth exit animations (AnimatePresence), layout animations, gesture support. |
| Tailwind CSS 4 | Single `@import "tailwindcss"` — no config file. Custom utilities via `@utility`. |
| Client-side search | Menu is 50-200 items — instant `useMemo` filter, no API round trip. |
| Three-mode dark | OS default (`system`) → user can override to `light` or `dark`. |
| MSW for tests | Intercepts at the network level — tests the real API client without mocking fetch. |

## Known Limitations

- Images depend on Square Catalog API providing image URLs. Items without images show a Utensils icon placeholder.
- The app requires the perdiem-backend to be running (or `VITE_API_BASE_URL` configured to point elsewhere).
- E2E tests require real Square sandbox credentials and internet access.
