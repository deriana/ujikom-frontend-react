import { Calendar, ClipboardList, Clock, FileClock, LayoutGrid, Palmtree, Timer, Wallet, Scale, ClipboardCheck, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function QuickActionGrid() {
      const navigate = useNavigate();
      const [isExpanded, setIsExpanded] = useState(false);
      const quickActions = [
        {
          name: "Leave",
          icon: <Palmtree size={22} className="text-blue-600" />,
          bg: "bg-blue-50",
          path: "/leaves",
        },
        {
          name: "Early Leave",
          icon: <FileClock size={22} className="text-red-600" />,
          bg: "bg-red-50",
          path: "/early-leaves",
        },
        {
          name: "Requests",
          icon: <ClipboardList size={22} className="text-cyan-600" />,
          bg: "bg-cyan-50",
          path: "/attendance-requests",
        },
        {
          name: "Assess",
          icon: <ClipboardCheck size={22} className="text-emerald-600" />,
          bg: "bg-emerald-50",
          path: "/assessments",
        },
        {
          name: "Overtime",
          icon: <Timer size={22} className="text-orange-600" />,
          bg: "bg-orange-50",
          path: "/overtimes",
        },
        {
          name: "Payroll",
          icon: <Wallet size={22} className="text-green-600" />,
          bg: "bg-green-50",
          path: "/payroll",
        },
        {
          name: "Event",
          icon: <Calendar size={22} className="text-rose-600" />,
          bg: "bg-rose-50",
          path: "/calendar",
        },
        {
          name: "Balances",
          icon: <Scale size={22} className="text-purple-600" />,
          bg: "bg-purple-50",
          path: "/leave-balances",
        },
        {
          name: "History",
          icon: <Clock size={22} className="text-indigo-600" />,
          bg: "bg-indigo-50",
          path: "/attendances/report",
        },
      ];

    const displayedActions = isExpanded ? quickActions : quickActions.slice(0, 7);

    return (
         <section>
          <div className="flex justify-between items-center mb-5 px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
              <h2 className="text-sm font-black text-gray-800 dark:text-white tracking-tight uppercase">
                Self Service
              </h2>
            </div>
            {quickActions.length > 7 && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 active:scale-95 transition-all"
              >
                {isExpanded ? "SHOW LESS" : "VIEW ALL"} <ChevronRight size={12} strokeWidth={3} className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {displayedActions.map((action, idx) => (
              <div
                key={idx}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className={`${action.bg} dark:bg-white/5 w-full aspect-square rounded-[20px] flex items-center justify-center shadow-sm border border-white dark:border-gray-800 active:scale-90 transition-all duration-200`}
                >
                  {action.icon}
                </div>
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  {action.name}
                </span>
              </div>
            ))}
            {!isExpanded && quickActions.length > 7 && (
              <div
                onClick={() => setIsExpanded(true)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className="bg-gray-100 dark:bg-white/5 w-full aspect-square rounded-[20px] flex items-center justify-center shadow-sm border border-white dark:border-gray-800 active:scale-90 transition-all duration-200"
                >
                  <LayoutGrid size={22} className="text-gray-400" />
                </div>
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                  More
                </span>
              </div>
            )}
          </div>
        </section>
    )
}