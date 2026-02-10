import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (selectedDates: Date[], dateStr: string) => void;
  value?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

export default function DatePicker({
  id,
  mode = "single",
  onChange,
  label,
  value,
  placeholder,
  disabled = false,
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
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      defaultDate: value || undefined,
      clickOpens: !disabled,
      appendTo: document.body,
      onChange: (selectedDates, dateStr) => {
        if (onChangeRef.current) {
          onChangeRef.current(selectedDates, dateStr);
        }
      },
    });

    if (fpRef.current?.calendarContainer) {
      fpRef.current.calendarContainer.style.zIndex = "9999";
    }

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
    <div className="w-full relative">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          readOnly
          placeholder={placeholder}
          disabled={disabled}
          className="h-11 w-full cursor-pointer rounded-lg border appearance-none pl-4 pr-11 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
        />
        <span className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
          <CalenderIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
