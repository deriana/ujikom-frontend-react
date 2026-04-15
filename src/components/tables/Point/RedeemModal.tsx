import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { ShoppingBag, Minus, Plus, Star, AlertCircle } from "lucide-react";
import { PointItem } from "@/types";

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PointItem | undefined;
  quantity: number;
  setQuantity: (q: number) => void;
  onConfirm: () => void;
  isRedeeming: boolean;
}

export default function RedeemModal({
  isOpen,
  onClose,
  item,
  quantity,
  setQuantity,
  onConfirm,
  isRedeeming,
}: RedeemModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isRedeeming && onClose()}
      className="max-w-md m-4"
    >
      <div className="p-8 bg-white dark:bg-[#0B0F1A] rounded-[2.5rem] border border-gray-100 dark:border-white/5">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-16 w-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <ShoppingBag size={32} />
          </div>

          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Confirm Redemption</h3>
            <p className="text-sm text-gray-500 mt-1">
              How many <span className="font-bold text-indigo-500">{item?.name}</span> would you like to redeem?
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 py-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-12 w-12 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-900 dark:text-white"
            >
              <Minus size={20} />
            </button>
            <span className="text-3xl font-black text-gray-900 dark:text-white w-12">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(item?.stock || 1, quantity + 1))}
              className="h-12 w-12 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-gray-900 dark:text-white"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Summary Card */}
          <div className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
              <span>Total Cost</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={12} fill="currentColor" />
                <span>{((item?.required_points || 0) * quantity).toLocaleString()} Pts</span>
              </div>
            </div>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
              <span>Stock Available</span>
              <span className="text-gray-900 dark:text-white">{item?.stock} Units</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 text-left">
            <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium text-amber-700 dark:text-amber-400 leading-relaxed">
              Points will be deducted immediately. This action cannot be undone.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full pt-4">
            <button
              disabled={isRedeeming}
              onClick={onClose}
              className="py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
            >
              Cancel
            </button>
            <Button
              disabled={isRedeeming}
              onClick={onConfirm}
              className="py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}