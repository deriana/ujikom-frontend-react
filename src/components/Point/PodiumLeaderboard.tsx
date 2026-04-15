import { Crown } from "lucide-react";
import UserProfile from "@/components/UserProfile";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PodiumLeaderboardProps {
  list: any[];
}

export default function PodiumLeaderboard({ list }: PodiumLeaderboardProps) {
  const isMobile = useIsMobile();
  
  const podiumOrder = [
    list.find(u => u.rank === 2),
    list.find(u => u.rank === 1),
    list.find(u => u.rank === 3),
  ];

  return (
    <div className={`flex ${isMobile ? 'overflow-x-auto pb-4 snap-x gap-3 no-scrollbar' : 'items-end justify-center gap-8 pt-10'} dark:text-white`}>
      {podiumOrder.map((hero, idx) => {
        if (!hero) return <div key={idx} className={isMobile ? 'w-35 shrink-0' : 'w-44'} />;
        const isRank1 = hero.rank === 1;
        return (
          <div 
            key={hero.nik} 
            className={`flex flex-col items-center shrink-0 transition-all ${isMobile ? 'w-35 snap-center' : 'w-44'}`}
          >
            <div className="relative mb-2">
              {isRank1 && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 w-6 h-6 animate-bounce" />}
              <UserProfile
                src={hero.photo_url}
                alt={hero.employee_name}
                size={isRank1 ? 64 : 48}
                className={`mx-auto rounded-2xl shadow-xl border-white ${isRank1 ? 'border-4' : 'border-2'}`}
              />
            </div>
            <div className={`
              w-full rounded-2xl flex flex-col items-center justify-center py-4 px-2 text-center shadow-lg
              ${isRank1 ? 'bg-indigo-600 text-white h-32' : 'bg-white dark:bg-gray-800 h-28 border border-gray-100 dark:border-white/5'}
            `}>
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Rank {hero.rank}</p>
              <p className="font-bold text-xs truncate w-full mb-1">{hero.employee_name}</p>
              <p className="font-black text-lg leading-none">{hero.total_points}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}