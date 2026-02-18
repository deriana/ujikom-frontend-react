import React from "react";
import { Modal } from "@/components/ui/modal";
import { EmployeeShiftInput } from "@/types";
import Button from "@/components/ui/button/Button";
import { User, CalendarDays, Clock, Info, Briefcase } from "lucide-react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";

interface EmployeeShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EmployeeShiftInput;
  setData: React.Dispatch<React.SetStateAction<EmployeeShiftInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
  employees: { nik: string; name: string }[];
  shifts: { uuid: string; name: string }[];
}

export default function EmployeeShiftModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
  employees,
  shifts,
}: EmployeeShiftModalProps) {
  const isEdit = Boolean(data.uuid);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="w-full overflow-hidden rounded-3xl bg-white dark:bg-[#0B0F1A] shadow-2xl border border-gray-100 dark:border-gray-800/50">
        {/* Header Section with subtle gradient */}
        <div className="relative p-6 pb-0">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Briefcase size={20} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {isEdit ? "Update Schedule" : "New Assignment"}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {isEdit ? "Modify existing shift" : "Assign template to employee"}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="p-6 space-y-5"
        >
          {/* Employee Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
              <User size={12} className="text-blue-500" /> Employee
            </label>
            <div className={`transition-opacity ${isEdit ? "opacity-60" : "opacity-100"}`}>
              <Select
                value={data.employee_nik || ""}
                onChange={(val) =>
                  setData((prev) => ({ ...prev, employee_nik: val }))
                }
                options={employees.map((e) => ({
                  label: `${e.name} — ${e.nik}`,
                  value: e.nik,
                }))}
                placeholder="Search employee..."
                disabled={isEdit}
                className="w-full"
              />
            </div>
            {isEdit && (
              <p className="text-[10px] text-gray-400 italic">Employee cannot be changed during update</p>
            )}
          </div>

          {/* Grid for Shift & Date */}
          <div className="grid grid-cols-1 gap-5 pt-2">
            {/* Shift Template */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                <Clock size={12} className="text-purple-500" /> Shift Template
              </label>
              <Select
                value={data.shift_template_uuid || ""}
                onChange={(val) =>
                  setData((prev) => ({
                    ...prev,
                    shift_template_uuid: val,
                  }))
                }
                options={shifts.map((s) => ({
                  label: s.name,
                  value: s.uuid,
                }))}
                placeholder="Select shift..."
              />
            </div>

            {/* Shift Date */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                <CalendarDays size={12} className="text-emerald-500" /> Assignment Date
              </label>
              <div className="relative group">
                <DatePicker
                  id="shift-date-picker"
                  value={data.shift_date}
                  onChange={(_, dateStr) =>
                    setData((prev) => ({
                      ...prev,
                      shift_date: dateStr,
                    }))
                  }
                  placeholder="Select date"
                />
              </div>
            </div>
          </div>

          {/* Alert/Info Note */}
          <div className="flex gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">
              Ensure the employee is available on the selected date to avoid scheduling conflicts.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </div>
              ) : isEdit ? (
                "Update Assignment"
              ) : (
                "Confirm Assignment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}