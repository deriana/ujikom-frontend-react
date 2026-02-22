import Skeleton from "./ComponentSkeloton";

export default function EmployeeDashboardSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" /> {/* Title */}
          <Skeleton className="h-4 w-80" /> {/* Subtitle */}
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" /> {/* Month Badge */}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content (Left) - Col 8 */}
        <div className="col-span-12 space-y-6 xl:col-span-8">
          
          {/* Stats Grid - 4 Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-white/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" /> {/* Label */}
                    <Skeleton className="h-8 w-24" /> {/* Value */}
                  </div>
                  <Skeleton variant="circle" className="size-12" /> {/* Icon */}
                </div>
                <Skeleton className="h-3 w-32" /> {/* Subtitle */}
              </div>
            ))}
          </div>

          {/* Chart Skeleton */}
          <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-white/5">
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="flex items-end justify-between h-64 gap-2 px-2">
              {[...Array(12)].map((_, i) => (
                <Skeleton 
                  key={i} 
                  className="w-full rounded-t-md" 
                  style={{ height: `${Math.floor(Math.random() * 60) + 20}%` }} 
                />
              ))}
            </div>
          </div>

          {/* Logs Skeletons */}
          <div className="space-y-6">
             {/* Activity Log Skeleton */}
            <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-white/5">
              <Skeleton className="h-6 w-40 mb-6" />
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton variant="circle" className="size-10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (Right) - Col 4 */}
        <div className="col-span-12 space-y-6 xl:col-span-4">
          
          {/* User Info Skeleton */}
          <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-white/5">
            <div className="flex flex-col items-center text-center space-y-3">
              <Skeleton variant="circle" className="size-20" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          {/* Salary History Skeleton */}
          <div className="p-6 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-white/5">
            <Skeleton className="h-5 w-32 mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Card Skeleton */}
          <div className="rounded-2xl bg-slate-200 dark:bg-slate-800 p-6">
            <Skeleton className="h-5 w-40 mb-2 bg-slate-300 dark:bg-slate-700" />
            <Skeleton className="h-4 w-full mb-4 bg-slate-300 dark:bg-slate-700" />
            <Skeleton className="h-2 w-full rounded-full mb-4 bg-slate-300 dark:bg-slate-700" />
            <Skeleton className="h-3 w-24 bg-slate-300 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}