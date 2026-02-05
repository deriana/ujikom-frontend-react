export const formatRupiah = (
  value: number,
  options?: Intl.NumberFormatOptions
): string => {
  if (isNaN(value)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
};
