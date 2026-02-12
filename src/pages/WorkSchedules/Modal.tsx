import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { WorkScheduleInput } from "@/types";
import { WORK_MODE_OPTIONS } from "@/constants/WorkMode";
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
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800">
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
                  onChange={(e) =>
                    setData({
                      ...data,
                      work_mode_id: Number(e.target.value),
                    })
                  }
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
              {/* Time Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Start Time */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock size={14} /> Start Time
                  </label>
                  <Input
                    type="time"
                    value={data.work_start_time || ""}
                    onChange={(e) =>
                      setData({ ...data, work_start_time: e.target.value })
                    }
                    onClick={(e) => e.currentTarget.showPicker()} // optional: show time picker on click
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-pointer"
                    trailingIcon={<Clock size={18} />}
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Clock size={14} /> End Time
                  </label>
                  <Input
                    type="time"
                    value={data.work_end_time || ""}
                    onChange={(e) =>
                      setData({ ...data, work_end_time: e.target.value })
                    }
                    onClick={(e) => e.currentTarget.showPicker()}
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 cursor-pointer"
                    trailingIcon={<Clock size={18} />}
                  />
                </div>
              </div>
            </div>

            {/* Location Requirement Toggle */}
            <div
              onClick={() =>
                setData({
                  ...data,
                  requires_office_location: !data.requires_office_location,
                })
              }
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                data.requires_office_location
                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                  : "bg-gray-50 border-gray-100 dark:bg-gray-800/40 dark:border-gray-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${data.requires_office_location ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}
                >
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Requires Office Location
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Employee must be at the designated office to clock in.
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  data.requires_office_location
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {data.requires_office_location && (
                  <CheckCircle2 size={16} className="text-white" />
                )}
              </div>
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
