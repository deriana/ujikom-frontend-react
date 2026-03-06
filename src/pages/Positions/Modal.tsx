import { PositionInput, AllowancePositionPivot } from "@/types";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";
import { Briefcase, Wallet, Plus, Trash2, Info, Layers } from "lucide-react";

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  positionData: PositionInput;
  setPositionData: React.Dispatch<React.SetStateAction<PositionInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
  allowanceOptions: { uuid: string; name: string; amount: number }[];
}

export default function PositionModal({
  isOpen,
  onClose,
  positionData,
  setPositionData,
  onSubmit,
  isLoading = false,
  allowanceOptions,
}: PositionModalProps) {
  // Use UUID to detect edit mode so the title doesn't change when typing the name
  const isEdit = Boolean(positionData.uuid);

  const addAllowance = () => {
    setPositionData((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { uuid: "", amount: undefined }],
    }));
  };

  const updateAllowanceField = (
    index: number,
    field: keyof AllowancePositionPivot,
    value: any,
  ) => {
    setPositionData((prev) => {
      const updated = [...prev.allowances];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, allowances: updated };
    });
  };

  const removeAllowance = (index: number) => {
    setPositionData((prev) => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index),
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Briefcase size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Position" : "Create New Position"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
            {isEdit 
              ? `Modifying details for position ${positionData.name || ''}` 
              : "Define a new job position and its compensation structure."}
          </p>
        </div>

        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Main Info Card */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                Position Name
              </label>
              <Input
                type="text"
                value={positionData.name}
                onChange={(e) =>
                  setPositionData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Senior Developer"
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Wallet size={14} /> Base Salary
              </label>
              <CurrencyInput
                value={positionData.base_salary}
                onChange={(val) =>
                  setPositionData((prev) => ({ ...prev, base_salary: val }))
                }
                placeholder="0"
                className="w-full"
              />
            </div>
          </div>

          {/* Allowances Section */}
          <div>
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-blue-500" />
                <h5 className="font-bold text-gray-800 dark:text-white">
                  Allowances Structure
                </h5>
                <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-500">
                  {positionData.allowances.length}
                </span>
              </div>
              <button
                type="button"
                onClick={addAllowance}
                className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition"
              >
                <Plus size={16} /> Add Allowance
              </button>
            </div>

            {positionData.allowances.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/30 dark:bg-gray-800/10">
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <Info size={32} strokeWidth={1} />
                  <p className="text-sm">No allowances assigned to this position</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {positionData.allowances.map((allowance, index) => (
                  <div 
                    key={index} 
                    className="group flex flex-col md:flex-row items-start md:items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-800 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex-1 w-full">
                      <select
                        value={allowance.uuid ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          const selected = allowanceOptions.find((a) => a.uuid === value);
                          updateAllowanceField(index, "uuid", value);
                          if (selected) {
                            updateAllowanceField(index, "amount", selected.amount);
                          }
                        }}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      >
                        <option value="">Select Allowance</option>
                        {allowanceOptions.map((a) => (
                          <option key={a.uuid} value={a.uuid}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-none w-full md:w-48">
                      <CurrencyInput
                        value={allowance.amount ?? 0}
                        onChange={(val) => updateAllowanceField(index, "amount", val)}
                        className="w-full"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeAllowance(index)}
                      className="flex-none p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]"
            >
              {isLoading ? "Saving..." : isEdit ? "Save Changes" : "Create Position"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}