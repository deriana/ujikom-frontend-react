import Select from "./form/Select";

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
  searchable?: boolean;
}

export default function FilterDropdown({
  label,
  value,
  options,
  onChange,
  className = "",
  searchable = true,
}: FilterDropdownProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">
          {label}
        </label>
      )}

      {/* Menggunakan Komponen Select Kustom */}
      <Select
        value={value}
        options={options}
        onChange={onChange}
        placeholder={label ? `Select ${label}...` : "Select option..."}
        className="w-full"
        searchable={searchable}
      />
    </div>
  );
}