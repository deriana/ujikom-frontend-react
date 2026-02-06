import Input from "../input/InputField";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  symbol?: string;
  className?: string; // Untuk custom margin atau width dari luar
}

export const CurrencyInput = ({
  value,
  onChange,
  placeholder = "Enter amount",
  symbol = "Rp",
  className = "",
}: CurrencyInputProps) => {
  return (
    <div className={`relative  ${className}`}>
      <Input
        type="number"
        value={value === 0 ? "" : value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === "" ? 0 : Number(val));
        }}
        placeholder={placeholder}
        // Gabungkan class default dengan class khusus spinner
        className="pl-15 no-spinner" 
      />

      <span className="absolute left-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center border-r border-gray-200 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
        {symbol}
      </span>
    </div>
  );
};