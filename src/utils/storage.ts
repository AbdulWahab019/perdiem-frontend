/**
 * Type-safe localStorage helpers.
 */

/**
 * Gets a value from localStorage, parsing it as JSON.
 * Returns null if the key doesn't exist or parsing fails.
 */
export function getStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

/**
 * Stores a value in localStorage as JSON.
 * Silently fails if localStorage is unavailable.
 */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage might be full or unavailable
  }
}

/**
 * Removes a key from localStorage.
 */
export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore errors
  }
}

/** Storage keys used throughout the app */
export const STORAGE_KEYS = {
  SELECTED_LOCATION: "perdiem:selectedLocation",
  THEME: "perdiem:theme",
} as const;
