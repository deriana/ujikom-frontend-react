import MobileActivitySkeleton from "@/components/skeleton/MobileActivitySkeleton";
import { useMobileDailyTrackerData } from "@/hooks/useDashboard";
import { MobileDailyTrackerData } from "@/types";
import ActivityHeader from "@/components/Mobile/ActivityHeader";
import ActivityCalendar from "@/components/Mobile/ActivityCalendar";
import { ActivityApprovedLeaves, ActivityLeaveCard } from "@/components/Mobile/ActivityLeaveCard";
import ActivityWorkHour from "@/components/Mobile/ActivityWorkHour";
import ActivityTimeline from "@/components/Mobile/ActivityTimeline";
import { ActivityHolidayCard, ActivityUpcomingHolidays } from "@/components/Mobile/ActivityHolidayCard";
import ActivityPayday from "@/components/Mobile/ActivityPaydayCard";
import { formatDateToParam } from "@/utils/calenderHelper";
import { useCalendar } from "@/hooks/useCalendar";

export default function Activity() {
  const {
    viewDate,
    selectedDate,
    today,
    daysArray,
    dateParam,
    changeMonth,
    selectDate,
  } = useCalendar();

  const { data, isLoading } = useMobileDailyTrackerData(dateParam);
  const trackerData = data as MobileDailyTrackerData;

  const getDayStatus = (day: number) => {
    if (day <= 0 || !trackerData) return null;
    
    const dateObj = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateStr = formatDateToParam(dateObj);

    if (day === 26) return { bg: "bg-yellow-500", text: "text-yellow-500" };

    const isPublicHoliday = trackerData.yearly_holidays?.some(h => dateStr === h.full_date);
    const dayOfWeek = dateObj.getDay();
    
    if (isPublicHoliday || dayOfWeek === 0 || dayOfWeek === 6) {
      return { bg: "bg-blue-400", text: "text-blue-400" };
    }

      const hasLeave = trackerData?.my_approved_leaves?.some((l) => {
      const start = new Date(l.start).toISOString().split("T")[0];
      const end = new Date(l.end).toISOString().split("T")[0];
      return dateStr >= start && dateStr <= end;
    });
    if (hasLeave) return { bg: "bg-emerald-500", text: "text-emerald-500" };

    return null
  };

  if (isLoading) return <MobileActivitySkeleton />;

  const { tracker, timeline, upcoming_holidays, my_approved_leaves } = trackerData || {};

  return (
    <div className="min-h-screen bg-transparent dark:bg-transparent pb-24">
      {/* Header */}
      <ActivityHeader />

      <main className="p-6 space-y-6">
        {/* Calendar Card */}
        <ActivityCalendar
          viewDate={viewDate}
          selectedDate={selectedDate}
          today={today}
          daysArray={daysArray}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
          onSelectDate={selectDate}
          getDayStatus={getDayStatus}
        />

        {/* ACTIVE LEAVE POINTER CARD */}
        <ActivityLeaveCard tracker={tracker} />

        {/* Holiday Info Alert (Appears when clicking a holiday date) */}
       <ActivityHolidayCard tracker={tracker} />

        {/* Status Highlights */}
        <ActivityWorkHour tracker={tracker} />

        {/* Timeline Activities */}
        <ActivityTimeline
          tracker={tracker}
          timeline={timeline}
        />

        {/* Upcoming Holidays Section */}
        <ActivityUpcomingHolidays upcoming_holidays={upcoming_holidays} />

        {/* Approved Leaves List Section */}
        <ActivityApprovedLeaves my_approved_leaves={my_approved_leaves} />

        {/* Payday Info */}
        <ActivityPayday payday_info={tracker.payday_info} />
      </main>
    </div>
  );
}
