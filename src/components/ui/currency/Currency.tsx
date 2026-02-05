import { formatRupiah } from "@/utils/currency";

interface CurrencyProps {
  value: number;
  className?: string;
}

const Currency = ({ value, className = "" }: CurrencyProps) => {
  return (
    <span className={className}>
      {formatRupiah(value)}
    </span>
  );
};

export default Currency;
