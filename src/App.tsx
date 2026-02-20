/**
 * Root application component.
 * Manages the high-level UI flow:
 *   1. No location selected → show LocationSelector (full screen)
 *   2. Location selected → show Header + CategoryTabs + SearchBar + MenuList
 */

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "./context/ThemeContext";
import { LocationProvider, useLocation } from "./context/LocationContext";
import { useLocations } from "./hooks/useLocations";

import { MobileContainer } from "./components/layout/MobileContainer";
import { Header } from "./components/layout/Header";
import { LocationSelector } from "./components/location/LocationSelector";
import { CategoryTabs } from "./components/category/CategoryTabs";
import { SearchBar } from "./components/search/SearchBar";
import { MenuList } from "./components/menu/MenuList";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

/** Inner app — has access to location and theme providers */
function AppContent() {
  const { selectedLocationId } = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId);
    setSearchQuery(""); // Clear search when switching categories
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <MobileContainer>
      <AnimatePresence mode="wait">
        {!selectedLocationId ? (
          <motion.div
            key="location-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LocationSelector />
          </motion.div>
        ) : (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col min-h-screen"
          >
            <Header />
            <CategoryTabs
              locationId={selectedLocationId}
              selectedCategoryId={selectedCategoryId}
              onCategorySelect={handleCategorySelect}
            />
            <SearchBar onSearch={handleSearch} />
            <main className="flex-1" id="main-content">
              <MenuList
                locationId={selectedLocationId}
                selectedCategoryId={selectedCategoryId}
                searchQuery={searchQuery}
              />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
}

/** Wrapper that passes available locations to LocationProvider */
function AppWithLocationProvider() {
  const { data: locations } = useLocations();

  return (
    <LocationProvider availableLocations={locations ?? []}>
      <AppContent />
    </LocationProvider>
  );
}

/** Top-level app with all providers */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppWithLocationProvider />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
