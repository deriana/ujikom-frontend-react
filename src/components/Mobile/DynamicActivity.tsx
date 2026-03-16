import { ChevronRight, ClipboardList, Clock } from "lucide-react";
import { MobileHomeData } from "@/types";
import { Link } from "react-router-dom";

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
            <Link 
              to="/activity"
              className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 active:scale-95 transition-all"
            >
              VIEW ALL <ChevronRight size={12} strokeWidth={3} />
            </Link>
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
                        item.type.includes("clock_in")
                          ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : item.type.includes("clock_out")
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                          : item.type.includes("leave")
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
                          : item.type.includes("overtime")
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
                          : item.type.includes("early_leave")
                            ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                          : item.type.includes("attendance_request")
                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                            : "bg-gray-50 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                      }`}
                    >
                      {item.type.includes("clock") ? (
                        <ClipboardList size={18} />
                      ) : item.type.includes("overtime") ? (
                        <Clock size={18} />
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
                    <p className="text-[8px] font-black text-blue-500 dark:text-blue-400 uppercase mt-0.5">
                      {item.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 opacity-50 text-sm dark:text-gray-400">
                No activities recorded today
              </div>
            )}
          </div>
        </section>
    )
}