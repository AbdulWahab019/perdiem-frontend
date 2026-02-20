/**
 * Error state component with retry button.
 */

import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      aria-live="assertive"
      className={`flex flex-col items-center justify-center gap-4 p-8 text-center ${className ?? ""}`}
    >
      <AlertTriangle
        className="h-10 w-10 text-red-400 dark:text-red-500"
        aria-hidden="true"
      />
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand hover:bg-brand-dark active:bg-brand-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          aria-label="Retry loading"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Try Again
        </button>
      )}
    </motion.div>
  );
}
