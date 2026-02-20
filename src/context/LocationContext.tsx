/**
 * Location context.
 * Manages the currently selected location with localStorage persistence.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { LocationDTO } from "../types/location.types";
import { getStorage, setStorage, removeStorage, STORAGE_KEYS } from "../utils/storage";

interface LocationContextValue {
  /** The ID of the currently selected location */
  selectedLocationId: string | null;
  /** The full location object (if available from the locations list) */
  selectedLocation: LocationDTO | null;
  /** Select a location by ID */
  setSelectedLocation: (location: LocationDTO) => void;
  /** Clear the selected location */
  clearSelectedLocation: () => void;
}

const LocationContext = createContext<LocationContextValue | null>(null);

interface LocationProviderProps {
  children: ReactNode;
  /** Available locations to validate the stored selection against */
  availableLocations?: LocationDTO[];
}

export function LocationProvider({ children, availableLocations = [] }: LocationProviderProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(() => {
    return getStorage<string>(STORAGE_KEYS.SELECTED_LOCATION);
  });

  // Validate stored location against available locations
  // If the stored location no longer exists, clear it
  useEffect(() => {
    if (!selectedLocationId || availableLocations.length === 0) return;
    const isValid = availableLocations.some((loc) => loc.id === selectedLocationId);
    if (!isValid) {
      setSelectedLocationId(null);
      removeStorage(STORAGE_KEYS.SELECTED_LOCATION);
    }
  }, [selectedLocationId, availableLocations]);

  const selectedLocation =
    availableLocations.find((loc) => loc.id === selectedLocationId) ?? null;

  const setSelectedLocation = useCallback((location: LocationDTO) => {
    setSelectedLocationId(location.id);
    setStorage(STORAGE_KEYS.SELECTED_LOCATION, location.id);
  }, []);

  const clearSelectedLocation = useCallback(() => {
    setSelectedLocationId(null);
    removeStorage(STORAGE_KEYS.SELECTED_LOCATION);
  }, []);

  return (
    <LocationContext.Provider
      value={{
        selectedLocationId,
        selectedLocation,
        setSelectedLocation,
        clearSelectedLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}
