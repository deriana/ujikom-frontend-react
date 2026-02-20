import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color: string;
}

export const StatCard = ({ title, value, subtitle, icon: Icon, color }: StatCardProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <h3 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
        <Icon />
      </div>
    </div>
    <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
  </div>
);