import { useState } from "react";
import { Star, ChevronRight, Info, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PointBalanceSummary } from "@/types";
import { Modal } from "@/components/ui/modal";
import { calculateRankProgress, getRankInfo } from "@/constants/Rank";

interface WalletInfoDetailProps {
  wallet?: PointBalanceSummary;
  isLoading?: boolean;
}

export default function WalletInfoDetail({ wallet, isLoading }: WalletInfoDetailProps) {
  const isMobile = useIsMobile();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (isMobile || isLoading) return null;

  const rank = getRankInfo(wallet?.total_earned || 0);
  const progress = calculateRankProgress(wallet?.total_earned || 0);

  return (
    <>
      <div 
        onClick={() => setIsDetailOpen(true)}
        className="fixed bottom-8 right-8 z-40 group cursor-pointer transition-all hover:scale-105 active:scale-95"
      >
        <div className="bg-white dark:bg-[#0B0F1A] border border-gray-100 dark:border-white/10 p-4 rounded-[2.5rem] shadow-2xl flex items-center gap-4 backdrop-blur-xl">
          <div className="h-12 w-12 bg-linear-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Star size={24} fill="currentColor" />
          </div>
          <div className="pr-2">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Balance</span>
              <div className="h-1 w-1 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-bold text-indigo-500">LVL. {rank.level}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-black text-gray-900 dark:text-white leading-none tracking-tight">
                {wallet?.current_balance.toLocaleString() ?? 0}
              </p>
              <span className="text-xs font-bold text-gray-400">Pts</span>
            </div>
          </div>
          <div className="pl-2 border-l border-gray-100 dark:border-white/5">
            <ChevronRight size={20} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
          </div>
        </div>
      </div>

      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} className="max-w-sm m-4">
        <div className="p-8">
          {/* Level Progress Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <ShieldCheck size={12} /> {rank.name}
            </div>
            <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              {(wallet?.current_balance || 0).toLocaleString()}
              <span className="text-sm text-gray-400 ml-2 uppercase">Pts</span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">Available for redemption</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
              <span className="text-gray-400">Next Rank Progress</span>
              <span className="text-indigo-500">{wallet?.total_earned?.toLocaleString()} / {rank.next.toLocaleString()} Pts</span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-linear-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-green-500 mb-1">
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase">Earned</span>
              </div>
              <p className="text-lg font-black text-gray-900 dark:text-white">{(wallet?.total_earned || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
              <div className="flex items-center gap-2 text-amber-500 mb-1">
                <Zap size={14} />
                <span className="text-[10px] font-black uppercase">Used</span>
              </div>
              <p className="text-lg font-black text-gray-900 dark:text-white">{(wallet?.total_used || 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Period Info */}
          <div className="flex items-start gap-4 p-4 rounded-3xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 mb-8">
            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-indigo-500 shrink-0 shadow-sm">
              <Info size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Active Period</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{wallet?.period_name || 'Q1 2024 Performance'}</p>
              <p className="text-[10px] text-gray-500 mt-1">Points will expire on Dec 31, {new Date().getFullYear()}</p>
            </div>
          </div>

          <button
            onClick={() => setIsDetailOpen(false)}
            className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all active:scale-95"
          >
            Close Detail
          </button>
        </div>
      </Modal>
    </>
  );
}