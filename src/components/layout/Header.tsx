/**
 * App header component.
 * Shows app name/branding, selected location, and dark mode toggle.
 * Sticky at the top of the screen.
 */

import { Sun, Moon, Monitor, MapPin } from "lucide-react";
import perdiemLogo from "../../assets/perdiem.svg";
import { motion } from "framer-motion";
import { useDarkMode } from "../../hooks/useDarkMode";
import { useLocation } from "../../context/LocationContext";

export function Header() {
  const { theme, toggleTheme } = useDarkMode();
  const { selectedLocation, clearSelectedLocation } = useLocation();

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel =
    theme === "dark"
      ? "Switch to system theme"
      : theme === "light"
        ? "Switch to dark mode"
        : "Switch to light mode";

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-3 px-4 h-14">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <img src={perdiemLogo} alt="Per Diem" className="h-5 dark:invert" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Selected location chip */}
        {selectedLocation && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSelectedLocation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-w-0 max-w-50"
            aria-label={`Change location: ${selectedLocation.name}`}
            title="Tap to change location"
          >
            <MapPin className="h-3 w-3 shrink-0 text-brand" aria-hidden="true" />
            <span className="truncate font-medium">{selectedLocation.name}</span>
          </motion.button>
        )}

        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.9, rotate: 15 }}
          onClick={toggleTheme}
          className="shrink-0 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-1 dark:focus:ring-offset-gray-900"
          aria-label={themeLabel}
          title={themeLabel}
        >
          <ThemeIcon className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      </div>
    </header>
  );
}
