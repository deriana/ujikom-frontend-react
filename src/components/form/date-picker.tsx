import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

// @/components/form/DatePicker.tsx
export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  value, // Tambahkan prop value
  placeholder,
  defaultDate,
}: PropsType & { value?: string }) {
  // @/components/form/DatePicker.tsx

  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "Y-m-d",
      // Gunakan defaultDate dari props, jika tidak ada baru pakai value
      defaultDate: defaultDate || value,
      onChange: onChange,
    });

    // Trik agar state awal terisi jika defaultDate digunakan
    if (defaultDate && !value && onChange) {
      // @ts-ignore
      onChange([new Date(defaultDate)], defaultDate);
    }

    return () => {
      if (!Array.isArray(flatPickr)) flatPickr.destroy();
    };
  }, [id, defaultDate]); // Tambahkan defaultDate ke dependency array

  return (
    <div className="w-full">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          readOnly // Bagus untuk Flatpickr agar tidak memicu keyboard mobile
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
        />
        <span className="absolute text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
          <CalenderIcon className="size-5" />
        </span>
      </div>
    </div>
  );
}
