import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField"; // Tetap pakai untuk Late Tolerance
import { AttendanceValues } from "@/types";
import { useUpdateSetting } from "@/hooks/useSetting";
import toast from "react-hot-toast";
import TimePicker from "../form/time-picker";

export default function AttendanceSetting({ data }: { data: AttendanceValues }) {
  const [attendance, setAttendance] = useState({
    start: data.work_start_time,
    end: data.work_end_time,
    late: data.late_tolerance_minutes,
  });

  const { mutateAsync: updateSetting, isPending } = useUpdateSetting<"attendance">();

  const handleSubmit = async () => {
    try {
      await updateSetting({
        type: "attendance",
        data: {
          work_start_time: attendance.start,
          work_end_time: attendance.end,
          late_tolerance_minutes: attendance.late,
        },
      });
      toast.success("Attendance updated successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update attendance");
    }
  };

  return (
    <ComponentCard title="Attendance Timing">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Work Start Time menggunakan Flatpickr */}
        <TimePicker
          label="Work Start Time"
          value={attendance.start}
          onChange={(time: string) => setAttendance({ ...attendance, start: time })}
        />

        {/* Work End Time menggunakan Flatpickr */}
        <TimePicker
          label="Work End Time"
          value={attendance.end}
          onChange={(time: string) => setAttendance({ ...attendance, end: time })}
        />

        {/* Late Tolerance tetap pakai Input Field biasa karena ini Number */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs font-bold uppercase text-gray-400">
            Late Tolerance (Minutes)
          </label>
          <Input
            type="number"
            value={attendance.late}
            onChange={(e) =>
              setAttendance({ ...attendance, late: Number(e.target.value) })
            }
            placeholder="0"
          />
          <p className="text-[11px] text-gray-400 italic font-medium">
            Karyawan tidak akan dianggap terlambat jika absen dalam rentang waktu ini.
          </p>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end pt-4">
          <button
            type="button"
            disabled={isPending}
            onClick={handleSubmit}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition active:scale-95 disabled:opacity-70"
          >
            {isPending ? "Menyimpan..." : "Update Attendance"}
          </button>
        </div>
      </div>
    </ComponentCard>
  );
}