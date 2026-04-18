import React from "react";
import { Modal } from "@/components/ui/modal";
import { EmployeeShiftInput } from "@/types";
import Button from "@/components/ui/button/Button";
import { User, CalendarDays, Info, Briefcase, Clock9 } from "lucide-react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { useShiftTemplates } from "@/hooks/useShiftTemplate";
// import { useGetEmployeeForInput } from "@/hooks/useUser";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";
import { useEmployeeOptions } from "@/hooks/useEmployeeInput";

interface EmployeeShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EmployeeShiftInput;
  setData: React.Dispatch<React.SetStateAction<EmployeeShiftInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function EmployeeShiftModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
}: EmployeeShiftModalProps) {
  const isEdit = Boolean(data.uuid);
  const { employees, isLoading: loadingEmployees } = useEmployeeOptions()

  const { data: shifts = [], isLoading: loadingShifts } = (useShiftTemplates as any)({
    enabled: isOpen,
  })

  const isInitialLoading = loadingEmployees || loadingShifts;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg m-4">
      <div className="relative w-full rounded-4xl bg-white p-1 dark:bg-gray-900 shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="p-7">
          {isInitialLoading ? (
            <GlobalModalSkeleton inputsCount={2} hasDateRange={true} />
          ) : (
            <>
              {/* --- Header Section --- */}
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-[0.2em]">
                    <Clock9 size={14} />
                    <span>Scheduling System</span>
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {isEdit ? "Update Schedule" : "Assign Shift"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {isEdit
                      ? "Adjusting shift assignment for the employee."
                      : "Set up a new daily shift assignment."}
                  </p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmit();
                }}
                className="space-y-6"
              >
                {/* --- Assignment Card (Main Info) --- */}
                <div className="grid grid-cols-1 gap-5 p-6 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 shadow-inner">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                      <User size={14} /> Target Employee
                    </label>
                    <Select
                      value={data.employee_nik || ""}
                      onChange={(val) => setData((prev) => ({ ...prev, employee_nik: val }))}
                      options={employees.map((e: { name: string; nik: string }) => ({
                        label: `${e.name} — ${e.nik}`,
                        value: e.nik,
                      }))}
                      placeholder="Search employee..."
                      disabled={isEdit}
                      className="w-full"
                    />
                    {isEdit && (
                      <p className="text-[10px] text-gray-400 italic">
                        Employee cannot be changed during update
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                      <Briefcase size={14} /> Shift Template
                    </label>
                    <Select
                      value={data.shift_template_uuid || ""}
                      onChange={(val) =>
                        setData((prev) => ({
                          ...prev,
                          shift_template_uuid: val,
                        }))
                      }
                      options={shifts.map((s: { name: string; uuid: string }) => ({
                        label: s.name,
                        value: s.uuid,
                      }))}
                      placeholder="Select shift..."
                      className="w-full"
                      disabled={isEdit}
                    />
                    {isEdit && (
                      <p className="text-[10px] text-gray-400 italic">
                        Shift template cannot be changed during update
                      </p>
                    )}
                  </div>
                </div>

                {/* --- Validity Period Section --- */}
                <div className="space-y-4">
                  <h5 className="px-1 text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <CalendarDays size={16} className="text-blue-500" />
                    Assignment Date
                  </h5>

                  <DatePicker
                    id="shift-date-picker"
                    value={data.shift_date}
                    onChange={(_, dateStr) =>
                      setData((prev) => ({
                        ...prev,
                        shift_date: dateStr,
                      }))
                    }
                    placeholder="YYYY-MM-DD"
                  />
                </div>

                {/* Alert/Info Note */}
                <div className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
                    <strong>Note:</strong> Shift assignments are linked to
                    existing templates. You cannot manually override specific
                    hours here; please update the template if needed. HR cannot
                    manually assign shifts outside of the defined templates.
                  </p>
                </div>

                {/* --- Action Section --- */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="group px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                  >
                    Dismiss
                  </button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xl shadow-blue-500/20 dark:shadow-none border border-blue-500 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : isEdit ? (
                      "Update Shift"
                    ) : (
                      "Confirm Shift"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}