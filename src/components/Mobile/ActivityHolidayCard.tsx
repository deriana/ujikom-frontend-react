import { Info } from "lucide-react";
import { MobileDailyTrackerData } from "@/types";

interface ActivityHolidayCardProps {
  tracker: MobileDailyTrackerData["tracker"];
}
interface ActivityUpcomingHolidays {
  upcoming_holidays: MobileDailyTrackerData["upcoming_holidays"];
}

export function ActivityHolidayCard({ tracker }: ActivityHolidayCardProps) {
  if (!tracker?.holiday_info?.is_holiday) return null;
  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-3xl border border-red-100 dark:border-red-900/30 flex items-center gap-4">
      <div className="bg-red-500 p-2 rounded-xl text-white">
        <Info size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-widest leading-none mb-1">
          Public Holiday
        </p>
        <p className="text-sm font-black dark:text-white leading-tight">
          {tracker.holiday_info.holiday_name}
        </p>
      </div>
    </div>
  );
}

export function ActivityUpcomingHolidays({ upcoming_holidays }: ActivityUpcomingHolidays) {
  if (!upcoming_holidays || upcoming_holidays.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black dark:text-white uppercase tracking-tight">
          Upcoming Holidays
        </h3>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2 px-1 no-scrollbar">
        {upcoming_holidays.map((h, i) => (
          <div
            key={i}
            className="min-w-40 p-4 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/20"
          >
            <p className="text-xs font-black leading-tight mb-1">{h.name}</p>
            <p className="text-[9px] font-bold opacity-80 uppercase mb-3">
              {h.date}
            </p>
            <span className="text-[8px] font-black bg-white/20 px-2 py-1 rounded-lg uppercase">
              In {h.days_away} Days
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}