import { PayrollFormState } from "@/types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Calculator, UserCircle2 } from "lucide-react";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";
import Badge from "@/components/ui/badge/Badge";
import MonthPicker from "@/components/form/MonthPicker";
import { CalenderIcon } from "@/icons";
import MultiSelect from "@/components/form/MultiSelect";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEdit: boolean; 
  payrollData: PayrollFormState;
  setPayrollData: (data: PayrollFormState) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function PayrollModal({
  isOpen,
  onClose,
  payrollData,
  setPayrollData,
  onSubmit,
  isLoading = false,
  isEdit,
}: PayrollModalProps) {

  const updateData = (payload: any) => {
    setPayrollData({ ...payrollData, ...payload });
  };

      const { data: employees = [], isLoading: loadingEmployees } = (useGetEmployeeForInput as any)({
        enabled: isOpen,
      })
      
      const isInitialLoading = loadingEmployees;

  const employeeOptions = employees?.map((emp: { nik: string; name: string; }) => ({
    value: emp.nik,
    text: `${emp.name} (${emp.nik})`,
  })) || [];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        {isInitialLoading ? (
          <GlobalModalSkeleton />
        ) : (
          <>

        {/* HEADER SECTION */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <Calculator size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEdit ? "Payroll Adjustment" : "Generate Batch Payroll"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isEdit ? "Adjusting earnings for an employee" : "Create payroll for multiple employees"}
              </p>
            </div>
          </div>

          {/* HANYA MUNCUL SAAT EDIT: Employee Card */}
          {isEdit && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <UserCircle2 size={28} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Employee Name</p>
                <h5 className="text-lg font-bold text-gray-800 dark:text-blue-400">
                  {payrollData.employee_name || "Unknown Employee"}
                </h5>
              </div>
            </div>
          )}
        </div>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-5">
            {isEdit ? (
              /* --- MODE EDIT (Adjustment) --- */
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-gray-500">Adjustment Amount</label>
                  <CurrencyInput
                    value={payrollData.manual_adjustment || 0}
                    onChange={(val) => updateData({ manual_adjustment: val })}
                    className="w-full"
                  />
                  <Badge >Use minus (-) for deductions</Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-gray-500">Reason / Note *</label>
                  <textarea
                    rows={3}
                    required
                    value={payrollData.adjustment_note || ""}
                    onChange={(e) => updateData({ adjustment_note: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
                  />
                </div>
              </>
            ) : (
              /* --- MODE CREATE (Batch) --- */
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                    <CalenderIcon className="size-3.5 text-blue-500" /> Payroll Month
                  </label>
                  <MonthPicker
                    id="payroll-month-input"
                    value={payrollData.month || ""}
                    onChange={(val) => updateData({ month: val })}
                    placeholder="Select Month"
                    // Styling tambahan agar seragam dengan textarea/input lainnya
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <MultiSelect
                    label="Select Employees"
                    placeholder="Choose employees..."
                    options={employeeOptions}
                    value={payrollData.employee_niks || []}
                    onChange={(selectedNiks) => updateData({ employee_niks: selectedNiks })}
                    disabled={isLoading}
                  />
                  <p className="text-[10px] text-gray-400 italic px-1">
                    You can select multiple employees to generate payroll in batch.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-gray-500">
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 rounded-xl shadow-lg bg-blue-600 text-white min-w-35"
            >
              {isLoading ? "Processing..." : isEdit ? "Apply Changes" : "Generate Payroll"}
            </Button>
          </div>
        </form>
          </>
        )}
      </div>
    </Modal>
  );
}