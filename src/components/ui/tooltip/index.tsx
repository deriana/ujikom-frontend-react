import React, { ReactNode, useState } from "react";

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

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={` absolute z-50 px-2 py-1 text-sm text-white bg-black rounded shadow-md whitespace-nowrap transition-opacity duration-200 ${
            className
          } ${getPositionClasses(position)}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

function getPositionClasses(position: string) {
  switch (position) {
    case "top":
      return "bottom-full left-1/2 transform -translate-x-1/2 mb-2";
    case "bottom":
      return "top-full left-1/2 transform -translate-x-1/2 mt-2";
    case "left":
      return "right-full top-1/2 transform -translate-y-1/2 mr-2";
    case "right":
      return "left-full top-1/2 transform -translate-y-1/2 ml-2";
    default:
      return "";
  }
}

export default Tooltip;
