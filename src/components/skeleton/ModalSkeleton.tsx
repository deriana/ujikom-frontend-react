import React from "react";

interface GlobalModalSkeletonProps {
  inputsCount?: number;
  hasDateRange?: boolean;
  showFooter?: boolean;
  showHeader?: boolean;
  isCardVariant?: boolean;
}

export const GlobalModalSkeleton: React.FC<GlobalModalSkeletonProps> = ({
  inputsCount = 2,
  hasDateRange = false,
  showFooter = true,
  showHeader = true,
  isCardVariant = true,
}) => {
  return (
    <div className="space-y-6 animate-pulse">
      {showHeader && (
        <div className="space-y-3 mb-8">
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded-md" />
        </div>
      )}

      <div
        className={`${
          isCardVariant
            ? "p-6 rounded-3xl bg-gray-50/50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50"
            : ""
        } space-y-6`}
      >
        {[...Array(inputsCount)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
            <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        ))}
      </div>

      {hasDateRange && (
        <div className="space-y-4">
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <div className="flex flex-col md:flex-row gap-4">
            <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="h-11 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
        </div>
      )}

      {showFooter && (
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/50">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      )}
    </div>
  );
};