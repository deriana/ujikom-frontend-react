import { 
  ArrowUpRight, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import UserProfile from "@/components/UserProfile";
import { DataTable } from "../BasicTables/DataTable";
import { Column, PointLeaderboard } from "@/types";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useLeaderboard } from "@/hooks/usePoint";
import { useAuth } from "@/hooks/useAuth";
import MyPositionCard from "@/components/Point/MyPositionCard";
import PodiumLeaderboard from "@/components/Point/PodiumLeaderboard";
import HeaderLeaderboard from "@/components/Point/HeaderLeaderboard";

export default function PointLeaderboardTable() {
  const isMobile = useIsMobile();
  const { user: currentUser } = useAuth();
  const { data: leaderboardData, isLoading, isError, error } = useLeaderboard(); 

  const list = leaderboardData?.list || [];
  const meta = leaderboardData?.meta;

  // --- DESKTOP COLUMNS CONFIG ---
  const columns: Column<PointLeaderboard>[] = [
    {
      header: "Rank",
      render: (row) => (
        <span className={`font-black text-sm ${(row.rank ?? 0) <= 3 ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`}>
          #{String(row.rank).padStart(3, '0')}
        </span>
      ),
    },
    {
      header: "Employee",
      render: (row) => (
        <div className="flex items-center gap-3">
          <UserProfile
            src={row.photo_url ?? undefined}
            alt={row.name}
            size={32}
            className="rounded-lg"
          />
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 dark:text-gray-200 leading-none">{row.name}</span>
            <span className="text-[10px] text-gray-500 mt-1">{row.position}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Points",
      render: (row) => (
        <div className="flex items-center gap-3">
          <span className="font-black text-gray-900 dark:text-white">{row.total_points.toLocaleString()}</span>
          <ArrowUpRight size={14} className="text-green-500" />
        </div>
      ),
    },
  ];

    if (isError) return <div className="p-4 text-red-500">Error: {(error as Error).message}</div>;


  return (
    <div className={`max-w-6xl mx-auto space-y-6 ${isMobile ? 'p-3' : 'p-6'}`}>
      
    <HeaderLeaderboard  period={meta?.period} />

      {/* --- PODIUM / HERO CARDS --- */}
      <PodiumLeaderboard list={list} />

      {/* --- MY POSITION CARD (MOBILE OPTIMIZED) --- */}
        <MyPositionCard rank={meta?.my_rank || '-'} userName={currentUser?.name || "You"} points={meta?.my_points || 0} />

      {/* --- MAIN STANDINGS SECTION --- */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/5 shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/2">
          <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">Global Standings</h2>
          {isMobile && <Sparkles size={14} className="text-yellow-500" />}
        </div>

        {isMobile ? (
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {list.map((row: PointLeaderboard) => (
              <div 
                key={row.nik} 
                className="flex items-center justify-between p-4 active:bg-gray-50 dark:active:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black w-6 ${(row.rank ?? 999) <= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                    #{row.rank ?? "???"}
                  </span>
                  <UserProfile
                    src={row.photo_url ?? undefined}
                    alt={row.name}
                    size={36}
                    className="rounded-xl"
                  />
                  <div>
                    <p className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-none">{row.name || "Unknown Employee"}</p>
                    <div className="flex items-center gap-1 mt-1">
                       <p className="text-[9px] text-gray-400 uppercase font-medium">{row.position || "No Position"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-black text-gray-900 dark:text-white text-sm leading-none mb-1">
                      {row.total_points.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end text-[8px] font-bold text-green-500">
                      <ArrowUpRight size={10} />
                      UP
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            data={list}
            columns={columns}
            loading={isLoading}
            searchableKeys={["name", "position"]}
          />
        )}
      </div>

    </div>
  );
}