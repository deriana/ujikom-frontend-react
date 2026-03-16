// Komponen Skeleton sederhana
const ChartSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* KPI Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
      ))}
    </div>
    {/* Main Chart Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 h-87.5 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
      <div className="h-87.5 bg-gray-200 dark:bg-white/10 rounded-2xl"></div>
    </div>
  </div>
);

export default ChartSkeleton;