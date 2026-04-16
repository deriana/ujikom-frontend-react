import { History, TrendingUp, TrendingDown } from "lucide-react";

interface MutationHeaderProps {
  totalEarned: number;
  totalSpent: number;
}

export default function MutationHeader({ totalEarned, totalSpent }: MutationHeaderProps) {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <History size={14} />
            <span>Transaction Logs</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Point History
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Review your point earnings and redemptions.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="bg-white dark:bg-[#0B0F1A] border border-gray-100 dark:border-white/5 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 rounded-2xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Earned</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">+{totalEarned.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-[#0B0F1A] border border-gray-100 dark:border-white/5 p-4 rounded-3xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 rounded-2xl">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Spent</p>
              <p className="text-lg font-black text-gray-900 dark:text-white">-{totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}