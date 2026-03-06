import { useSettingsContext } from "@/context/SettingsContext";

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

  const logoUrl = general?.logo || "/placeholder_img.jpg";
  const siteName = general?.site_name || "HRIS Management";

  if (isLoading) {
    return <div className="animate-pulse h-8 w-32 bg-gray-200 rounded" />;
  }

  if (isCollapsed) {
    return (
      <img
        src={logoUrl}
        alt={siteName}
        width={32}
        height={32}
        className={`object-contain ${logoClassName}`}
        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder_img.jpg"; }}
      />
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLogo && (
        <img
          src={logoUrl}
          alt={siteName}
          width={150}
          height={40}
          className={`h-10 w-auto object-contain ${logoClassName}`}
          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder_img.jpg"; }}
        />
      )}

      {showName && !isCollapsed && (
        <span className={`text-2xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap ${nameClassName}`}>
          {siteName}
        </span>
      )}
    </div>
  );
};