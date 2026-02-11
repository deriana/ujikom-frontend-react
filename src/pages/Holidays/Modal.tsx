import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { HolidayInput } from "@/types";
import { CalendarDays, Info } from "lucide-react";
import DatePicker from "@/components/form/date-picker";

interface HolidayModalProps {
  isOpen: boolean;
  onClose: () => void;
  holidayData: HolidayInput;
  setHolidayData: (data: HolidayInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function HolidayModal({
  isOpen,
  onClose,
  holidayData,
  setHolidayData,
  onSubmit,
  isLoading = false,
}: HolidayModalProps) {
  const isEdit = Boolean(holidayData.uuid);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <CalendarDays size={22} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Holiday" : "Create New Holiday"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
            {isEdit
              ? `Editing holiday "${holidayData.name || ""}"`
              : "Add a company holiday or national holiday date."}
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
            {/* Holiday Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Holiday Name
              </label>
              <Input
                type="text"
                value={holidayData.name}
                onChange={(e) =>
                  setHolidayData({ ...holidayData, name: e.target.value })
                }
                placeholder="e.g. Independence Day"
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Holiday Date
              </label>
              <DatePicker
                id="holiday_picker"
                mode="range"
                placeholder="Select holiday date"
                value={holidayData.date || ""}
                onChange={(_selectedDates, dateStr) =>
                  setHolidayData({ ...holidayData, date: dateStr })
                }
              />
            </div>

            {/* Recurring Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40">
              <div>
                <p className="text-sm font-semibold text-gray-800 dark:text-white">
                  Recurring Holiday
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This holiday repeats every year on the same date
                </p>
              </div>
              <input
                type="checkbox"
                checked={holidayData.is_recurring}
                onChange={(e) =>
                  setHolidayData({
                    ...holidayData,
                    is_recurring: e.target.checked,
                  })
                }
                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Recurring holidays will automatically apply every year without
                needing to create a new entry.
              </p>
            </div>
          </div>

          {/* Footer Buttons */}
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
                ? "Processing..."
                : isEdit
                  ? "Save Changes"
                  : "Create Holiday"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
