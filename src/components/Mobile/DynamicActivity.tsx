import { ChevronRight, ClipboardList, Clock } from "lucide-react";
import { MobileHomeData } from "@/types";

interface DynamicActivityProps {
  attendanceData: MobileHomeData;
}

export default function DynamicActivity({ attendanceData }: DynamicActivityProps) {
    return (
         <section className="pb-4">
          <div className="flex justify-between items-center mb-5 px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
              <h2 className="text-sm font-black text-gray-800 dark:text-white tracking-tight uppercase">
                Activities
              </h2>
            </div>
            <button className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 active:scale-95 transition-all">
              VIEW ALL <ChevronRight size={12} strokeWidth={3} />
            </button>
          </div>

          <div className="space-y-3">
            {attendanceData?.activities?.length ? (
              attendanceData.activities.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-100 dark:border-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl flex items-center justify-center ${
                        item.type.includes("check-in")
                          ? "bg-green-50 text-green-600"
                          : item.type.includes("leave")
                            ? "bg-amber-50 text-amber-600"
                            : "bg-gray-50 text-gray-400"
                      } dark:bg-white/5`}
                    >
                      {item.type.includes("check") ? (
                        <ClipboardList size={18} />
                      ) : (
                        <Clock size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        Today
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-700 dark:text-gray-200 tracking-tighter">
                      {item.time}
                    </p>
                    <p className="text-[8px] font-black text-blue-500 uppercase mt-0.5">
                      {item.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 opacity-50 text-sm ">
                No activities recorded today
              </div>
            )}
          </div>
        </section>
    )
}