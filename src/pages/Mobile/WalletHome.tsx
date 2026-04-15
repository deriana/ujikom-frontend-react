import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  History,
  ShoppingBag,
  Package,
  ChevronRight,
  Zap,
  HelpCircle,
  Gift,
  ArrowUpRight,
  Flame,
  Star,
} from "lucide-react";
import PageHeader from "@/components/Mobile/PageHeader";
import { usePointWallet } from "@/hooks/usePointItem";
import { PointBalanceSummary } from "@/types";
import { Modal } from "@/components/ui/modal";

export default function WalletHome() {
  const navigate = useNavigate();
  const [showBenefits, setShowBenefits] = useState(false);
  const { data: wallet, isLoading } = usePointWallet() as {
    data: PointBalanceSummary | undefined;
    isLoading: boolean;
  };

  const getRankInfo = (points: number) => {
    if (points >= 10000)
      return { name: "Discipline Legend", level: 50, min: 10000, next: 20000 };
    if (points >= 5000)
      return { name: "Discipline Elite", level: 25, min: 5000, next: 10000 };
    if (points >= 2500)
      return { name: "Discipline Master", level: 15, min: 2500, next: 5000 };
    if (points >= 1000)
      return { name: "Discipline Pro", level: 10, min: 1000, next: 2500 };
    return { name: "Discipline Starter", level: 1, min: 0, next: 1000 };
  };

  const rank = getRankInfo(wallet?.total_earned || 0);
  const progress = Math.min(
    100,
    Math.max(
      0,
      (((wallet?.total_earned || 0) - rank.min) / (rank.next - rank.min)) * 100,
    ),
  );

  const balance = wallet?.current_balance || 0;

  const benefits = [
    {
      title: "Exclusive Rewards",
      desc: "Redeem points for shopping vouchers, gadgets, and more.",
      icon: <Gift className="text-pink-500" />,
    },
    {
      title: "Career Growth",
      desc: "High points reflect your discipline and performance records.",
      icon: <Trophy className="text-amber-500" />,
    },
    {
      title: "Power Ups",
      desc: "Get special items to boost your attendance flexibility.",
      icon: <Zap className="text-indigo-500" />,
    },
    {
      title: "Recognition",
      desc: "Top performers get featured on the company leaderboard.",
      icon: <Star className="text-blue-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-in fade-in duration-500">
      <PageHeader title="Integrity Wallet" subtitle="Loyalty & Performance" />

      <main className="px-5 space-y-8 mt-4">
        {/* HERO SECTION: THE WALLET CARD */}
        <section className="relative group p-0.5 rounded-[3rem] bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-indigo-500/20">
          <div className="relative overflow-hidden bg-slate-900 rounded-[2.9rem] p-7 text-white">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[50px] -mr-10 -mt-10" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 blur-2xl -ml-10 -mb-10" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 pl-1 pr-3 py-1 rounded-full">
                  <div className="w-6 h-6 bg-linear-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy
                      size={12}
                      className="text-white"
                      fill="currentColor"
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">
                    {rank.name}
                  </span>
                </div>
                <button className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 active:scale-90 transition-transform">
                  <HelpCircle size={18} className="opacity-60" />
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-indigo-200/60 text-[10px] font-black uppercase tracking-[0.2em]">
                    Available Balance
                  </p>
                  <div className="h-1 w-1 rounded-full bg-green-400 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black tracking-tighter">
                    {isLoading ? "---" : balance.toLocaleString()}
                  </h2>
                  <span className="text-xl font-bold text-indigo-300/50 italic">
                    Pts
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8 space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-indigo-200/50">
                  <span>Level {rank.level}</span>
                  <span>
                    {rank.next - (wallet?.total_earned || 0)} pts to next rank
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/reward-catalog")}
                  className="bg-white text-indigo-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                  <ShoppingBag size={18} /> Redeem
                </button>
                <button
                  onClick={() => setShowBenefits(true)}
                  className="bg-indigo-500/20 backdrop-blur-md text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all border border-white/10"
                >
                  <Gift size={18} /> Benefits
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID: SERVICES */}
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

        {/* GAMIFICATION BANNER: URGENCY */}
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
                {wallet?.total_earned ? "450 pts" : "Some pts"} will expire on
                Dec 31. Use them before they're gone!
              </p>
            </div>
            <ChevronRight size={20} className="opacity-50" />
          </div>
        </section>
      </main>

      <Modal
        isOpen={showBenefits}
        onClose={() => setShowBenefits(false)}
        className="max-w-sm m-4"
      >
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
              <Gift size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                Wallet Benefits
              </h3>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                Maximize your points
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                  {benefit.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowBenefits(false)}
            className="w-full mt-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
          >
            Got It
          </button>
        </div>
      </Modal>
    </div>
  );
}
