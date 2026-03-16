import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { AssessmentCategoryInput } from "@/types";
import { ClipboardList, Activity } from "lucide-react";
import Checkbox from "@/components/form/input/Checkbox";

interface AssessmentCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AssessmentCategoryInput;
  setData: React.Dispatch<React.SetStateAction<AssessmentCategoryInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function AssessmentCategoryModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
}: AssessmentCategoryModalProps) {
  const isEdit = Boolean(data.uuid);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="w-full overflow-hidden rounded-4xl bg-white dark:bg-[#0B0F1A] shadow-2xl border border-gray-100 dark:border-gray-800/50">
        {/* Header */}
        <div className="relative p-8 pb-0">
          <div className="flex items-center gap-4 mb-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <ClipboardList size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {isEdit ? "Update Category" : "New Assessment Category"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Define categories to organize your assessment questions.
              </p>
            </div>
          </div>
        </div>

        <form
          className="p-8 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Category Name
            </label>
            <Input
              type="text"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="e.g. Technical Skills, Soft Skills"
              className="bg-gray-50 dark:bg-white/5"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Description
            </label>
            <div className="relative">
              <textarea
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Briefly describe what this category covers..."
                rows={3}
                className="w-full rounded-xl dark:text-white border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Toggles Group */}
          <div className="grid grid-cols-1 gap-3">
            {/* Active Status Toggle */}
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
                  <Activity size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">Active Status</p>
                  <p className="text-[10px] text-gray-500">Enable this category for assessments</p>
                </div>
              </div>
              <Checkbox
                checked={!!data.is_active}
                onChange={() => {}}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">``
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
              {isLoading ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}