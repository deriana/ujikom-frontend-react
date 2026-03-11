import { useState } from "react";
import { Clock } from "lucide-react";
import { AnalogTimePicker } from "./time-analog-picker";

export default function TimePicker({ label, value, onChange, placeholder = "00:00" }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="mt-1.5 relative cursor-pointer group"
      >
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors z-10">
          <Clock size={18} />
        </div>
        <input
          type="text"
          readOnly
          value={value}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm cursor-pointer dark:text-white"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 z-100000 animate-in fade-in zoom-in duration-200">
          <div className="fixed inset-0 -z-1" onClick={() => setIsOpen(false)} />
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden min-w-70">
             <div className="p-2">
                <AnalogTimePicker
                  value={value} 
                  isDarkMode={document.documentElement.classList.contains('dark')}
                  onChange={onChange} 
                />
             </div>

             <div className="p-3 bg-gray-50 dark:bg-gray-800/50 flex gap-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition active:scale-95 shadow-md shadow-emerald-500/20"
                >
                  SET TIME
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}