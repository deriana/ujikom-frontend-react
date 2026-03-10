import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface ActivityCalendarProps {
  viewDate: Date;
  selectedDate: Date;
  today: Date;
  daysArray: number[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDate: (day: number) => void;
  getDayStatus: (day: number) => { bg: string; text: string } | null;
  onViewDateChange: (date: Date) => void;
}

export default function ActivityCalendar({
  viewDate,
  selectedDate,
  today,
  daysArray,
  onPrevMonth,
  onNextMonth,
  onSelectDate,
  getDayStatus,
  onViewDateChange,
}: ActivityCalendarProps) {
  const [yearInput, setYearInput] = useState(viewDate.getFullYear().toString());

  useEffect(() => {
    setYearInput(viewDate.getFullYear().toString());
  }, [viewDate]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(parseInt(e.target.value));
    onViewDateChange(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setYearInput(val);
    const year = parseInt(val);
    if (!isNaN(year) && year >= 1900 && year <= 2100) {
      const newDate = new Date(viewDate);
      newDate.setFullYear(year);
      onViewDateChange(newDate);
    }
  };

  const handleYearBlur = () => {
    setYearInput(viewDate.getFullYear().toString());
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-4 shadow-sm border dark:border-neutral-800">
      {/* Header Navigasi */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 p-2 mb-6 rounded-2xl">
        <button onClick={onPrevMonth} className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 transition-all">
          <ChevronLeft size={18} className="dark:text-white" />
        </button>

        <div className="flex items-center px-2 py-1 rounded-xl hover:bg-white/80 dark:hover:bg-neutral-700/50 transition-all cursor-pointer group">
          <select
            value={viewDate.getMonth()}
            onChange={handleMonthChange}
            className="bg-transparent font-bold text-sm dark:text-white outline-none cursor-pointer appearance-none pr-1"
          >
            {months.map((month, idx) => (
              <option key={month} value={idx} className="dark:bg-gray-800 text-black dark:text-white">
                {month}
              </option>
            ))}
          </select>
          <span className="text-gray-400 dark:text-neutral-500 font-medium mx-0.5"></span>
          <input
            type="number"
            value={yearInput}
            onChange={handleYearChange}
            onBlur={handleYearBlur}
            className="bg-transparent font-bold text-sm dark:text-white w-12 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus:text-blue-600 dark:focus:text-blue-400 transition-colors"
          />
        </div>

        <button onClick={onNextMonth} className="p-2 rounded-xl hover:bg-white dark:hover:bg-neutral-700 transition-all">
          <ChevronRight size={18} className="dark:text-white" />
        </button>
      </div>

      {/* Nama Hari */}
      <div className="grid grid-cols-7 mb-4">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Grid Hari */}
      <div className="grid grid-cols-7 gap-y-2">
        {daysArray.map((day, idx) => {
          const isCurrentMonth = day > 0 && day <= 31;
          const isSelected = isCurrentMonth && day === selectedDate.getDate() && viewDate.getMonth() === selectedDate.getMonth();
          const isToday = isCurrentMonth && day === today.getDate() && viewDate.getMonth() === today.getMonth();
          const status = getDayStatus(day);

          return (
            <div key={idx} className="flex flex-col items-center justify-center py-2">
              <button
                onClick={() => isCurrentMonth && onSelectDate(day)}
                className={`relative w-10 h-10 flex items-center justify-center text-sm font-bold rounded-xl transition-all 
                  ${isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : isCurrentMonth ? (status ? status.text : "text-gray-700 dark:text-neutral-300") : "text-gray-300 dark:text-neutral-600"}
                  ${isToday && !isSelected ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800" : ""}`}
              >
                {day < -100 ? Math.abs(day + 100) : Math.abs(day)}
                {isCurrentMonth && status && (
                  <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${status.bg} border-2 border-white dark:border-gray-800`} />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4 border-t dark:border-neutral-700 pt-4 text-[9px] font-bold text-gray-400 uppercase">
        <LegendItem color="bg-emerald-500" label="Leave" />
        <LegendItem color="bg-blue-400" label="Holiday" />
        <LegendItem color="bg-yellow-500" label="Payday" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <span className="tracking-tighter">{label}</span>
    </div>
  );
}