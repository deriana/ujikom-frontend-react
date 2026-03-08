import { OvertimeInput } from "@/types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { FileText, ClipboardCheck, UserCircle } from "lucide-react";
import Select from "@/components/form/Select";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";

interface OvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  overtimeData: OvertimeInput;
  setOvertimeData: (data: OvertimeInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  isUserAdminOrHR?: boolean;
}

export default function OvertimeModal({
  isOpen,
  onClose,
  overtimeData,
  setOvertimeData,
  onSubmit,
  isLoading = false,
  isUserAdminOrHR = false,
}: OvertimeModalProps) {
  const isEdit = !!overtimeData.uuid;

  const updateData = (payload: Partial<OvertimeInput>) => {
    setOvertimeData({ ...overtimeData, ...payload });
  };

    const { data: employees = [], isLoading: loadingEmployees } = (useGetEmployeeForInput as any)({
      enabled: isOpen,
    })
    
    const isInitialLoading = loadingEmployees;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        {isInitialLoading ? (
          <GlobalModalSkeleton inputsCount={2} />
        ) : (
          <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
              <ClipboardCheck size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Overtime" : "New Overtime Request"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            {isEdit
              ? "Modify the existing overtime details below."
              : "Submit a new request for overtime hours."}
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <div className="custom-scrollbar max-h-[65vh] overflow-y-auto px-1 space-y-6">
            {isUserAdminOrHR && (
              <div className="space-y-2 bg-gray-50 dark:bg-gray-800/40 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <UserCircle size={14} /> Select Employee
                  {isEdit && (
                    <span className="text-[10px] lowercase font-normal opacity-70">
                      (cannot be changed)
                    </span>
                  )}
                </label>
                <Select
                  options={employees.map((emp: { nik: string; name: string; }) => ({
                    value: emp.nik,
                    label: `${emp.nik} - ${emp.name}`,
                  }))}
                  placeholder="Choose an employee..."
                  value={overtimeData.employee_nik || ""} 
                  onChange={(val) => updateData({ employee_nik: val })}
                  disabled={isEdit}
                />
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <FileText size={14} /> Reason for Overtime
              </label>
              <textarea
                rows={4}
                required
                value={overtimeData.reason}
                onChange={(e) => updateData({ reason: e.target.value })}
                placeholder="Describe the tasks or project requiring overtime..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm"
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
              className="px-8 py-2.5 rounded-xl shadow-lg bg-orange-600 hover:bg-orange-700 text-white border-none"
            >
              {isLoading
                ? "Processing..."
                : isEdit
                  ? "Update Overtime"
                  : "Submit Overtime"}
            </Button>
          </div>
        </form>
          </>
        )}
      </div>
    </Modal>
  );
}
