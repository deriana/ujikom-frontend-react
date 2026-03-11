import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { WorkScheduleInput } from "@/types";
import { WORK_MODE, WORK_MODE_OPTIONS } from "@/constants/WorkMode";
import TimePicker from "@/components/form/time-picker";
import {
  CalendarClock,
  Settings2,
  Clock,
  MapPin,
  Layers,
  CheckCircle2,
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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
      <div className="relative w-full overflow-visible rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <CalendarClock size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Schedule" : "New Work Schedule"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
            {isEdit
              ? `Refining configuration for ${data.name || "this schedule"}`
              : "Define operational hours and work location rules."}
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
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
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus:ring-blue-500"
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
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-all appearance-none"
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
                {/* Start Time */}
                <div className="space-y-2">
                  <TimePicker
                    label="Start Time"
                    value={data.work_start_time || "00:00"}
                    onChange={(value: string) =>
                      setData({ ...data, work_start_time: value })
                    }
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <TimePicker
                    label="End Time"
                    value={data.work_end_time || "00:00"}
                    onChange={(value: string) =>
                      setData({ ...data, work_end_time: value })
                    }
                  />
                </div>
              </div>

              {/* Break Time Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <TimePicker
                    label="Break Start"
                    value={data.break_start_time || "00:00"}
                    onChange={(value: string) =>
                      setData({ ...data, break_start_time: value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <TimePicker
                    label="Break End"
                    value={data.break_end_time || "00:00"}
                    onChange={(value: string) =>
                      setData({ ...data, break_end_time: value })
                    }
                  />
                </div>
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
                      // If empty (""), save null. Not 0.
                      late_tolerance_minutes: val === "" ? null : Number(val),
                    });
                  }}
                  placeholder="0"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Location Requirement Section - Tanpa Toggle/Checkbox */}
            <div className="space-y-3">
              {!data.work_mode_id ? (
                /* 1. Belum pilih mode */
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 border-dashed">
                  <div className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    Select a work mode to see location requirements.
                  </p>
                </div>
              ) : Number(data.work_mode_id) === WORK_MODE.OFFICE.id ? (
                /* 2. Mode WFO (Wajib Lokasi) */
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
                  <CheckCircle2 size={20} className="text-blue-500" />
                </div>
              ) : (
                /* 3. Mode WFH / Hybrid (Bebas Lokasi) */
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

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]"
            >
              {isLoading
                ? "Saving..."
                : isEdit
                  ? "Update Schedule"
                  : "Create Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
