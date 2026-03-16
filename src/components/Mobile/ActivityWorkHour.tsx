import { MobileDailyTrackerData } from "@/types";

interface ActivityWorkHourProps {
  tracker: MobileDailyTrackerData["tracker"];
}

export default function ActivityWorkHour({ tracker }: ActivityWorkHourProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
        <p className="text-[9px] font-bold text-emerald-600 uppercase">
          Work Hours
        </p>
        <p className="text-base font-black dark:text-white">
          {tracker?.work_duration?.formatted_work || "0h 0m"}
        </p>
      </div>
      <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-3xl border border-orange-100 dark:border-orange-900/20">
        <p className="text-[9px] font-bold text-orange-600 uppercase">
          Overtime
        </p>
        <p className="text-base font-black dark:text-white">
          {tracker?.work_duration?.formatted_overtime || "0h 0m"}
        </p>
      </div>
    </div>
  );
}