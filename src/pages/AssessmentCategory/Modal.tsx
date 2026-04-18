import React from "react";
import CrudModal from "@/components/ui/modal/CrudModal";
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
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isEdit ? "Update Category" : "New Assessment Category"}
      description="Define categories to organize your assessment questions."
      icon={ClipboardList}
      isEdit={isEdit}
      isLoading={isLoading}
      maxWidth="max-w-lg"
      submitLabel={isLoading ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
    >
      <div className="space-y-6">
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
      </div>
    </CrudModal>
  );
}