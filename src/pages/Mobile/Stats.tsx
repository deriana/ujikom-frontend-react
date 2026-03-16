import { useMobileStatsData } from "@/hooks/useDashboard";
import { WorkHourTarget } from "@/components/dashboard/WorkHourTarget";
import TopStatGrid from "@/components/Mobile/TopStatGrid";
import LastSalary from "@/components/Mobile/LastSalary";
import WeeklyTrendChart from "@/components/Mobile/WeeklyTrendChart";
import UpcomingHoliday from "./UpcomingHoliday";
import PersonalStatsHeader from "@/components/Mobile/PersonalStatsHeader";
import ReactApexChart from "react-apexcharts";
import PerformanceChart from "@/components/Mobile/PerformanceChart";

// Komponen Skeleton (Dummy)
const Skeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-5 pb-24 space-y-6 animate-pulse">
    <div className="space-y-2 mt-2">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl" />
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-36 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]"
        />
      ))}
    </div>
    <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
    <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-[2.5rem]" />
  </div>
);

export default function MobileStats() {
  const { data: stats, isLoading } = useMobileStatsData();

  if (isLoading || !stats) return <Skeleton />;

  const performance = stats.performances?.[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 overflow-x-hidden">
      <PersonalStatsHeader />

      <main className="p-6 space-y-6">
        <TopStatGrid stats={stats.personal_stats} />
        <WorkHourTarget
          variant="neutral"
          totalKerja={stats.personal_stats.total_menit_kerja}
        />
        <LastSalary lastSalary={stats.salary_logs?.[0]} />
        <WeeklyTrendChart weeklyTrend={stats.weekly_trend} />
        <PerformanceChart performance={performance} />
        <UpcomingHoliday upcomingHoliday={stats.upcoming_holidays?.[0]} />
      </main>
    </div>
  );
}
