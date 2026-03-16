import Skeleton from "./ComponentSkeloton";

interface ShowUsersSkeletonProps {
  isMobile?: boolean;
}

export default function ShowUsersSkeleton({ isMobile }: ShowUsersSkeletonProps) {
  if (isMobile) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center gap-4 p-4">
          <Skeleton variant="circle" className="size-24" />
          <div className="space-y-2 text-center">
            <Skeleton className="h-6 w-40 mx-auto" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </div>

        {/* Menu List Skeleton */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800 border border-gray-100 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-10 rounded-lg" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="size-5 rounded-full" />
            </div>
          ))}
        </div>

        {/* Logout Button Skeleton */}
        <div className="mt-8 p-6 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl flex flex-col items-center gap-3">
          <Skeleton variant="circle" className="size-14" />
          <div className="space-y-2 w-full flex flex-col items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* UserMetaCard Skeleton */}
      <div className="p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-6">
          <Skeleton variant="circle" className="size-20 lg:size-24" />
          <div className="space-y-3 flex-1 text-center lg:text-left">
            <Skeleton className="h-6 w-48 mx-auto lg:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto lg:mx-0" />
          </div>
        </div>
      </div>

      {/* UserInfoCard Skeleton */}
      <div className="p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full" /> {/* Value */}
            </div>
          ))}
        </div>
      </div>

      {/* UserAddressCard Skeleton */}
      <div className="p-5 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/3">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}