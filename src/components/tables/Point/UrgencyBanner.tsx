import { Flame, Zap, ChevronRight } from "lucide-react";
import { PointBalanceSummary } from "@/types";

interface UrgencyBannerProps {
  wallet?: PointBalanceSummary;
}

export default function UrgencyBanner({ wallet }: UrgencyBannerProps) {
  return (
    <section className="bg-linear-to-r from-orange-500 to-rose-500 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl shadow-orange-500/20">
      <div className="absolute -right-2.5 -bottom-2.5 opacity-20">
        <Flame size={80} />
      </div>
      <div className="relative z-10 flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
          <Zap size={24} fill="white" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-black uppercase tracking-wider">
            Points Expiring!
          </h4>
          <p className="text-[10px] font-medium opacity-90 leading-tight mt-0.5">
            {wallet?.current_balance
              ? `${wallet.current_balance.toLocaleString()} pts`
              : "Your points"}{" "}
            will expire on Dec 31, {new Date().getFullYear()}. Use them before they're gone!
          </p>
        </div>
        <ChevronRight size={20} className="opacity-50" />
      </div>
    </section>
  );
}