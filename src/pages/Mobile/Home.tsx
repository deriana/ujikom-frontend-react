import { useMobileHomeData } from "@/hooks/useDashboard";
import MobileHomeSkeleton from "@/components/skeleton/MobileHomeSkeleton";
import HomeHeader from "@/components/Mobile/HomeHeader";
import AttendanceCard from "@/components/Mobile/AttendanceCard";
import QuickActionGrid from "@/components/Mobile/QuickActionGrid";
import { MobileHomeData } from "@/types";
import DynamicActivity from "@/components/Mobile/DynamicActivity";
import { useNotificationPermission } from "@/hooks/useNotificationPermission";

export default function MobileHome() {
  const { data: attendanceData, isLoading } = useMobileHomeData();

  useNotificationPermission();

  if (isLoading) {
    return <MobileHomeSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-500">
      <HomeHeader />
      <div className="px-5 mt-6 space-y-8">
        <AttendanceCard attendanceData={attendanceData as MobileHomeData} />
        <QuickActionGrid />
        <DynamicActivity attendanceData={attendanceData as MobileHomeData} />
      </div>
    </div>
  );
}
