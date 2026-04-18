import React from "react";
import { PointItemInput } from "@/types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Package, Layers, Box, Image as ImageIcon, Award, Ticket, Star } from "lucide-react";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import { useIsMobile } from "@/hooks/useIsMobile";

interface PointItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PointItemInput;
  setData: React.Dispatch<React.SetStateAction<PointItemInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function PointItemModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
}: PointItemModalProps) {
  const isEdit = !!data.uuid;

  const categoryOptions = [
    { value: "VOUCHER", label: "Voucher" },
    { value: "GOODS", label: "Goods" },
    { value: "SERVICE", label: "Service" },
  ];

  const isMobile = useIsMobile()

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl m-4 p-0">
      <div className="w-full max-h-[90vh] overflow-y-auto no-scrollbar rounded-3xl md:rounded-4xl bg-white dark:bg-[#0B0F1A] shadow-2xl border border-gray-100 dark:border-gray-800/50">
        {/* Header */}
        <div className="relative p-6 md:p-8 pb-0">
          <div className="flex items-center gap-4 mb-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Package size={24} />
            </div>
            <div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {isEdit ? "Update Point Item" : "New Point Item"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Configure items that employees can redeem with their points.
              </p>
            </div>
          </div>
        </div>

        <form
          className="p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Preview & Image */}
            <div className="space-y-6">
              {/* Voucher Preview Visual */}
              <div className="relative h-32 md:h-40 w-full rounded-3xl bg-linear-to-br from-indigo-600 to-purple-700 p-5 md:p-6 overflow-hidden shadow-xl group">
                <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#0B0F1A]" />
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#0B0F1A]" />
                <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-white/20" />
                
                <div className="relative flex justify-between items-center h-full">
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="text-indigo-200" size={16} />
                      <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">
                        {data.category || "ITEM"}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-white truncate max-w-37.5 md:max-w-40">
                      {data.name || "Item Name"}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end justify-center">
                    <div className="bg-white/20 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-2xl border border-white/30 flex items-center gap-2">
                      <Star size={isMobile ? 14 : 18} className="text-amber-300 fill-amber-300" />
                      <span className="text-xl md:text-2xl font-black text-white">
                        {data.required_points || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Item Image</label>
                <div className="space-y-3">
                  {data.image ? (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                      <img 
                        src={typeof data.image === "string" ? data.image : URL.createObjectURL(data.image as File)} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button type="button" onClick={() => setData({ ...data, image: null })} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg">
                        <ImageIcon size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-full h-32 md:h-48 rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-gray-400 gap-2">
                       <ImageIcon size={32} strokeWidth={1} />
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400">
                      <ImageIcon size={16} />
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => setData({ ...data, image: e.target.files?.[0] || null })} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs text-gray-600 dark:text-gray-300 outline-none focus:border-indigo-500 transition-all file:hidden cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Form Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Item Name</label>
                <Input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="e.g. Starbucks Voucher"
                  className="bg-gray-50 dark:bg-white/5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Category</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400"><Layers size={16} /></div>
                    <Select options={categoryOptions} value={data.category || ""} onChange={(val) => setData({ ...data, category: val as any })} className="pl-10" />
                  </div>
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Stock</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400"><Box size={16} /></div>
                    <Input
                      type="number"
                      value={data.stock === 0 && !isEdit ? "" : data.stock}
                      onChange={(e) => {
                        const val = e.target.value;
                        setData({ ...data, stock: val === "" ? "" : parseInt(val) } as any);
                      }}
                      placeholder="0"
                      className="bg-gray-50 dark:bg-white/5 pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Points Required */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Required Points</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-amber-500"><Award size={16} /></div>
                  <Input
                    type="number"
                    value={data.required_points === 0 && !isEdit ? "" : data.required_points}
                    onChange={(e) => {
                      const val = e.target.value;
                      setData({ ...data, required_points: val === "" ? "" : parseInt(val) } as any);
                    }}
                    placeholder="e.g. 1000"
                    className="bg-gray-50 dark:bg-white/5 pl-10"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Description</label>
                <textarea
                  value={data.description || ""}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  placeholder="Describe the item..."
                  rows={3}
                  className="w-full rounded-xl dark:text-white border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3 text-sm outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Status Toggle */}
              <div
                onClick={() => !isLoading && setData({ ...data, is_active: !data.is_active })}
                className={`flex items-center justify-between p-3 md:p-4 rounded-2xl border transition-all cursor-pointer ${
                  data.is_active
                    ? "border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/5"
                    : "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400"><Package size={18} /></div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">Item Active</p>
                    <p className="text-[10px] text-gray-500">Visible for redemption</p>
                  </div>
                </div>
                <Checkbox checked={!!data.is_active} onChange={() => {}} disabled={isLoading} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 md:py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              {isLoading ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
