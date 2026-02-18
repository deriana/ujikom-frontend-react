import React, { ReactNode, useState, useRef } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = "top",
  className = "",
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      // Logika hitung posisi koordinat agar menempel di tombol
      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top + scrollY - 10;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + scrollY + 10;
          left = rect.left + scrollX + rect.width / 2;
          break;
      }
      setCoords({ top, left });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setVisible(true);
  };

  return (
    <div
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className={`tooltip fixed z-9999999 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-xl pointer-events-none whitespace-nowrap transition-opacity duration-200 ${className} ${
                position === 'top' ? '-translate-x-1/2 -translate-y-full' : '-translate-x-1/2'
            }`}
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >
            {content}
            {/* Arrow */}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' : '-top-1 left-1/2 -translate-x-1/2'
            }`} />
          </div>,
          document.body // INI KUNCINYA: Dirender di body, bukan di dalam tabel
        )}
    </div>
  );
};

export default Tooltip;