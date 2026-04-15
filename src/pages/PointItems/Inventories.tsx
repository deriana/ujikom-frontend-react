import { useState, useMemo } from "react";
import PageMeta from "@/components/common/PageMeta";
import { usePointInventories, useUsePointItem } from "@/hooks/usePointItem";
import { Star, Package, Search, Trophy, Calendar, Zap, ChevronRight, Box } from "lucide-react";
import PointItemShowModal from "./ShowModal";
import { useIsMobile } from "@/hooks/useIsMobile";
import EmptyState from "@/components/tables/Point/EmptyState";
import { formatDateID } from "@/utils/date";
import { useShowModal } from "@/hooks/useCrudForm";
import { handleMutation } from "@/utils/handleMutation";

export default function PointInventories() {
  const { data: items = [], isLoading } = usePointInventories();
  const { mutateAsync: useItem, isPending: isUsing } = useUsePointItem();
  const isMobile = useIsMobile();
  
  const [searchQuery, setSearchQuery] = useState("");
  const show = useShowModal<string>();

  const filteredItems = useMemo(() => 
    items.filter(item => 
      item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [items, searchQuery]);

  const handleUseItem = (uuid: string) => {
    handleMutation(() => useItem(uuid), {
      loading: "Activating item...",
      success: "Item used successfully!",
      error: "Failed to use item",
    });
  };

  return (
    <>
      <PageMeta title="My Inventories" />
      
      <div className={`min-h-screen ${isMobile ? 'pb-24' : 'p-8'}`}>
        {/* Gamified Inventory Header */}
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
                You have <span className="text-indigo-600 dark:text-indigo-400 font-bold">{items.length} items</span> ready to use.
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
                  LVL 12
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-3xl" />
            ))
          ) : filteredItems.map((item) => (
            <div 
              key={item.uuid}
              onClick={() => show.open(item.item_uuid)}
              className="group relative bg-white dark:bg-[#0B0F1A] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.98]"
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 dark:bg-indigo-500/5 flex items-center justify-center">
                    <Box size={48} className="text-indigo-200 dark:text-indigo-900/40" />
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {item.power_up_type && (
                    <div className="bg-amber-500 text-white p-1.5 rounded-xl shadow-lg animate-pulse">
                      <Zap size={14} fill="currentColor" />
                    </div>
                  )}
                  {item.is_used && (
                    <span className="bg-gray-500 text-white text-[8px] font-black px-2 py-1 rounded-lg tracking-tighter">
                      USED
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar size={12} />
                    <span className="text-[10px] font-bold">{formatDateID(item.obtained_at)}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-2 line-clamp-1">
                  {item.item_name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 min-h-8">
                  {item.description || "No description available for this item."}
                </p>
                
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUseItem(item.uuid); }}
                    disabled={isUsing || item.is_used}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 
                      ${item.is_used ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}
                  >
                    {item.is_used ? 'Already Used' : 'Use Item'}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); show.open(item.item_uuid); }}
                    className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
            <EmptyState />
        )}

        {/* Floating Action for Mobile (Points Balance) */}
        {isMobile && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
              <div className="bg-amber-400 p-1 rounded-full">
                <Star size={14} className="text-gray-900 fill-gray-900" />
              </div>
              <span className="text-sm font-black tracking-tight">Your Balance: 2,450 Pts</span>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        <PointItemShowModal 
          uuid={show.showId}
          isOpen={show.isOpen}
          onClose={show.close}
        />
      </div>
    </>
  );
}
