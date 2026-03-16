import { CalendarCheck, Palmtree } from "lucide-react";
import { MobileDailyTrackerData } from "@/types";

interface ActivityLeaveCardProps {
  tracker: MobileDailyTrackerData["tracker"];
}
interface ActivityApprovedLeavesProps {
  my_approved_leaves: MobileDailyTrackerData["my_approved_leaves"];
}

export function ActivityLeaveCard({ tracker }: ActivityLeaveCardProps) {
  if (!tracker?.leave?.is_on_leave) return null;

  return (
    <div className="p-5 bg-emerald-500 rounded-4xl text-white shadow-lg shadow-emerald-200 dark:shadow-none flex items-center gap-4">
      <div className="bg-white/20 p-3 rounded-2xl">
        <Palmtree size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase opacity-80 tracking-widest">
          Active Leave Record
        </p>
        <p className="text-lg font-black leading-tight">
          {tracker.leave.type}
        </p>
        <p className="text-[10px] font-medium opacity-90 mt-1 italic">
          "{tracker.leave.reason}"
        </p>
      </div>
    </div>
  );
}

export function ActivityApprovedLeaves({
  my_approved_leaves,
}: ActivityApprovedLeavesProps) {
  if (!my_approved_leaves || my_approved_leaves.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-sm font-black dark:text-white uppercase tracking-tight">
          My Approved Leaves
        </h3>
      </div>
      <div className="space-y-3">
        {my_approved_leaves.map((l, i) => (
          <div
            key={i}
            className={`p-4 rounded-3xl border flex items-center justify-between ${
              l.is_upcoming
                ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/20"
                : "bg-gray-50 border-gray-100 dark:bg-gray-900/10 dark:border-gray-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <CalendarCheck
                className={l.is_upcoming ? "text-emerald-500" : "text-gray-400"}
                size={20}
              />
              <div>
                <p className="text-sm font-black dark:text-white">{l.type}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {l.start} - {l.end}
                </p>
              </div>
            </div>
            {l.is_upcoming && (
              <span className="text-[8px] font-black bg-emerald-500 text-white px-2 py-1 rounded-lg uppercase tracking-tighter">
                Upcoming
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
