import { Search, Sparkles, ShoppingBag } from "lucide-react";

interface HeaderMarketplaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function HeaderMarketplace({
  searchQuery,
  setSearchQuery,
}: HeaderMarketplaceProps) {
  return (
    <div className="relative overflow-hidden bg-indigo-600 dark:bg-indigo-950 px-8 py-12 rounded-b-[3.5rem] shadow-2xl mb-10">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-100 text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} className="text-amber-300" />
            <span>Premium Rewards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
            Reward Store
            <ShoppingBag className="text-indigo-300/50 hidden md:block" size={40} />
          </h1>
          <p className="text-indigo-100/70 text-sm md:text-base font-medium max-w-md">
            Turn your achievements into reality. Exchange your hard-earned points for exclusive perks and goods.
          </p>
        </div>

        <div className="w-full md:w-96">
          <div className="relative group">
            <div className="absolute -inset-1 bg-white/20 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-indigo-200 group-focus-within:text-white transition-colors" size={20} />
              <input
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-indigo-200/60 outline-none focus:ring-2 focus:ring-white/40 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}