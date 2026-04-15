import { usePointItemByUuid } from "@/hooks/usePointItem";
import { Modal } from "@/components/ui/modal";
import {
  Package,
  Star,
  Box,
  Layers,
  Calendar,
  ShieldCheck,
  Zap,
  Ticket,
  Info,
} from "lucide-react";
import { formatDateID } from "@/utils/date";
import Badge from "@/components/ui/badge/Badge";

interface PointItemShowModalProps {
  uuid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const Skeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-48 w-full bg-gray-200 dark:bg-gray-800 rounded-3xl" />
    <div className="space-y-3">
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded" />
      <div className="h-4 w-1/2 bg-gray-100 dark:bg-gray-800/50 rounded" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl" />
      <div className="h-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl" />
    </div>
  </div>
);

export default function PointItemShowModal({
  uuid,
  isOpen,
  onClose,
}: PointItemShowModalProps) {
  const { data: item, isLoading, isError, error } = usePointItemByUuid(uuid || "");

  if (!uuid) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4 p-0 bg-transparent shadow-none border-none">
      <div className="relative w-full rounded-[3rem] bg-white dark:bg-[#0B0F1A] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800/50">
        {isLoading ? (
          <div className="p-8"><Skeleton /></div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">{(error as Error).message}</div>
        ) : item && (
          <>
            {/* Header Section dengan Efek Tiket */}
            <div className="relative h-60 w-full bg-gray-100 dark:bg-gray-800/30 overflow-hidden">
              {item.image_url ? (
                <div className="relative h-full w-full">
                   <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                   <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-500/10 to-purple-500/10">
                  <Ticket size={80} strokeWidth={1} className="text-indigo-200 dark:text-indigo-900/40 rotate-12" />
                </div>
              )}
              
              {/* Badges on Image */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <Badge variant="solid" color={item.is_active ? "success" : "error"}>
                  {item.is_active ? "Ready to Redeem" : "Out of Stock"}
                </Badge>
                {item.power_up_type && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                        <Zap size={12} fill="currentColor" /> Power Up
                    </div>
                )}
              </div>

              {item.system_reserve && (
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-2xl border border-white/30 shadow-xl">
                  <ShieldCheck size={20} />
                </div>
              )}
            </div>

            {/* Ticket Decoration (Lubang di samping) */}
            {/* <div className="relative">
                <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-gray-500/10 dark:bg-black/50 z-20" />
                <div className="absolute -right-4 -top-4 w-8 h-8 rounded-full bg-gray-500/10 dark:bg-black/50 z-20" />
                <div className="absolute left-6 right-6 -top-0.5 border-t-2 border-dashed border-gray-100 dark:border-gray-800 z-10" />
            </div> */}

            <div className="p-8 space-y-8 relative">
              {/* Floating Point Badge */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white dark:bg-indigo-600 px-6 py-3 rounded-3xl shadow-2xl border-4 border-gray-50 dark:border-[#0B0F1A] flex items-center gap-3">
                 <div className="bg-amber-100 dark:bg-amber-400/20 p-1.5 rounded-full">
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 dark:text-indigo-200 uppercase leading-none mb-0.5">Price</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white leading-none">
                        {item.required_points.toLocaleString()} <span className="text-xs font-bold text-gray-400">Pts</span>
                    </span>
                 </div>
              </div>

              {/* Title & Category */}
              <div className="pt-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                  <Layers size={12} /> {item.category}
                </div>
                <h4 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
                  {item.name}
                </h4>
                {item.power_up_type && (
                   <p className="mt-2 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center gap-1">
                      <Zap size={14} fill="currentColor" /> Special Effect: {item.power_up_type.replace('_', ' ')}
                   </p>
                )}
              </div>

              {/* Info Card Group */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-4xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Box size={60} />
                  </div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-gray-400">
                            <Box size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Availability</p>
                            <p className={`text-lg font-black ${item.stock <= 5 ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                                {item.stock} Units Left
                            </p>
                        </div>
                    </div>
                    {item.stock <= 5 && (
                        <span className="text-[9px] font-black text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-lg animate-bounce">
                            LIMITED
                        </span>
                    )}
                  </div>
                </div>

                <div className="p-6 rounded-4xl bg-indigo-50/30 dark:bg-indigo-500/5 border border-indigo-100/50 dark:border-indigo-500/10">
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center text-indigo-500 shrink-0">
                            <Info size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest">Terms & Benefits</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                                {item.description || "Digital voucher for internal point redemption. Valid for one-time use per transaction."}
                            </p>
                        </div>
                    </div>
                </div>
              </div>

              {/* Metadata Pills */}
              <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-y border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mb-1">Release</span>
                    <span className="text-[11px] text-gray-600 dark:text-gray-300 font-bold tracking-tight">
                      {formatDateID(item.created_at)}
                    </span>
                  </div>
                </div>
                <div className="w-px h-6 bg-gray-100 dark:bg-gray-800" />
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-gray-400" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-gray-400 uppercase leading-none mb-1">Status</span>
                    <span className="text-[11px] text-gray-600 dark:text-gray-300 font-bold tracking-tight">
                       Digital Goods
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full py-5 rounded-4xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black uppercase tracking-[0.2em] hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-white/10 transition-all active:scale-[0.97]"
              >
                Close Details
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}