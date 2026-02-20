/**
 * Skeleton loading components.
 * Used to show content placeholders while data is fetching.
 */

import { cn } from "../../utils/cn";

interface SkeletonProps {
  className?: string;
}

/** Base animated skeleton block */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a menu item card */
export function MenuItemSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      {/* Image placeholder */}
      <Skeleton className="aspect-3/2 w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-5 w-1/3 mt-1" />
      </div>
    </div>
  );
}

/** Skeleton for category tabs */
export function CategoryTabsSkeleton() {
  return (
    <div
      className="flex gap-2 px-4 py-3 overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-14 z-40"
      aria-hidden="true"
    >
      {[80, 70, 90, 65, 75].map((w, i) => (
        <Skeleton key={i} className="h-8 rounded-full shrink-0" style={{ width: `${w}px` }} />
      ))}
    </div>
  );
}

/** Skeleton for location cards */
export function LocationSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-5 w-1/2" />
      </div>
      <Skeleton className="h-4 w-3/4 ml-6" />
      <Skeleton className="h-3.5 w-1/3 ml-6" />
    </div>
  );
}

/** Multiple menu item skeletons — matches the same responsive grid as MenuGroup */
export function MenuListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="px-4 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <MenuItemSkeleton key={i} />
      ))}
    </div>
  );
}
