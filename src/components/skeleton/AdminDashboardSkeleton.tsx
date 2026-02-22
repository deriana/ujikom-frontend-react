import Skeleton from "./ComponentSkeloton";

export default function AdminDashboardSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 animate-pulse">
      
      <div className="col-span-12 xl:col-span-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-12 xl:col-span-4">
        <div className="p-5 h-full border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
          <Skeleton className="h-5 w-40 mb-6" />
          <div className="flex justify-around items-end h-32 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-full" style={{ height: `${Math.random() * 100}%` }} />
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-12">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
          <div className="flex justify-between mb-8">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>

      <div className="col-span-12 xl:col-span-6">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
          <Skeleton className="h-5 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton variant="circle" className="size-10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-12 xl:col-span-6">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
          <Skeleton className="h-5 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circle" className="size-8" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: RecentHRActivity (Full Width) */}
      <div className="col-span-12">
        <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex flex-col items-center">
                  <Skeleton variant="circle" className="size-3" />
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-800 mt-1"></div>
                </div>
                <div className="flex-1 pb-4">
                  <Skeleton className="h-4 w-full max-w-md mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}