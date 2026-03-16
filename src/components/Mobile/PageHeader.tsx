import { Home, LucideIcon } from "lucide-react";
import CircleButton from "./CircleButton";

interface PageHeaderProps {
  title: string;
  subtitle?: string | React.ReactNode;
  icon?: LucideIcon;
  to?: string;
  align?: "center" | "left";
  hideItem?: boolean;
}

export default function PageHeader({ 
  title, 
  subtitle, 
  icon, 
  to,
  hideItem = false, 
  align = "center"
}: PageHeaderProps) {
  
  if (hideItem) return null;

  return (
    <header className="p-6 bg-transparent dark:bg-transparent">
      <div className="flex items-center justify-between">
        <CircleButton icon={icon || Home} to={to} />

        <div className={`flex-1 ${align === "center" ? "text-center" : "text-left ml-4"}`}>
          <h1 className="text-lg font-black dark:text-white uppercase tracking-tighter leading-none">
            {title}
          </h1>
          {subtitle && (
            <div className="mt-1">
              {typeof subtitle === "string" ? (
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {subtitle}
                </p>
              ) : (
                subtitle
              )}
            </div>
          )}
        </div>

        {align === "center" && <div className="w-10" />} 
      </div>
    </header>
  );
}