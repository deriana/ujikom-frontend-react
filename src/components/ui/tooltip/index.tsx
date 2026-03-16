import React, { ReactNode, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/hooks/useIsMobile";

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
  const isMobile = useIsMobile();

  if (isMobile) {
    return <>{children}</>;
  }

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      
      // Gunakan getBoundingClientRect() langsung untuk fixed position
      // Tidak perlu ditambah window.scrollY/X
      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top - 8; // Beri sedikit jarak (gap)
          left = rect.left + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2;
          left = rect.left - 8;
          break;
        case "right":
          top = rect.top + rect.height / 2;
          left = rect.right + 8;
          break;
      }
      setCoords({ top, left });
    }
  };

  // Tambahkan event listener scroll agar tooltip ikut bergerak saat di-scroll
  // atau tutup saja tooltip saat scroll untuk performa lebih baik
  const handleMouseEnter = () => {
    updatePosition();
    setVisible(true);
    window.addEventListener("scroll", updatePosition, true);
  };

  const handleMouseLeave = () => {
    setVisible(false);
    window.removeEventListener("scroll", updatePosition, true);
  };

  return (
    <div
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible &&
        createPortal(
          <div
            className={`tooltip fixed z-[9999] px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-xl pointer-events-none whitespace-nowrap transition-opacity duration-200 ${className} ${
                position === 'top' ? '-translate-x-1/2 -translate-y-full' : 
                position === 'bottom' ? '-translate-x-1/2' :
                position === 'left' ? '-translate-x-full -translate-y-1/2' : 
                '-translate-y-1/2'
            }`}
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >
            {content}
            {/* Arrow logic */}
            <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' : 
                position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' :
                position === 'left' ? '-right-1 top-1/2 -translate-y-1/2' :
                '-left-1 top-1/2 -translate-y-1/2'
            }`} />
          </div>,
          document.body
        )}
    </div>
  );
};
export default Tooltip;