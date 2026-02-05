import React from "react";
import { AllowanceType } from "@/types";
import Input from "../input/InputField";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  type: AllowanceType;
  placeholder?: string;
  className?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  type,
  placeholder = "",
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) onChange(val);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Amount
      </label>

      <div className="relative mt-1">
        <Input
          type="number"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pl-12 ${className}`}
        />

        {type === "fixed" && (
          <span className="absolute left-0 top-1/2 flex h-11 w-12 -translate-y-1/2 items-center justify-center border-r border-gray-200 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
            Rp
          </span>
        )}
        {type === "percentage" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 dark:text-gray-300">
            %
          </span>
        )}
      </div>

      {type === "percentage" && (
        <p className="text-xs text-gray-500 mt-1">
          This will be calculated based on salary percentage.
        </p>
      )}
    </div>
  );
};

export default CurrencyInput;
