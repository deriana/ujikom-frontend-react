import { MapPin, ScanFace, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { MobileHomeData } from "@/types";

interface AttendanceCardProps {
  attendanceData: MobileHomeData;
}

export default function AttendanceCard({
  attendanceData,
}: AttendanceCardProps) {
  const navigate = useNavigate();
  const isCheckedIn = attendanceData?.attendance_status.is_checked_in;
  const isCheckedOut = attendanceData?.attendance_status.is_checked_out;

  const getAttendanceHeader = () => {
    if (isCheckedOut)
      return {
        text: "Attendance Completed",
        color: "bg-emerald-500",
        shadow: "shadow-emerald-200",
        icon: <ClipboardList size={16} />,
      };
    if (isCheckedIn)
      return {
        text: "Clock Out Now",
        color: "bg-orange-500",
        shadow: "shadow-orange-200",
        icon: <ScanFace size={16} />,
      };
    return {
      text: "Clock In Now",
      color: "bg-blue-600",
      shadow: "shadow-blue-200",
      icon: <ScanFace size={16} />,
    };
  };

  const handleAttendanceClick = () => {
    if (isCheckedIn && isCheckedOut) {
      toast.error("You have completed your attendance for today.");
      return;
    }
    navigate("/attendance/single");
  };

  return (
    <div
    onClick={handleAttendanceClick}
    className={`${getAttendanceHeader().color} ${getAttendanceHeader().shadow} rounded-4xl p-6 text-white shadow-xl dark:shadow-none relative overflow-hidden transition-all active:scale-[0.98] cursor-pointer`}
  >
    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
        <span className="text-white">{getAttendanceHeader().icon}</span>
        <span className="text-[10px] font-black uppercase tracking-widest">
          {getAttendanceHeader().text}
        </span>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end gap-1 text-blue-100/80 mb-1">
          <MapPin size={12} />
          <span className="text-[10px] font-bold uppercase">
            {attendanceData?.today_schedule?.must_at_office
              ? "Office"
              : "Remote / WFA"}
          </span>
        </div>
        <p className="text-[9px] font-medium text-blue-200/70">
          Schedule: {attendanceData?.today_schedule?.work_start || "--:--"} -{" "}
          {attendanceData?.today_schedule?.work_end || "--:--"}
        </p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-8 relative z-10">
      <div className="space-y-1">
        <p className="text-blue-100/70 text-[10px] font-bold uppercase tracking-wider">
            Clock In
        </p>
        <p className="text-3xl font-black ">
          {attendanceData?.attendance_status.clock_in_time || "--:--"}
        </p>
        {!attendanceData?.attendance_status.is_checked_in && (
          <p className="text-[10px] text-blue-200/50  mt-2 font-medium">
            Not Checked In
          </p>
        )}
      </div>
      <div className="space-y-1 border-l border-white/10 pl-6">
        <p className="text-blue-100/70 text-[10px] font-bold uppercase tracking-wider">
          Clock Out
        </p>
        <p
          className={`text-3xl font-black  ${!attendanceData?.attendance_status.is_checked_out ? "text-white/30" : ""}`}
        >
          {attendanceData?.attendance_status.clock_out_time || "--:--"}
        </p>
        {!attendanceData?.attendance_status.is_checked_out && (
          <p className="text-[10px] text-blue-200/50  mt-2 font-medium">
            Not Checked Out
          </p>
        )}
      </div>
    </div>
    </div>
  );
}
