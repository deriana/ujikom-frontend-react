import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect/index";

import "flatpickr/dist/flatpickr.css";
import "flatpickr/dist/plugins/monthSelect/style.css"; 

import { CalenderIcon } from "../../icons";

interface MonthPickerProps {
  id: string;
  value?: string; // Format: "YYYY-MM"
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export default function MonthPicker({
  id,
  value = "",
  onChange,
  placeholder = "Select month & year",
  label,
  disabled = false,
  className = "",
}: MonthPickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    pickerRef.current = flatpickr(inputRef.current, {
      disableMobile: true,
      plugins: [
        new (monthSelectPlugin as any)({
          shorthand: true, 
          dateFormat: "Y-m",
          altFormat: "F Y", 
          altInput: true,   
        }),
      ],
      onChange: (_dates, dateStr) => {
        onChange?.(dateStr);
      },
    });

    return () => {
      pickerRef.current?.destroy();
      pickerRef.current = null;
    };
  }, []);

  // Sync value dari luar (State Parent)
  useEffect(() => {
    if (pickerRef.current) {
      if (!value) {
        pickerRef.current.clear();
      } else {
        pickerRef.current.setDate(value, false);
      }
    }
  }, [value]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm border rounded-lg outline-none cursor-pointer
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