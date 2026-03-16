import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Clock } from "lucide-react";

interface TimePickerFlatpickrProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  placeholder?: string;
}

const TimePickerFlatpickr: React.FC<TimePickerFlatpickrProps> = ({
  value,
  onChange,
  label,
  placeholder = "00:00",
}) => {
  const fpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fpRef.current) {
      const fp = flatpickr(fpRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        defaultDate: value,
        position: "below center",
        disableMobile: true,
        allowInput: false,
        onChange: (_selectedDates, dateStr) => {
          onChange(dateStr);
        },
        onOpen: (_selectedDates, _dateStr, instance) => {
          instance.calendarContainer.classList.add("dark");
          instance.calendarContainer.classList.add(
            "shadow-2xl",
            "rounded-xl",
            "border",
            "dark:border-gray-700",
            "p-1",
          );

          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          setTimeout(() => {
            const hourInput =
              instance.calendarContainer.querySelector(".flatpickr-hour");
            if (hourInput) {
              (hourInput as HTMLElement).blur();
            }
          }, 10);
        },
      });

      return () => fp.destroy();
    }
  }, []);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 group-focus-within:text-emerald-500">
          <Clock size={18} />
        </div>

        <input
          ref={fpRef}
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border dark:text-white border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm"
          defaultValue={value}
        />
      </div>
    </div>
  );
};

export default TimePickerFlatpickr;
