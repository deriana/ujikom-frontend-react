import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { CalenderIcon } from "../../icons";

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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    pickerRef.current = flatpickr(inputRef.current, {
      mode,
      dateFormat: "Y-m-d",
      defaultDate: value,
      disableMobile: true,
      clickOpens: !disabled,

      onChange: (selectedDates, dateStr) => {
        onChange?.(selectedDates, dateStr);
      },

      onReady: (_dates, _str, instance) => {
        const container = instance.calendarContainer;
        container.style.zIndex = "999999";

        const monthDropdown = container.querySelector(
          ".flatpickr-monthDropdown-months"
        ) as HTMLSelectElement | null;

        const yearInput = container.querySelector(
          ".cur-year"
        ) as HTMLInputElement | null;

        // ambil style dari calendar container
        const styles = window.getComputedStyle(container);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;

        if (monthDropdown) {
          monthDropdown.style.appearance = "none";
          monthDropdown.style.border = "none";
          monthDropdown.style.fontWeight = "600";
          monthDropdown.style.cursor = "pointer";
          monthDropdown.style.padding = "2px 18px 2px 4px";
          monthDropdown.style.borderRadius = "6px";

          // mengikuti theme calendar
          monthDropdown.style.backgroundColor = bgColor;
          monthDropdown.style.color = textColor;

          // apply juga ke option dropdown
          Array.from(monthDropdown.options).forEach((opt) => {
            opt.style.backgroundColor = bgColor;
            opt.style.color = textColor;
          });
        }

        if (yearInput) {
          yearInput.style.background = "transparent";
          yearInput.style.border = "none";
          yearInput.style.fontWeight = "600";
          yearInput.style.color = textColor;
        }
      },
    });

    return () => {
      pickerRef.current?.destroy();
      pickerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (pickerRef.current && value) {
      pickerRef.current.setDate(value, false);
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
          ref={inputRef}
          id={id}
          readOnly
          placeholder={placeholder || "Select date"}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border rounded-lg outline-none
          cursor-pointer appearance-none
          bg-white text-gray-700 border-gray-300
          focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
          dark:bg-white/5 dark:text-gray-300 dark:border-white/10
          dark:focus:border-blue-500/50
          disabled:opacity-50 disabled:cursor-not-allowed pr-10"
        />

        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
          <CalenderIcon className="size-4" />
        </div>
      </div>
    </div>
  );
}