import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { PointRuleInput } from "@/types";
import { Star, Activity, Award, Settings2, Layers } from "lucide-react";
import Checkbox from "@/components/form/input/Checkbox";
import Select from "@/components/form/Select";
import { POINT_CATEGORY } from "@/constants/PointCategory";

interface PointRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PointRuleInput;
  setData: React.Dispatch<React.SetStateAction<PointRuleInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function PointRuleModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
}: PointRuleModalProps) {
  const isEdit = Boolean(data.uuid);
  const [showCondition, setShowCondition] = React.useState(
    Boolean(data.min_value !== null || data.max_value !== null)
  );

  const categoryOptions = Object.values(POINT_CATEGORY).map((cat) => ({
    value: cat,
    label: cat.replace(/_/g, " "),
  }));

  const operatorOptions = ["==", "<", "<=", ">", ">=", "BETWEEN"].map((op) => ({ value: op, label: op }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="w-full overflow-hidden rounded-4xl bg-white dark:bg-[#0B0F1A] shadow-2xl border border-gray-100 dark:border-gray-800/50">
        {/* Header */}
        <div className="relative p-8 pb-0">
          <div className="flex items-center gap-4 mb-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Star size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                {isEdit ? "Update Point Rule" : "New Point Rule"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">
                Define how points are awarded or deducted based on employee
                events.
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
                value={data.category}
                onChange={(val) => setData({ ...data, category: val as any })}
                className="pl-10"
              />
            </div>
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Event Name
            </label>
            <Input
              type="text"
              value={data.event_name}
              onChange={(e) => setData({ ...data, event_name: e.target.value })}
              placeholder="e.g. On Time, Late, Completed Task"
              className="bg-gray-50 dark:bg-white/5"
            />
          </div>

          {/* Points Value */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Points Value
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-400">
                <Award size={16} />
              </div>
              <Input
                type="number"
                value={data.points === 0 && !isEdit ? "" : data.points}
                onChange={(e) => {
                  const val = e.target.value;
                  setData({
                    ...data,
                    points: val === "" ? "" : parseInt(val),
                  } as any);
                }}
                placeholder="e.g. 5 or -5"
                className="bg-gray-50 dark:bg-white/5 pl-10"
              />
            </div>
            <p className="text-[10px] text-gray-400">
              Use negative values (e.g. -5) for penalties.
            </p>
          </div>

          {/* Condition Toggle */}
          <div className="space-y-4">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setShowCondition(!showCondition)}
            >
              <Checkbox checked={showCondition} onChange={() => {}} />
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Add Logic Condition
              </span>
            </div>

            {showCondition && (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Operator</label>
                    <Select
                      options={operatorOptions}
                      value={data.operator}
                      onChange={(val) => setData({ ...data, operator: val as any })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">
                      {data.operator === "BETWEEN" ? "Min Value" : "Value"}
                    </label>
                    <Input
                      type="number"
                      value={data.min_value ?? ""}
                      onChange={(e) => setData({ ...data, min_value: e.target.value === "" ? null : Number(e.target.value) })}
                      placeholder="0"
                      // @ts-ignore - system_reserve check
                      disabled={data.system_reserve}
                    />
                  </div>
                </div>

                {data.operator === "BETWEEN" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Max Value</label>
                    <Input
                      type="number"
                      value={data.max_value ?? ""}
                      onChange={(e) => setData({ ...data, max_value: e.target.value === "" ? null : Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                )}
                
                {/* @ts-ignore */}
                {data.system_reserve && (
                   <div className="flex items-center gap-2 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                     <Settings2 size={12} />
                     System reserved: Min value is locked.
                   </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Description
            </label>
            <div className="relative">
              <textarea
                value={data.description || ""}
                onChange={(e) =>
                  setData({ ...data, description: e.target.value })
                }
                placeholder="Describe when this point rule is triggered..."
                rows={3}
                className="w-full rounded-xl dark:text-white border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3 text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Status Toggle */}
          <div className="grid grid-cols-1 gap-3">
            <div
              onClick={() =>
                !isLoading && setData({ ...data, is_active: !data.is_active })
              }
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
                  <p className="text-sm font-bold text-gray-800 dark:text-white">
                    Rule Active
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Enable this rule for automatic point calculation
                  </p>
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
              {isLoading ? "Saving..." : isEdit ? "Update Rule" : "Create Rule"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
