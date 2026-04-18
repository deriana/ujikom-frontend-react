// components/form/time-picker/index.tsx
import { useRef, useId, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";
import { AnalogTimePicker } from "./time-analog-picker";
import { useTimePickerManager } from "@/hooks/useTimePicker";

export default function TimePicker({
  label,
  value,
  onChange,
  placeholder = "00:00",
}: any) {
  const uid = useId(); // unik per instance
  const { isOpen, open, close } = useTimePickerManager(uid);
  const triggerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 320;

    setPos({
      top:
        spaceBelow < dropdownHeight
          ? rect.top + window.scrollY - dropdownHeight - 8
          : rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  const handleOpen = () => {
    updatePosition();
    open();
  };

  // Click outside — deteksi klik di luar trigger DAN dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedTrigger = triggerRef.current?.contains(target);
      const clickedDropdown = dropdownRef.current?.contains(target);
      if (!clickedTrigger && !clickedDropdown) {
        close();
      }
    };

    // Pakai setTimeout agar tidak langsung trigger saat open
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, close]);

  const dropdown = isOpen
    ? createPortal(
        <div
          ref={dropdownRef}
          className="absolute z-99999999999 animate-in fade-in zoom-in duration-200"
          style={{ top: pos.top, left: pos.left, minWidth: pos.width }}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden min-w-70">
            <div className="p-2">
              <AnalogTimePicker
                value={value}
                isDarkMode={document.documentElement.classList.contains("dark")}
                onChange={onChange}
              />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 flex gap-2">
              <button
                onMouseDown={(e) => e.stopPropagation()} // cegah trigger click outside
                onClick={close}
                className="flex-1 py-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition active:scale-95 shadow-md shadow-emerald-500/20"
              >
                SET TIME
              </button>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className="relative w-full">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div
        ref={triggerRef}
        onClick={handleOpen}
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
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm cursor-pointer dark:text-white pointer-events-none"
        />
      </div>

      {dropdown}
    </div>
  );
}