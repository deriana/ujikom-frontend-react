import Input from "@/components/form/input/InputField";
import { AllowanceInput } from "@/types";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";
import { Banknote, Settings2, Info, Percent, Coins } from "lucide-react";
import CrudModal from "@/components/ui/modal/CrudModal";

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
    <CrudModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title={isEdit ? "Update Allowance" : "Create New Allowance"}
      description={
        isEdit
          ? `Modifying details for ${allowanceData.name || "this allowance"}`
          : "Configure a new allowance type for your payroll system."
      }
      icon={Banknote}
      iconColorClass="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400"
      isEdit={isEdit}
      isLoading={isLoading}
      maxWidth="max-w-xl"
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
                {allowanceData.type === "percentage" ? (
                  <Percent size={14} />
                ) : (
                  <Coins size={14} />
                )}
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
                {allowanceData.type === "percentage" ? "Rate" : "Amount"}
              </label>
              <CurrencyInput
                value={allowanceData.amount}
                symbol={allowanceData.type === "percentage" ? "%" : "Rp"}
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
              <strong>Pro Tip:</strong> Percentage type will be calculated
              automatically based on the employee's basic salary.
            </p>
          </div>
        )}
      </div>
    </CrudModal>
  );
}