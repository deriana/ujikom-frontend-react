import React, { useState, useEffect } from "react";
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
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    if (value === 0) {
      setDisplayValue("");
    } else {
      setDisplayValue(new Intl.NumberFormat("id-ID").format(value));
    }
  }, [value]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // 1. Ambil input mentah
  let inputValue = e.target.value;

  // 2. Hapus semua karakter KECUALI angka dan tanda minus
  // Kita izinkan '-' tapi nanti kita validasi posisinya
  const cleanValue = inputValue.replace(/[^\d-]/g, "");

  // 3. Pastikan tanda minus hanya ada di depan (mencegah "10-0")
  // Dan pastikan tidak ada double minus "--10"
  if (cleanValue === "" || cleanValue === "-") {
    setDisplayValue(cleanValue); // Update tampilan sementara jika hanya "-"
    onChange(0);
    return;
  }

  const numericValue = parseInt(cleanValue, 10);

  // Cek jika hasil parsing adalah angka valid (bukan NaN)
  if (!isNaN(numericValue)) {
    onChange(numericValue);
  }
};

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-14"
      />
      <span className="absolute left-0 top-1/2 flex h-full w-12 -translate-y-1/2 items-center justify-center border-r border-gray-200 text-sm font-medium text-gray-600 dark:border-gray-700 dark:text-gray-300">
        {symbol}
      </span>
    </div>
  );
};