import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { CalenderIcon } from "../../icons"; // Pastikan path benar atau gunakan Lucide Calendar

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (selectedDates: Date[], dateStr: string) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  value,
  placeholder,
  disabled = false,
  className = "",
}: PropsType) {
  const fpRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    fpRef.current = flatpickr(`#${id}`, {
      mode: mode,
      static: false,
      appendTo: document.body,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: value || undefined,
      clickOpens: !disabled,
      onChange: (selectedDates, dateStr) => {
        if (onChangeRef.current) {
          onChangeRef.current(selectedDates, dateStr);
        }
      },
      onReady: (_selectedDates, _dateStr, instance) => {
        instance.calendarContainer.style.zIndex = "99999999";
      },
    });

    return () => {
      if (fpRef.current) {
        fpRef.current.destroy();
      }
    };
  }, [id, mode, disabled]);

  useEffect(() => {
    if (fpRef.current && value !== undefined) {
      fpRef.current.setDate(value, false);
    }
  }, [value]);

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}

      <div className="relative group">
        <input
          id={id}
          readOnly
          placeholder={placeholder || "Select date"}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border rounded-lg outline-none transition-all
                   cursor-pointer appearance-none
                   bg-white text-gray-700 border-gray-300
                   focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                   dark:bg-white/5 dark:text-gray-300 dark:border-white/10 dark:focus:border-blue-500/50
                   disabled:opacity-50 disabled:cursor-not-allowed pr-10"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <CalenderIcon className="size-4" />
        </div>
      </div>
    </div>
  );
}