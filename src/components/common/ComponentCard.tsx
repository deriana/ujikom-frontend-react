import { useIsMobile } from "@/hooks/useIsMobile";

interface ComponentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  desc?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className = "",
  desc = "",
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 shadow-sm transition-all
        ${isMobile 
          ? "rounded-[2.5rem] p-2 border dark:border-neutral-800" // Serasi dengan ActivityCalendar
          : "rounded-2xl border border-gray-200 dark:border-gray-800" // Style Desktop
        } 
        ${className}
      `}
    >
      {/* Header: Hanya tampil jika ada title */}
      {title && (
        <div className={`${isMobile ? "px-6 py-4" : "px-6 py-5"}`}>
          <h3 className="text-base font-bold text-gray-800 dark:text-white/90 uppercase tracking-tight">
            {title}
          </h3>
          {desc && (
            <p className="mt-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {desc}
            </p>
          )}
        </div>
      )}

      {/* Body */}
      <div className={`
        ${isMobile ? "p-2" : "p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6"}
      `}>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;