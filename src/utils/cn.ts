/**
 * Utility for merging Tailwind CSS class names.
 * Combines clsx (conditional classes) with tailwind-merge (deduplication).
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, deduplicating conflicting Tailwind classes.
 *
 * @example
 * cn("px-2 py-1", "px-4") // → "py-1 px-4"
 * cn("text-red-500", { "text-blue-500": isBlue }) // → conditional class
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
