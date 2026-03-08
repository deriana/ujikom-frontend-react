import React from "react";
import { Modal } from "@/components/ui/modal";
import { EmployeeWorkScheduleInput } from "@/types";
import Button from "@/components/ui/button/Button";
import {
  Calendar,
  User,
  Briefcase,
  Info,
  ArrowRight,
  Clock9,
} from "lucide-react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import { useGetEmployeeForInput } from "@/hooks/useUser";
import { useWorkSchedules } from "@/hooks/useWorkSchedules";
import { GlobalModalSkeleton } from "@/components/skeleton/ModalSkeleton";

interface EmployeeWorkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EmployeeWorkScheduleInput;
  setData: React.Dispatch<React.SetStateAction<EmployeeWorkScheduleInput>>;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function EmployeeWorkScheduleModal({
  isOpen,
  onClose,
  data,
  setData,
  onSubmit,
  isLoading = false,
}: EmployeeWorkScheduleModalProps) {
  const isEdit = Boolean(data.uuid);

  const { data: employees = [], isLoading: loadingEmployees } = useGetEmployeeForInput({
    enabled: isOpen,
  }) as { data: { name: string; nik: string }[]; isLoading: boolean };

  const { data: schedules = [], isLoading: loadingSchedules } = useWorkSchedules({
    enabled: isOpen,
  }) as {
    data: { name: string; uuid: string }[];
    isLoading: boolean;
  };

  const isInitialLoading = loadingEmployees || loadingSchedules;

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
                    {isEdit ? "Update Schedule" : "Assign Schedule"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    {isEdit
                      ? "Adjusting active period for the employee."
                      : "Set up a new work policy assignment."}
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
                      onChange={(val) =>
                        setData((prev) => ({ ...prev, employee_nik: val }))
                      }
                      options={employees.map((e) => ({
                        label: e.name,
                        value: e.nik,
                      }))}
                      placeholder="Select employee profile..."
                      disabled={isEdit}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 flex items-center gap-2">
                      <Briefcase size={14} /> Work Schedule Template
                    </label>
                    <Select
                      value={data.work_schedule_uuid}
                      onChange={(val) =>
                        setData((prev) => ({
                          ...prev,
                          work_schedule_uuid: val,
                        }))
                      }
                      options={schedules.map((s) => ({
                        label: s.name,
                        value: s.uuid,
                      }))}
                      placeholder="Choose policy..."
                      className="w-full"
                    />
                  </div>
                </div>

                {/* --- Validity Period Section --- */}
                <div className="space-y-4">
                  <h5 className="px-1 text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-500" />
                    Validity Period
                  </h5>

                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <div className="w-full space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                        Starts On
                      </label>
                      <DatePicker
                        id="start-date-picker"
                        value={data.start_date}
                        onChange={(_, dateStr) =>
                          setData((p) => ({ ...p, start_date: dateStr }))
                        }
                        placeholder="YYYY-MM-DD"
                      />
                    </div>

                    <div className="hidden md:block mt-6 text-gray-300 dark:text-gray-600">
                      <ArrowRight size={20} />
                    </div>

                    <div className="w-full space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
                        Ends On (Optional)
                      </label>
                      <DatePicker
                        id="end-date-picker"
                        value={data.end_date || ""}
                        onChange={(_, dateStr) =>
                          setData((p) => ({ ...p, end_date: dateStr || null }))
                        }
                        placeholder="No end date"
                      />
                    </div>
                  </div>
                </div>

                {/* --- UX Context Box --- */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${!data.end_date ? "max-h-20 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20">
                    <div className="bg-blue-500 rounded-full p-1 shadow-lg shadow-blue-200 dark:shadow-none">
                      <Info size={12} className="text-white" />
                    </div>
                    <p className="text-[11px] leading-relaxed text-blue-800/80 dark:text-blue-300/80 font-medium">
                      <strong>Permanent Assignment:</strong> Leaving the end
                      date empty means this schedule stays active indefinitely.
                    </p>
                  </div>
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
                      "Update Policy"
                    ) : (
                      "Confirm Assignment"
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
