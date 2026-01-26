interface Option {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className = "",
}: FilterDropdownProps) {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   bg-white text-gray-700
                   dark:bg-white/5 dark:text-gray-300 dark:border-white/10"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
