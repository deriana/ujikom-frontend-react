import { User } from "lucide-react";

export default function MobileHomeSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Header Skeleton */}
      <div className="px-5 mt-6">
        <div className="bg-white dark:bg-gray-900 px-6 pt-10 pb-6 rounded-b-4xl border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div className="space-y-3">
            {/* Greeting Shimmer */}
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            {/* Name Shimmer */}
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            {/* Date Shimmer */}
            <div className="h-3 w-40 bg-gray-100 dark:bg-gray-800/50 rounded-full animate-pulse" />
          </div>
          {/* Avatar Shimmer */}
          <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
            <User className="text-gray-300 dark:text-gray-700 w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-8">
        {/* Attendance Card Skeleton */}
        <div className="bg-gray-200 dark:bg-gray-800 rounded-4xl p-6 h-48 animate-pulse relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
                <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded-xl" />
                <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-300 dark:bg-gray-700 rounded-full ml-auto" />
                    <div className="h-2 w-24 bg-gray-300 dark:bg-gray-700 rounded-full ml-auto" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                    <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="space-y-2 border-l border-gray-300/30 pl-6">
                    <div className="h-3 w-12 bg-gray-300 dark:bg-gray-700 rounded-full" />
                    <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                </div>
            </div>
        </div>

        {/* Quick Action Grid Skeleton */}
        <section>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-full mb-4 ml-1 animate-pulse" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="bg-gray-200 dark:bg-gray-800 w-full aspect-square rounded-[20px] animate-pulse" />
                <div className="h-2 w-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </section>

        {/* Activities Skeleton */}
        <section>
          <div className="flex justify-between items-center mb-5 px-1">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="h-6 w-16 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
                    <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                    <div className="h-3 w-8 bg-gray-200 dark:bg-gray-800 rounded-full ml-auto animate-pulse" />
                    <div className="h-2 w-12 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}