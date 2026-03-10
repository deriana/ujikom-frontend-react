import { Home } from "lucide-react";
import PageHeader from "./PageHeader";

export default function PersonalStatsHeader() {
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <PageHeader
      icon={Home}
      to="/home"
      title="Personal Stats"
      subtitle={
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            {currentMonth} Overview
          </p>
        </div>
      }
    />
  );
}
