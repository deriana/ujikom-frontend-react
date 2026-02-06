import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import { Clock } from "lucide-react"; // Import ikon jam

export default function AttendanceSetting({ data }: { data: any }) {
  const [startTime, setStartTime] = useState(data.work_start_time);
  const [endTime, setEndTime] = useState(data.work_end_time);

  // Buat state agar input bisa diedit
  const [attendance, setAttendance] = useState({
    start: data.work_start_time,
    end: data.work_end_time,
    late: data.late_tolerance_minutes,
  });

  return (
    <ComponentCard title="Attendance Timing">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-500">
            Work Start Time
          </label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker()}
            trailingIcon={<Clock size={18} />}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">
            Work End Time
          </label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setStartTime(e.target.value)}
            onClick={(e) => e.currentTarget.showPicker()}
            trailingIcon={<Clock size={18} />}
            className="cursor-pointer"
            
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">
            Late Tolerance (Minutes)
          </label>
          <Input
            type="number"
            value={attendance.late}
            onChange={(e) =>
              setAttendance({ ...attendance, late: e.target.value })
            }
            placeholder="0"
          />
          <p className="text-[11px] text-gray-400 italic font-medium">
            Karyawan tidak akan dianggap terlambat jika absen dalam rentang
            waktu ini.
          </p>
        </div>

        <div className="md:col-span-2 flex justify-end pt-4">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition active:scale-95">
            Update Attendance
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}
