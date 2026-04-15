import { Trophy, Calendar, Clock } from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { useIsMobile } from "@/hooks/useIsMobile";

interface HeaderLeaderboardProps {
  period?: string;
}

export default function HeaderLeaderboard({ period }: HeaderLeaderboardProps) {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-col gap-4' : 'flex-row justify-between items-end'}`}>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Trophy className="text-indigo-600 w-6 h-6" />
          <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-black tracking-tight text-gray-900 dark:text-white uppercase`}>
            Leaderboard
          </h1>
        </div>
        <Badge color="primary">
          <Calendar size={12} className="mr-1 inline" /> {period || "Current Period"}
        </Badge>
      </div>

      <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-white/5 ${isMobile ? 'w-full' : ''}`}>
        <div className="p-2 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-500 animate-pulse">
          <Clock size={16} />
        </div>
        <div className="leading-none">
          <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Ends in</p>
          <p className="text-sm font-black text-gray-800 dark:text-white">
            {/* This could be made dynamic later if needed */}
            17D : 04H : 12M
          </p>
        </div>
      </div>
    </div>
  );
}