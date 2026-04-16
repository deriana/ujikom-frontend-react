import { Package, Search, Trophy } from "lucide-react";

interface InventoryHeaderProps {
  itemCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  level?: number;
}

export default function InventoryHeader({
  itemCount,
  searchQuery,
  setSearchQuery,
  level = 1,
}: InventoryHeaderProps) {
  return (
    <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.3em]">
                <Package size={14} />
                <span>Personal Collection</span>
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                My Inventory
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{itemCount} items</span> ready to use.
              </p>
            </div>

            {/* Search Bar Modern */}
            <div className="relative group max-w-md w-full">
              <div className="absolute inset-0 bg-indigo-500/20 blur-xl group-focus-within:opacity-100 opacity-0 transition-opacity rounded-2xl" />
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Search your collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#0B0F1A] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                />
                <div className="absolute right-4 flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-[10px] font-bold text-gray-400">
                  <Trophy size={10} />
                  LVL {level}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}