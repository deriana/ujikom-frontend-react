import { useNavigate } from "react-router-dom";
import {
  Palmtree,
  FileClock,
  FileSpreadsheet,
  Clock,
  ChevronRight,
  Check,
} from "lucide-react";
import { useCan } from "@/hooks/useCan"; // Gunakan hook useCan
import { RESOURCES } from "@/constants/Resource";
import { PERMISSIONS } from "@/constants/Permissions";
import { buildPermission } from "@/constants/Permissions";

const approvalItems = [
  {
    name: "Leave Approval",
    path: "/approval/leave",
    icon: <Palmtree size={20} />,
    color: "bg-blue-500",
    description: "Review employee leave requests",
    permission: buildPermission(RESOURCES.LEAVE, PERMISSIONS.BASE.APPROVE),
  },
  {
    name: "Early Leave Approval",
    path: "/approval/early-leave",
    icon: <FileClock size={20} />,
    color: "bg-amber-500",
    description: "Manage early departure requests",
    permission: buildPermission(RESOURCES.EARLY_LEAVE, PERMISSIONS.BASE.APPROVE),
  },
  {
    name: "Attendance Request",
    path: "/approval/attendance-request",
    icon: <FileSpreadsheet size={20} />,
    color: "bg-emerald-500",
    description: "Approve manual attendance logs",
    permission: buildPermission(RESOURCES.ATTENDANCE_REQUEST, PERMISSIONS.BASE.APPROVE),
  },
  {
    name: "Overtime Approval",
    path: "/approval/overtime",
    icon: <Clock size={20} />,
    color: "bg-purple-500",
    description: "Review extra hours submissions",
    permission: buildPermission(RESOURCES.OVERTIME, PERMISSIONS.BASE.APPROVE),
  },
];

export default function ApprovalMenu() {
  const navigate = useNavigate();
  
  // Kita buat fungsi pengecekan di dalam komponen
  // Atau jika useCan hanya menerima 1 string, kita filter manual
  const filteredItems = approvalItems.filter(item => {
    // Gunakan logic yang sama dengan useCan atau panggil helper can langsung
    return useCan(item.permission); 
  });

  return (
    <div className="p-6 space-y-6 min-h-screen bg-gray-50 dark:bg-transparent">
      <div className="flex flex-col">
        <h2 className="text-xl font-black dark:text-white">Quick Approvals</h2>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">
          Pending actions required
        </p>
      </div>

      <div className="grid gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-4xl border border-gray-100 dark:border-neutral-800 shadow-sm active:scale-95 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${item.color} text-white flex items-center justify-center shadow-lg`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black dark:text-white">{item.name}</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.description}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
             <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400">
                <Check size={32} />
             </div>
             <p className="text-sm font-bold text-gray-500">No approvals available for you.</p>
          </div>
        )}
      </div>
    </div>
  );
}