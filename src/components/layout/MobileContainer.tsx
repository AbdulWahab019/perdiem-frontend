/**
 * App container component.
 * Full-width on mobile, capped at ~80% on desktop.
 */

import { type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div
        className={cn(
          "mx-auto w-full min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300",
          "lg:max-w-6xl lg:shadow-[0_0_0_1px_rgba(0,0,0,0.06)] dark:lg:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
