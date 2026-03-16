import { PartyPopper } from "lucide-react";
import { UpcomingHoliday as UpcomingHolidayType } from "@/types/dashboard.types";

interface UpcomingHolidayProps {
  upcomingHoliday?: UpcomingHolidayType;
}

export default function UpcomingHoliday({ upcomingHoliday }: UpcomingHolidayProps) {
  if (!upcomingHoliday) return null;

  const getDaysUntil = (dateString: string) => {
    const target = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-5 rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
          <PartyPopper className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                Upcoming Break • {getDaysUntil(upcomingHoliday.date)} days left
              </p>
              <p className="text-sm font-black">{upcomingHoliday.name}</p>
            </div>
            <span className="text-[10px] font-black bg-black/20 px-2 py-1 rounded-lg">
              {new Intl.DateTimeFormat("en-US", {
                day: "numeric",
                month: "short",
              }).format(new Date(upcomingHoliday.date))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}