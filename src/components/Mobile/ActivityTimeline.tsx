import { Check, LogOut, Timer, CalendarDays } from "lucide-react";
import { MobileDailyTrackerData } from "@/types";

interface ActivityTimelineProps {
  tracker: MobileDailyTrackerData["tracker"];
  timeline: MobileDailyTrackerData["timeline"];
}

export default function ActivityTimeline({ tracker, timeline }: ActivityTimelineProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black dark:text-white uppercase tracking-tight">
          Timeline Activity
        </h3>
        {tracker?.clock_in?.late_minutes > 0 && (
          <span className="text-[9px] font-black text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md uppercase tracking-tighter">
            Late: {tracker.clock_in.late_minutes}m
          </span>
        )}
      </div>

      {timeline?.length > 0 ? (
        timeline.map((item, i) => (
          <div
            key={i}
            className="p-4 bg-white dark:bg-gray-800 rounded-3xl border dark:border-neutral-800 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm
                ${
                  item.event.toLowerCase().includes("in")
                    ? "bg-emerald-500 shadow-emerald-100 dark:shadow-none"
                    : item.event.toLowerCase().includes("out")
                      ? "bg-blue-500 shadow-blue-100 dark:shadow-none"
                      : item.event.toLowerCase().includes("overtime")
                        ? "bg-orange-500 shadow-orange-100 dark:shadow-none"
                        : "bg-purple-500 shadow-purple-100 dark:shadow-none"
                }`}
              >
                {item.event.toLowerCase().includes("in") ? (
                  <Check size={18} />
                ) : item.event.toLowerCase().includes("out") ? (
                  <LogOut size={18} />
                ) : (
                  <Timer size={18} />
                )}
              </div>
              <div>
                <p className="text-sm font-black dark:text-white leading-tight">
                  {item.event}
                </p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                  {item.time || "All Day"} • {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-3xl border border-dashed dark:border-neutral-700">
          <CalendarDays
            className="mx-auto text-gray-300 mb-2 opacity-30"
            size={32}
          />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            No activity recorded
          </p>
        </div>
      )}
    </div>
  );
}