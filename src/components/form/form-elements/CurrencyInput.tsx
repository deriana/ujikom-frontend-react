import Input from "../input/InputField";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  symbol?: string;
  className?: string;
}

export const CurrencyInput = ({
  value,
  onChange,
  placeholder = "Enter amount",
  symbol = "Rp",
  className = "",
}: CurrencyInputProps) => {
  
  const formatDisplay = (val: number) => {
    if (!val) return "";
    return new Intl.NumberFormat("id-ID").format(val);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); 
    const numericValue = rawValue === "" ? 0 : Number(rawValue);
    onChange(numericValue);
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={formatDisplay(value)}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-14 no-spinner" 
      />

      <span className="absolute left-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center border-r border-gray-200 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
        {symbol}
      </span>
    </div>
  );
};