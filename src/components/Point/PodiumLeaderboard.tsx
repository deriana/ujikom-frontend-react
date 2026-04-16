import { Crown } from "lucide-react";
import UserProfile from "@/components/UserProfile";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PodiumLeaderboardProps {
  list?: any[];
  isLoading?: boolean;
}

export default function PodiumLeaderboard({ list = [], isLoading }: PodiumLeaderboardProps) {
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return (
      <div className={`flex ${isMobile ? 'overflow-x-auto pb-4 gap-3 no-scrollbar' : 'items-end justify-center gap-8 pt-10'}`}>
        {[2, 1, 3].map((rank) => {
          const isRank1 = rank === 1;
          return (
            <div key={rank} className={`flex flex-col items-center shrink-0 ${isMobile ? 'w-40' : 'w-52'}`}>
              <div 
                className={`mb-2 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse shadow-md`}
                style={{ width: isRank1 ? 80 : 64, height: isRank1 ? 80 : 64 }}
              />
              <div className={`
                w-full rounded-3xl flex flex-col items-center justify-center py-4 px-2 animate-pulse
                ${isRank1 
                  ? 'bg-indigo-100 dark:bg-indigo-900/20 h-32' 
                  : 'bg-gray-100 dark:bg-gray-800/50 h-28 border border-gray-100 dark:border-white/5'}
              `}>
                <div className="h-2 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const podiumOrder = [
    list.find(u => u.rank === 2),
    list.find(u => u.rank === 1),
    list.find(u => u.rank === 3),
  ];

  return (
    <div className={`flex ${isMobile ? 'overflow-x-auto pb-4 snap-x gap-4 no-scrollbar' : 'items-end justify-center gap-10 pt-12'} dark:text-white`}>
      {podiumOrder.map((hero, idx) => {
        if (!hero) return <div key={idx} className={isMobile ? 'w-40 shrink-0' : 'w-52'} />;
        const isRank1 = hero.rank === 1;
        return (
          <div 
            key={hero.nik} 
            className={`flex flex-col items-center shrink-0 transition-all duration-300 hover:-translate-y-4 ${isMobile ? 'w-40 snap-center' : 'w-52'}`}
          >
            <div className="relative mb-2">
              {isRank1 && <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-500 w-6 h-6 animate-bounce" />}
              <UserProfile
                src={hero.photo_url}
                alt={hero.employee_name}
                size={isRank1 ? 80 : 64}
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