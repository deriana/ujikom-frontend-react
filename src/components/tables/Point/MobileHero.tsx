import { Trophy, HelpCircle, ShoppingBag, Gift, TrendingUp, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PointBalanceSummary } from "@/types";

interface MobileHeroProps {
  wallet?: PointBalanceSummary;
  isLoading: boolean;
  rank: {
    name: string;
    level: number;
    next: number;
  };
  progress: number;
  balance: number;
  setShowBenefits: (show: boolean) => void;
}

export default function MobileHero({ wallet, isLoading, rank, progress, balance, setShowBenefits }: MobileHeroProps) {
  const navigate = useNavigate();
  return (
    <section className="relative group p-0.5 rounded-[3rem] bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/20">
          <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2.9rem] p-7 text-slate-900 dark:text-white transition-colors duration-300">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[50px] -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 dark:bg-purple-500/20 blur-2xl -ml-10 -mb-10" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/20 pl-1 pr-3 py-1 rounded-full">
                  <div className="w-6 h-6 bg-linear-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy
                      size={12}
                      className="text-white"
                      fill="currentColor"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-100">
                    {rank.name}
                  </span>
                </div>
                <button 
                  onClick={() => setShowBenefits(true)}
                  className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 active:scale-90 transition-transform"
                >
                  <HelpCircle size={18} className="text-slate-400 dark:opacity-60" />
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-slate-400 dark:text-indigo-200/60 text-[10px] font-black uppercase tracking-[0.2em]">
                    {wallet?.period_name || "Available Balance"}
                  </p>
                  <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                    {isLoading ? "---" : balance.toLocaleString()}
                  </h2>
                  <span className="text-xl font-bold text-slate-300 dark:text-indigo-300/50 italic">
                    Pts
                  </span>
                </div>
              </div>

              {/* Stats Mini Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                    <TrendingUp size={12} />
                    <span className="text-[8px] font-black uppercase tracking-wider">Earned</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{(wallet?.total_earned || 0).toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                    <Zap size={12} />
                    <span className="text-[8px] font-black uppercase tracking-wider">Used</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{(wallet?.total_used || 0).toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8 space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-indigo-200/50">
                  <span>Level {rank.level}</span>
                  <span>
                    {rank.next - (wallet?.total_earned || 0)} pts to next rank
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/reward-catalog")}
                  className="bg-slate-900 dark:bg-white text-white dark:text-indigo-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-indigo-500/10"
                >
                  <ShoppingBag size={18} /> Redeem
                </button>
                <button
                  onClick={() => setShowBenefits(true)}
                  className="bg-slate-100 dark:bg-indigo-500/20 backdrop-blur-md text-slate-600 dark:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all border border-slate-200 dark:border-white/10"
                >
                  <Gift size={18} /> Benefits
                </button>
              </div>
            </div>
          </div>
        </section>
  );
}