import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Atau 'next/navigation' jika pakai Next.js

interface CircleButtonProps {
  icon: LucideIcon;
  onClick?: () => void;
  to?: string; // Jika ingin navigasi ke path spesifik
  className?: string;
  iconSize?: number;
}

export default function CircleButton({
  icon: Icon,
  onClick,
  to,
  className = "",
  iconSize = 20,
}: CircleButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) return onClick(); // Jalankan fungsi custom jika ada
    if (to) return navigate(to);   // Navigasi ke path tertentu
    navigate(-1);                  // Default: Back
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm ${className}`}
    >
      <Icon size={iconSize} className="text-gray-700 dark:text-white" />
    </button>
  );
}