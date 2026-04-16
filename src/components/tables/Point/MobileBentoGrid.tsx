import { useNavigate } from "react-router-dom";
import { Trophy, History, Package, ArrowUpRight } from "lucide-react";
import { PointBalanceSummary } from "@/types";

interface MobileBentoGridProps {
  wallet?: PointBalanceSummary;
}

export default function MobileBentoGrid({ wallet }: MobileBentoGridProps) {
  const navigate = useNavigate();

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
          Wallet Dashboard
        </h3>
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800 ml-4"></span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Leaderboard - Large Box */}
        <div
          onClick={() => navigate("/point-leaderboard")}
          className="col-span-2 bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group active:scale-[0.98] transition-all overflow-hidden relative shadow-sm"
        >
          <div className="absolute right-0 top-0 mt-2 mr-2 opacity-5">
            <Trophy size={100} />
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-500 rounded-[1.2rem] flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Trophy size={28} />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                Leaderboard
              </h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                Rank #12 • Top 5%
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all">
            <ArrowUpRight size={20} />
          </div>
        </div>

        {/* Mutation - Small Box */}
        <div
          onClick={() => navigate("/point-mutations")}
          className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-4 active:scale-[0.96] transition-all shadow-sm"
        >
          <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white">
            <History size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Mutations
            </h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase">
              History Log
            </p>
          </div>
        </div>

        {/* Inventory - Small Box */}
        <div
          onClick={() => navigate("/my-inventory")}
          className="bg-white dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 space-y-4 active:scale-[0.96] transition-all shadow-sm"
        >
          <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center text-white">
            <Package size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              Inventory
            </h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase">
              {wallet?.total_used ? "8 Items" : "0 Items"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}