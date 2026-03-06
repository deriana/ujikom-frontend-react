import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { AllowanceInput } from "@/types";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";
import { Banknote, Settings2, Info, Percent, Coins } from "lucide-react";

interface AllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  allowanceData: AllowanceInput;
  setAllowanceData: (data: AllowanceInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function AllowanceModal({
  isOpen,
  onClose,
  allowanceData,
  setAllowanceData,
  onSubmit,
  isLoading = false,
}: AllowanceModalProps) {
  // Identify edit mode based on the presence of uuid so the title doesn't change when typing the name
  const isEdit = Boolean(allowanceData.uuid);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <Banknote size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Allowance" : "Create New Allowance"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
            {isEdit 
              ? `Modifying details for ${allowanceData.name || 'this allowance'}` 
              : "Configure a new allowance type for your payroll system."}
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-5">
            {/* Main Info Section */}
            <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
              
              {/* Allowance Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Settings2 size={14} /> Allowance Name
                </label>
                <Input
                  type="text"
                  value={allowanceData.name}
                  onChange={(e) =>
                    setAllowanceData({ ...allowanceData, name: e.target.value })
                  }
                  placeholder="e.g. Transport Allowance"
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Allowance Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {allowanceData.type === 'percentage' ? <Percent size={14} /> : <Coins size={14} />} 
                    Calculation Type
                  </label>
                  <select
                    value={allowanceData.type}
                    onChange={(e) =>
                      setAllowanceData({
                        ...allowanceData,
                        type: e.target.value as "fixed" | "percentage",
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white transition-all"
                  >
                    <option value="fixed">Fixed (Nominal)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {allowanceData.type === 'percentage' ? 'Rate' : 'Amount'}
                  </label>
                  <CurrencyInput
                    value={allowanceData.amount}
                    symbol={allowanceData.type === 'percentage' ? '%' : 'Rp'}
                    onChange={(val) =>
                      setAllowanceData({ ...allowanceData, amount: val })
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Hint Box */}
            {allowanceData.type === "percentage" && (
              <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30">
                <Info size={18} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                  <strong>Pro Tip:</strong> Percentage type will be calculated automatically based on the employee's basic salary.
                </p>
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
              className="px-8 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200 dark:shadow-none transition-all active:scale-[0.98]"
            >
              {isLoading ? "Processing..." : isEdit ? "Save Changes" : "Create Allowance"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}