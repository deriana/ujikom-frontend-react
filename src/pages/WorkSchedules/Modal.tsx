import Input from "@/components/form/input/InputField";
import { WorkScheduleInput } from "@/types";
import CrudModal from "@/components/ui/modal/CrudModal";
import { WORK_MODE, WORK_MODE_OPTIONS } from "@/constants/WorkMode";
import TimePicker from "@/components/form/time-picker";
import {
  CalendarClock,
  Settings2,
  Clock,
  MapPin,
  Layers,
} from "lucide-react";

interface WorkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WorkScheduleInput;
  setData: (data: WorkScheduleInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function WorkScheduleModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
}: WorkScheduleModalProps) {
  // Identifikasi mode edit
  const isEdit = Boolean(data.uuid);

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isEdit ? "Update Schedule" : "New Work Schedule"}
      description={
        isEdit
          ? `Refining configuration for ${data.name || "this schedule"}`
          : "Define operational hours and work location rules."
      }
      icon={CalendarClock}
      isEdit={isEdit}
      isLoading={isLoading}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Primary Configuration Section */}
        <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
          {/* Schedule Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Settings2 size={14} /> Schedule Name
            </label>
            <Input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="e.g. Regular Morning Shift"
              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Work Mode Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Layers size={14} /> Work Mode
            </label>
            <select
              value={data.work_mode_id || ""}
              onChange={(e) => {
                const modeId = Number(e.target.value);
                const isOfficeMode = modeId === WORK_MODE.OFFICE.id;

                setData({
                  ...data,
                  work_mode_id: modeId,
                  requires_office_location: isOfficeMode,
                });
              }}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-all appearance-none"
            >
              <option value="" disabled>
                Select Mode
              </option>
              {WORK_MODE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimePicker
              label="Start Time"
              value={data.work_start_time || "00:00"}
              onChange={(value: string) =>
                setData({ ...data, work_start_time: value })
              }
            />
            <TimePicker
              label="End Time"
              value={data.work_end_time || "00:00"}
              onChange={(value: string) =>
                setData({ ...data, work_end_time: value })
              }
            />
          </div>

          {/* Break Time Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimePicker
              label="Break Start"
              value={data.break_start_time || "00:00"}
              onChange={(value: string) =>
                setData({ ...data, break_start_time: value })
              }
            />
            <TimePicker
              label="Break End"
              value={data.break_end_time || "00:00"}
              onChange={(value: string) =>
                setData({ ...data, break_end_time: value })
              }
            />
          </div>

          {/* Late Tolerance */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Clock size={14} /> Late Tolerance (Minutes)
            </label>
            <Input
              type="number"
              min="0"
              value={data.late_tolerance_minutes ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setData({
                  ...data,
                  late_tolerance_minutes: val === "" ? null : Number(val),
                });
              }}
              placeholder="0"
              className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Location Requirement Section */}
        <div className="space-y-3">
          {!data.work_mode_id ? (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 border-dashed">
              <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-400">
                <MapPin size={18} />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                Select a work mode to see location requirements.
              </p>
            </div>
          ) : Number(data.work_mode_id) === WORK_MODE.OFFICE.id ? (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500 text-white">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
                    Office Location Required
                  </p>
                  <p className="text-xs text-blue-700/70 dark:text-blue-400/60">
                    Attendance is only valid within office coordinates.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30 animate-in fade-in zoom-in duration-300">
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  Anywhere Access
                </p>
                <p className="text-xs text-emerald-700/70 dark:text-emerald-400/60 italic">
                  Location tracking is disabled for{" "}
                  {Number(data.work_mode_id) === 2 ? "WFH" : "Hybrid"} mode.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CrudModal>
  );
}
