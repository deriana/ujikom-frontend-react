import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { ShiftTemplateInput } from "@/types";
import { Clock, CalendarClock, Info } from "lucide-react";
import TimePicker from "@/components/form/time-picker";

interface ShiftTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftData: ShiftTemplateInput;
  setShiftData: (data: ShiftTemplateInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function ShiftTemplateModal({
  isOpen,
  onClose,
  shiftData,
  setShiftData,
  onSubmit,
  isLoading = false,
}: ShiftTemplateModalProps) {
  const isEdit = Boolean(shiftData.uuid);

  const calculateCrossDay = (start: string, end: string) => {
    if (!start || !end) return false;
    return end < start;
  };

  const handleTimeChange = (
    field: "start_time" | "end_time",
    value: string,
  ) => {
    const updatedData = { ...shiftData, [field]: value };
    const crossDay = calculateCrossDay(
      field === "start_time" ? value : shiftData.start_time,
      field === "end_time" ? value : shiftData.end_time,
    );

    setShiftData({ ...updatedData, cross_day: crossDay });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
      <div className="w-full overflow-visible rounded-2xl bg-white dark:bg-gray-950 shadow-2xl border border-gray-100 dark:border-gray-800">
        {/* Header Section */}
        <div className="relative bg-gray-50/50 dark:bg-gray-900/50 px-8 py-6 border-b border-gray-100 dark:border-gray-800">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarClock className="text-blue-500" size={24} />
            {isEdit ? "Update Shift Template" : "Create New Shift"}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure working hours and attendance rules.
          </p>
        </div>

        <form
          className="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Shift Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Shift Name
            </label>
            <Input
              type="text"
              value={shiftData.name}
              onChange={(e) =>
                setShiftData({ ...shiftData, name: e.target.value })
              }
              placeholder="e.g. Morning Regular Shift"
              className="bg-gray-50 dark:bg-gray-900"
            />
          </div>

          {/* Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
            <div className="space-y-2">
              <TimePicker
                label="Work Start Time"
                placeholder="00:00"
                value={shiftData.start_time}
                onChange={(value: string) =>
                  handleTimeChange("start_time", value)
                }
                trailingIcon={<Clock size={18} className="text-gray-400" />}
                className="cursor-pointer font-mono text-lg bg-white dark:bg-gray-900"
              />
            </div>

            <div className="space-y-2">
              <TimePicker
                label="Work End Time"
                placeholder="00:00"
                value={shiftData.end_time}
                onChange={(value: string) =>
                  handleTimeChange("end_time", value)
                }
                trailingIcon={<Clock size={18} className="text-gray-400" />}
                className="cursor-pointer font-mono text-lg bg-white dark:bg-gray-900"
              />
            </div>

            {/* Cross Day Notice */}
            {shiftData.cross_day && (
              <div className="md:col-span-2 flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-lg">
                <Info size={14} className="text-amber-600" />
                <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  Overnight Shift: This schedule ends on the next calendar day.
                </p>
              </div>
            )}
          </div>

          {/* Late Tolerance */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Late Tolerance (minutes)
            </label>
            <div className="relative group">
              <Input
                type="number"
                min="0"
                value={shiftData.late_tolerance_minutes}
                onChange={(e) =>
                  setShiftData({
                    ...shiftData,
                    late_tolerance_minutes:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                placeholder="0"
                className="bg-gray-50 dark:bg-gray-900 pr-12"
              />
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-xs font-semibold text-gray-400 uppercase">
                Min
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              Cancel
            </button>

            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Shift"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
