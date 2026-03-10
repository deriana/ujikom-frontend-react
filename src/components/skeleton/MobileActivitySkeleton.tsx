export default function MobileActivitySkeleton() {
  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent pb-24 animate-pulse">
      {/* Header Navigasi Skeleton */}
      <header className="p-6 bg-white dark:bg-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />
          <div className="flex flex-col items-center gap-2">
            <div className="w-32 h-5 bg-gray-200 dark:bg-gray-800 rounded-md" />
            <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded-md" />
          </div>
          <div className="w-10" />
        </div>

      </header>

      <main className="p-6">
        {/* Grid Kalender Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 border dark:border-neutral-800">
          {/* Month Selector Skeleton */}
          <div className="h-12 bg-gray-50 dark:bg-gray-900/50 rounded-2xl w-full mb-6" />
          {/* Nama Hari */}
          <div className="grid grid-cols-7 mb-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-6 h-3 bg-gray-100 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>

          {/* Angka Tanggal (5 baris x 7 kolom) */}
          <div className="grid grid-cols-7 gap-y-4">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="flex justify-center">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 px-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="w-12 h-2 bg-gray-100 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>

        {/* Activity List Skeleton */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-2">
            <div className="w-28 h-4 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="w-12 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
          
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-3xl border dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-700" />
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="w-24 h-3 bg-gray-100 dark:bg-gray-700 rounded" />
                </div>
              </div>
              <div className="w-16 h-6 bg-gray-50 dark:bg-gray-700 rounded-lg" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}