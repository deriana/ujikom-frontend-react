import { Search } from "lucide-react";

interface HeaderMarketplaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function HeaderMarketplace({
  searchQuery,
  setSearchQuery,
}: HeaderMarketplaceProps) {
  return (
    <div className="relative overflow-hidden bg-indigo-600 dark:bg-indigo-900 px-6 py-10 rounded-b-[3rem] shadow-2xl mb-8">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white tracking-tight">Reward Store</h1>
            <p className="text-indigo-100 text-sm mt-1 font-medium opacity-80">Exchange your hard-earned points</p>

            <div className="mt-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
              <input 
                type="text"
                placeholder="Search rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-indigo-200 outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>
  );
}