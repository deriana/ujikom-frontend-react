import { useState } from "react";

interface Option<T = string> {
  value: T;
  label: string;
}

interface SelectProps<T = string> {
  options: Option<T>[];
  placeholder?: string;
  onChange: (value: T) => void;
  className?: string;
  defaultValue?: T;
  value?: T;
  disabled?: boolean;
}

const Select = <T extends string | number>({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue,
  value,
  disabled = false,
}: SelectProps<T>) => {
  // Manage selected value as string internally
  const [selectedValue, setSelectedValue] = useState<string>(
    value !== undefined ? String(value) : ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedValue(val);

    // Convert back to number if generic is number
    const selected: T = typeof options[0].value === "number" ? (Number(val) as T) : (val as T);
    onChange(selected);
  };

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        selectedValue
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={selectedValue}
      onChange={handleChange}
      disabled={disabled}
    >
      {/* Placeholder */}
      <option
        value=""
        disabled
        className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {placeholder}
      </option>

      {options.map((option) => (
        <option
          key={option.value.toString()} // key harus string
          value={option.value.toString()} // convert value ke string untuk select
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
