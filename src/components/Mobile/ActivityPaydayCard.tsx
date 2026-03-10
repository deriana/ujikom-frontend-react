import { Timer } from "lucide-react";
import { MobileDailyTrackerData } from "@/types";

interface ActivityPaydayProps {
  payday_info: MobileDailyTrackerData["tracker"]["payday_info"];
}

export default function ActivityPayday({ payday_info }: ActivityPaydayProps) {
  if (!payday_info) return null;

  return (
    <div className="p-5 bg-yellow-400 rounded-3xl flex items-center gap-4 shadow-lg shadow-yellow-200 dark:shadow-none">
      <div className="p-3 bg-white/30 rounded-2xl text-yellow-900">
        <Timer size={24} />
      </div>
      <div>
        <p className="text-[10px] font-black text-yellow-900 uppercase tracking-widest leading-none">
          Next Payday
        </p>
        <p className="text-lg font-black text-yellow-950 mt-1 tracking-tighter">
          {payday_info.next_payday}
        </p>
        <p className="text-[9px] font-bold text-yellow-900/80 uppercase mt-1 tracking-tighter">
          {payday_info.days_remaining} days remaining
        </p>
      </div>
    </div>
  );
}
