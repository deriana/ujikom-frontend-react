import { useSettingsContext } from "@/context/SettingsContext";
import React from "react";

interface SiteBrandProps {
  showLogo?: boolean;
  showName?: boolean;
  isCollapsed?: boolean; 
  className?: string;
  logoClassName?: string;
  nameClassName?: string;
}

export const SiteBrand = ({
  showLogo = true,
  showName = true,
  isCollapsed = false,
  className = "",
  logoClassName = "",
  nameClassName = "",
}: SiteBrandProps) => {
  const { general, isLoading } = useSettingsContext();
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const logoUrl = general?.logo;
  const siteName = general?.site_name || "HRIS Management";

  if (isLoading) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`} />
        {!isCollapsed && showName && (
          <div className="animate-pulse h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLogo && logoUrl && (
        <div className="relative">
          {!imageLoaded && (
             <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${isCollapsed ? 'w-8 h-8' : 'h-10 w-10'}`} />
          )}
          <img
            src={logoUrl}
            alt={siteName}
            onLoad={() => setImageLoaded(true)} 
            className={`object-contain ${logoClassName} ${
              !imageLoaded ? 'hidden' : 'block' 
            } ${isCollapsed ? 'w-8 h-8' : 'h-10 w-auto'}`}
            onError={(e) => { 
              (e.target as HTMLImageElement).src = "/placeholder_img.jpg";
              setImageLoaded(true); 
            }}
          />
        </div>
      )}

      {showName && !isCollapsed && (
        <span className={`text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 whitespace-nowrap ${nameClassName}`}>
          {siteName}
        </span>
      )}
    </div>
  );
};