import React from "react";
import { PointItemInput } from "@/types";
import { Package, Layers, Box, Image as ImageIcon, Award, Ticket, Star } from "lucide-react";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import { useIsMobile } from "@/hooks/useIsMobile";
import CrudModal from "@/components/ui/modal/CrudModal";

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

  const getVoucherStyle = () => {
    switch (data.category) {
      case "GOODS":
        return "from-emerald-600 to-teal-700";
      case "SERVICE":
        return "from-amber-500 to-orange-600";
      case "VOUCHER":
        return "from-indigo-600 to-purple-700";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  const CategoryIcon = data.category === "GOODS" ? Box : data.category === "SERVICE" ? Award : Ticket;

  const isMobile = useIsMobile()

  return (
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isEdit ? "Update Point Item" : "New Point Item"}
      description="Configure items that employees can redeem with their points."
      icon={Package}
      isEdit={isEdit}
      isLoading={isLoading}
      maxWidth="max-w-4xl"
      submitLabel={isEdit ? "Update Item" : "Create Item"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Preview & Image */}
        <div className="space-y-6">
          {/* Voucher Preview Visual */}
          <div className={`relative h-32 md:h-40 w-full rounded-3xl bg-linear-to-br ${getVoucherStyle()} p-5 md:p-6 overflow-hidden shadow-xl group transition-all duration-500`}>
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#0B0F1A]" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white dark:bg-[#0B0F1A]" />
            <div className="absolute left-1/2 top-0 bottom-0 border-l-2 border-dashed border-white/20" />
            
            <div className="relative flex justify-between items-center h-full">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <CategoryIcon className="text-white/70" size={16} />
                  <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
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
    </CrudModal>
  );
}
