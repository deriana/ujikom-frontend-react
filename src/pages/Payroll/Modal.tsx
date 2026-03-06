import { PayrollUpdateInput } from "@/types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Calculator, FileText, UserCircle2 } from "lucide-react";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";

interface PayrollUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  payrollData: PayrollUpdateInput & { employee_name?: string };
  setPayrollData: (data: PayrollUpdateInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function PayrollUpdateModal({
  isOpen,
  onClose,
  payrollData,
  setPayrollData,
  onSubmit,
  isLoading = false,
}: PayrollUpdateModalProps) {
  const updateData = (payload: Partial<PayrollUpdateInput>) => {
    setPayrollData({ ...payrollData, ...payload });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        
        {/* Header & Employee Info */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Calculator size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                Payroll Adjustment
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Adjusting earnings or deductions for:
              </p>
            </div>
          </div>

          {/* Employee Identity Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-inner">
              <UserCircle2 size={28} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Employee Name</p>
              <h5 className="text-lg font-bold text-gray-800 dark:text-blue-400 capitalize">
                {payrollData.employee_name || "Unknown Employee"}
              </h5>
            </div>
          </div>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="space-y-5">
            {/* Manual Adjustment Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Calculator size={14} className="text-blue-500" /> Adjustment Amount
              </label>
              <CurrencyInput
                value={payrollData.manual_adjustment || 0}
                onChange={(val) => updateData({ manual_adjustment: val })}
                placeholder="0"
                className="w-full"
              />
              <p className="text-[10px] text-gray-400 italic px-1">
                Tip: Use minus (-) for deductions, e.g. -50000
              </p>
            </div>

            {/* Adjustment Note Field */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <FileText size={14} className="text-blue-500" /> Reason / Note
              </label>
              <textarea
                rows={3}
                required
                value={payrollData.adjustment_note || ""}
                onChange={(e) => updateData({ adjustment_note: e.target.value })}
                placeholder="Ex: Performance bonus or late arrival deduction..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-none min-w-[140px]"
            >
              {isLoading ? "Saving..." : "Apply Changes"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}