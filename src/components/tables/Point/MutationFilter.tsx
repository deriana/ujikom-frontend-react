import { Search } from "lucide-react";

interface MutationFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: "ALL" | "incoming" | "outgoing";
  setFilter: (filter: "ALL" | "incoming" | "outgoing") => void;
}

export default function MutationFilter({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
}: MutationFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:text-white dark:bg-[#0B0F1A] border border-gray-200 dark:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
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
  );
}