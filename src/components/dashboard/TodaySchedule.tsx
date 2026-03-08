import { TodaySchedule } from "@/types";
import { Calendar, Clock, MapPin, MapPinOff, AlertCircle } from "lucide-react";

export const TodayScheduleCard = ({ schedule }: { schedule?: TodaySchedule }) => {
  if (!schedule) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute -right-4 -top-4 text-slate-50 dark:text-slate-800/50">
        <Calendar size={120} strokeWidth={1} />
      </div>

      <h4 className="relative mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        Today's Work Schedule
      </h4>

      <div className="relative space-y-5">
        {/* Label & Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {schedule.label}
            </h3>
            <p className="text-xs text-slate-500">
              {schedule.is_workday ? "Work Day" : "Day Off / No Schedule"}
            </p>
          </div>
          
          <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
            schedule.must_at_office 
              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" 
              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          }`}>
            {schedule.must_at_office ? <MapPin size={12} /> : <MapPinOff size={12} />}
            {schedule.must_at_office ? "WFO (Office)" : "WFA (Remote)"}
          </div>
        </div>

        {/* Time Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            <p className="mb-1 text-[10px] font-medium text-slate-400 uppercase">Clock In</p>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span className="font-bold text-slate-700 dark:text-slate-200">{schedule.work_start}</span>
            </div>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
            <p className="mb-1 text-[10px] font-medium text-slate-400 uppercase">Clock Out</p>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-slate-400" />
              <span className="font-bold text-slate-700 dark:text-slate-200">{schedule.work_end}</span>
            </div>
          </div>
        </div>

        {/* Tolerance Footer */}
        <div className="flex items-center gap-2 rounded-lg border border-amber-100 bg-amber-50/50 p-3 dark:border-amber-900/30 dark:bg-amber-900/10">
          <AlertCircle size={16} className="text-amber-500" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Late tolerance: <span className="font-bold">{schedule.tolerance} Minutes</span>
          </p>
        </div>
      </div>
    </div>
  );
};