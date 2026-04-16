import { Box, Zap, Calendar, ChevronRight } from "lucide-react";
import { formatDateID } from "@/utils/date";
import { PointInventory } from "@/types";

interface GridLayoutInventoryProps {
  isLoading: boolean;
  filteredItems: PointInventory[];
  onShowDetail: (itemUuid: string) => void;
  onUseItem: (uuid: string) => void;
  isUsing: boolean;
}

export default function GridLayoutInventory({
  isLoading,
  filteredItems,
  onShowDetail,
  onUseItem,
  isUsing,
}: GridLayoutInventoryProps) {
  return (
    <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-3xl" />
            ))
          ) : filteredItems.map((item) => (
            <div 
              key={item.uuid}
              onClick={() => onShowDetail(item.item_uuid)}
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
                  {!item.power_up_type && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); !item.is_used && onUseItem(item.uuid); }}
                      disabled={isUsing || item.is_used}
                      className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 
                        ${item.is_used ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}
                    >
                      {item.is_used ? 'Already Used' : 'Use Item'}
                    </button>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onShowDetail(item.item_uuid); }}
                    className={`${item.power_up_type ? 'px-4' : 'flex-1'} py-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2`}
                  >
                    {item.power_up_type && "View Details"}
                    <ChevronRight size={item.power_up_type ? 16 : 14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
  );
}