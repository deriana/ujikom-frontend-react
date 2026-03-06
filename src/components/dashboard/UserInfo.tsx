import { EmployeeProfile, PendingRequest } from "@/types";
import { Briefcase, CreditCard, Clock, CheckCircle2, FileEdit } from "lucide-react";

export const UserInfo = ({ 
  profileData, 
  pendingData
}: { 
  profileData?: EmployeeProfile, 
  pendingData?: PendingRequest 
}) => {
  
  const avatarUrl = profileData?.profile_photo 
    ? profileData.profile_photo 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData?.name || "User")}&background=random`;

  const statsRows = [
    {
      label: "Leave Request",
      count: pendingData?.leave ?? 0,
      icon: <Clock size={16} className="text-amber-500" />,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
    },
    {
      label: "Overtime Request",
      count: pendingData?.overtime ?? 0,
      icon: <CheckCircle2 size={16} className="text-blue-500" />,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
    },
    {
      label: "Shift / Schedule Request",
      count: pendingData?.attendance_request ?? 0,
      icon: <FileEdit size={16} className="text-purple-500" />,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
          <img src={avatarUrl} alt={profileData?.name} className="h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {profileData?.name ?? "Employee"}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {profileData?.position ?? "Position Not Set"}
          </p>
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <Briefcase size={16} className="text-slate-400" /> 
          <span>{profileData?.division ?? "-"} • {profileData?.team ?? "-"}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
          <CreditCard size={16} className="text-slate-400" /> 
          <span>NIK: {profileData?.nik ?? "-"}</span>
        </div>
      </div>

      <hr className="my-6 border-slate-100 dark:border-slate-800" />

      <h4 className="mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        Waiting for Approval
      </h4>

      <div className="space-y-2">
        {statsRows.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.color}`}>
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};