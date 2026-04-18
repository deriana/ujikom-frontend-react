import Input from "@/components/form/input/InputField";
import { HolidayInput } from "@/types";
import { CalendarDays, Info } from "lucide-react";
import DatePicker from "@/components/form/date-picker";
import CrudModal from "@/components/ui/modal/CrudModal";
import Checkbox from "@/components/form/input/Checkbox";

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

  /** Convert start/end → flatpickr range string */
  const rangeValue =
    holidayData.start_date && holidayData.end_date
      ? `${holidayData.start_date} to ${holidayData.end_date}`
      : holidayData.start_date || "";

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isEdit ? "Update Holiday" : "Create New Holiday"}
      description={
        isEdit
          ? `Editing holiday "${holidayData.name || ""}"`
          : "Add a company or national holiday."
      }
      icon={CalendarDays}
      isEdit={isEdit}
      isLoading={isLoading}
      maxWidth="max-w-lg"
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
            placeholder="e.g. Eid al-Fitr Leave"
          />
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Holiday Date Range
          </label>
          <DatePicker
            id="holiday_range_picker"
            mode="range"
            placeholder="Select start and end date"
            value={rangeValue}
            onChange={(_dates, dateStr) => {
              if (!dateStr) {
                setHolidayData({
                  ...holidayData,
                  start_date: "",
                  end_date: null,
                });
                return;
              }

              const parts = dateStr.split(" to ");
              const start = parts[0];
              const end = parts[1] || null;

              setHolidayData({
                ...holidayData,
                start_date: start,
                end_date: end,
              });
            }}
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
          <Checkbox
            checked={holidayData.is_recurring}
            onChange={(checked) =>
              setHolidayData({
                ...holidayData,
                is_recurring: checked,
              })
            }
            className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
          <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            You can select a single day or a range. To select a single day,
            please <strong>click the same date twice</strong>.
          </p>
        </div>
      </div>
    </CrudModal>
  );
}
