import { useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { usePointMutations } from "@/hooks/usePointItem";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  History, 
  TrendingUp, 
  TrendingDown,
  Clock
} from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { formatDateID } from "@/utils/date";
import EmptyState from "@/components/tables/Point/EmptyState";
import { PointMutation } from "@/types";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function PointMutations() {
  const { data: mutations = [] as PointMutation[], isLoading } = usePointMutations();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "incoming" | "outgoing">("ALL");

  const filteredMutations = useMemo(() => {
    return mutations.filter((m) => {
      const matchesSearch = m.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "ALL" ? true : m.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [mutations, searchQuery, filter]);

  const totalEarned = mutations.filter(m => m.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
  const totalSpent = Math.abs(mutations.filter(m => m.amount < 0).reduce((acc, curr) => acc + curr.amount, 0));

  return (
    <>
      <PageMeta title="Point History" />
      <PageBreadcrumb pageTitle="Point Mutations" />

      <div className={`min-h-screen ${isMobile ? 'pb-24' : 'p-8'}`}>
        {/* Header Section */}
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

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-white dark:bg-[#0B0F1A] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>
          <div className="flex bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl gap-1">
            {(['ALL', 'incoming', 'outgoing'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t 
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t === 'incoming' ? 'EARN' : t === 'outgoing' ? 'SPEND' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Mutation List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800/50 animate-pulse rounded-3xl" />
            ))
          ) : filteredMutations.length > 0 ? (
            filteredMutations.map((mutation) => (
              <div 
                key={mutation.uuid}
                className="group bg-white dark:bg-[#0B0F1A] border border-gray-100 dark:border-white/5 p-6 rounded-4xl flex items-center justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                    mutation.amount >= 0 
                      ? 'bg-green-50 dark:bg-green-500/10 text-green-600' 
                      : 'bg-red-50 dark:bg-red-500/10 text-red-600'
                  }`}>
                    {mutation.amount >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        {mutation.type}
                      </span>
                      <div className="flex items-center gap-1 text-gray-400 text-[10px] font-bold">
                        <Clock size={12} />
                        {mutation.date_human} • {formatDateID(mutation.date)}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                      {mutation.description}
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-xl font-black ${mutation.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {mutation.amount >= 0 ? '+' : ''}{mutation.amount.toLocaleString()}
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Points</p>
                </div>
              </div>
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </>
  );
}
