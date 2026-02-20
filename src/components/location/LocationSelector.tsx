/**
 * Location selector component.
 * Shows a full-screen location picker when no location is selected.
 */

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CheckCircle } from "lucide-react";
import perdiemLogo from "../../assets/perdiem.svg";
import type { LocationDTO } from "../../types/location.types";
import { useLocations } from "../../hooks/useLocations";
import { useLocation } from "../../context/LocationContext";
import { LocationSkeleton } from "../feedback/LoadingSkeleton";
import { ErrorState } from "../feedback/ErrorState";

function formatAddress(location: LocationDTO): string {
  const parts = [
    location.address?.line1,
    location.address?.city,
    location.address?.state,
  ].filter(Boolean);
  return parts.join(", ");
}

export function LocationSelector() {
  const { data: locations, isLoading, isError, error, refetch } = useLocations();
  const { selectedLocationId, setSelectedLocation } = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 pt-14 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <img src={perdiemLogo} alt="Per Diem" className="h-9 mx-auto dark:invert" />
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Choose a location to view the menu
          </p>
        </motion.div>
      </div>

      {/* Location list */}
      <div
        className="flex-1 px-4 pb-10 max-w-lg mx-auto w-full space-y-3"
        role="listbox"
        aria-label="Select a restaurant location"
      >
        {isLoading && (
          <>
            <LocationSkeleton />
            <LocationSkeleton />
            <LocationSkeleton />
          </>
        )}

        {isError && (
          <ErrorState
            message={
              (error as Error)?.message ??
              "Failed to load locations. Please check your connection."
            }
            onRetry={() => refetch()}
          />
        )}

        <AnimatePresence>
          {locations?.map((location, index) => (
            <LocationCard
              key={location.id}
              location={location}
              isSelected={location.id === selectedLocationId}
              index={index}
              onSelect={() => setSelectedLocation(location)}
            />
          ))}
        </AnimatePresence>

        {!isLoading && !isError && locations?.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <MapPin className="h-10 w-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p>No locations available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface LocationCardProps {
  location: LocationDTO;
  isSelected: boolean;
  index: number;
  onSelect: () => void;
}

function LocationCard({ location, isSelected, index, onSelect }: LocationCardProps) {
  const address = formatAddress(location);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      role="option"
      aria-selected={isSelected}
    >
      <button
        onClick={onSelect}
        className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
          isSelected
            ? "border-brand bg-brand-light dark:bg-brand/10"
            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-brand/50 dark:hover:border-brand/40 hover:bg-gray-50 dark:hover:bg-gray-750"
        }`}
        aria-pressed={isSelected}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <MapPin
                className={`h-4 w-4 shrink-0 ${isSelected ? "text-brand" : "text-gray-400 dark:text-gray-500"}`}
                aria-hidden="true"
              />
              <p className="font-semibold text-gray-900 dark:text-white truncate">
                {location.name}
              </p>
            </div>
            {address && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 pl-6">{address}</p>
            )}
            {location.timezone && (
              <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500 pl-6">
                {location.timezone}
              </p>
            )}
          </div>
          {isSelected && (
            <CheckCircle className="h-5 w-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
          )}
        </div>
      </button>
    </motion.div>
  );
}
