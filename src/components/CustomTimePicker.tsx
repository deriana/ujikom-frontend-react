import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CustomTimePickerProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

export const CustomTimePicker = ({ label, value, onChange }: CustomTimePickerProps) => {
  const [hour, setHour] = useState(value.split(":")[0] || "09");
  const [minute, setMinute] = useState(value.split(":")[1] || "00");

  useEffect(() => {
    onChange(`${hour}:${minute}`);
  }, [hour, minute]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  const selectClass = `
    appearance-none bg-white dark:bg-gray-900 
    border border-gray-300 dark:border-gray-700 
    rounded-lg px-3 py-2 text-sm font-medium
    focus:ring-2 focus:ring-indigo-500 outline-none
    cursor-pointer hover:border-indigo-400 transition-all
  `;

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <Clock size={14} className="text-indigo-500" /> {label}
      </label>
      
      <div className="flex items-center gap-2">
        {/* Select Jam */}
        <div className="relative group flex-1">
          <select 
            value={hour} 
            onChange={(e) => setHour(e.target.value)}
            className={`${selectClass} w-full`}
          >
            {hours.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <span className="font-bold text-gray-400">:</span>

        {/* Select Menit */}
        <div className="relative group flex-1">
          <select 
            value={minute} 
            onChange={(e) => setMinute(e.target.value)}
            className={`${selectClass} w-full`}
          >
            {minutes.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};