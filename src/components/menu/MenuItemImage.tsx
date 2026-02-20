/**
 * Menu item image with lazy loading and placeholder fallback.
 */

import { useState } from "react";
import { Utensils } from "lucide-react";

interface MenuItemImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function MenuItemImage({ src, alt, className }: MenuItemImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ${className ?? ""}`}
        role="img"
        aria-label={`${alt} - no image available`}
      >
        <Utensils className="h-10 w-10 text-gray-300 dark:text-gray-600" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`object-cover w-full h-full ${className ?? ""}`}
      onError={() => setHasError(true)}
    />
  );
}
