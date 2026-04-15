import React from "react";
import { PointItemInput } from "@/types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Package, Layers, Box, Image as ImageIcon, Award } from "lucide-react";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="w-full overflow-hidden rounded-4xl bg-white dark:bg-[#0B0F1A] shadow-2xl border border-gray-100 dark:border-gray-800/50">
        {/* Header */}
        <div className="relative p-8 pb-0">
          <div className="flex items-center gap-4 mb-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Package size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {isEdit ? "Update Point Item" : "New Point Item"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Configure items that employees can redeem with their points.
              </p>
            </div>
          </div>
        </div>

        <form
          className="p-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Item Name
            </label>
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
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Category
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400">
                  <Layers size={16} />
                </div>
                <Select
                  options={categoryOptions}
                  value={data.category || ""}
                  onChange={(val) => setData({ ...data, category: val as any })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Stock
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400">
                  <Box size={16} />
                </div>
                <Input
                  type="number"
                  value={data.stock === 0 && !isEdit ? "" : data.stock}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData({
                      ...data,
                      stock: val === "" ? "" : parseInt(val),
                    } as any);
                  }}
                  placeholder="0"
                  className="bg-gray-50 dark:bg-white/5 pl-10"
                />
              </div>
            </div>
          </div>

          {/* Points Required */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Required Points
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-amber-500">
                <Award size={16} />
              </div>
              <Input
                type="number"
                value={data.required_points === 0 && !isEdit ? "" : data.required_points}
                onChange={(e) => {
                  const val = e.target.value;
                  setData({
                    ...data,
                    required_points: val === "" ? "" : parseInt(val),
                  } as any);
                }}
                placeholder="e.g. 1000"
                className="bg-gray-50 dark:bg-white/5 pl-10"
              />
            </div>
            <p className="text-[10px] text-gray-400">
              Amount of points an employee needs to redeem this item.
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Item Image
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400">
                <ImageIcon size={16} />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setData({ ...data, image: e.target.files?.[0] || null })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-white border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Description
            </label>
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
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
              data.is_active
                ? "border-indigo-200 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/5"
                : "border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Package size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 dark:text-white">Item Active</p>
                <p className="text-[10px] text-gray-500">Visible for redemption</p>
              </div>
            </div>
            <Checkbox checked={!!data.is_active} onChange={() => {}} disabled={isLoading} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-all"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
            >
              {isLoading ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
