// components/skeleton/TableCardSkeleton.tsx
export function TableCardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-4 p-4 lg:hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div 
          key={i} 
          className="p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl animate-pulse"
        >
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-50 dark:border-white/5">
            <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-white/10 rounded-full" />
          </div>

          {/* Body Skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col gap-2">
                <div className="h-2 w-16 bg-gray-100 dark:bg-white/5 rounded" />
                <div className="h-3 w-full bg-gray-200 dark:bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}