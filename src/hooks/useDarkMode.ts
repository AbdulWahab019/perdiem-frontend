/**
 * Convenience hook for dark mode toggle.
 * Wraps the ThemeContext.
 */

import { useTheme } from "../context/ThemeContext";

export function useDarkMode() {
  const { theme, effectiveTheme, setTheme, toggleTheme } = useTheme();
  return {
    theme,
    isDark: effectiveTheme === "dark",
    effectiveTheme,
    setTheme,
    toggleTheme,
  };
}
