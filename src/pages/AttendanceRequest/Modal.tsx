import { AttendanceRequestInput, RequestType } from "@/types";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import {
  FileText,
  ClipboardCheck,
  UserCircle,
  Calendar,
  Layers,
  Settings,
  ArrowRight,
} from "lucide-react";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";

interface AttendanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceRequestData: AttendanceRequestInput;
  setAttendanceRequestData: (data: AttendanceRequestInput) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  shiftTemplates?: { uuid: string; name: string }[];
  workSchedules?: { uuid: string; name: string }[];
  isUserAdminOrHR?: boolean;
}

export default function AttendanceRequestModal({
  isOpen,
  onClose,
  attendanceRequestData,
  setAttendanceRequestData,
  onSubmit,
  isLoading = false,
  shiftTemplates = [],
  workSchedules = [],
  isUserAdminOrHR = false,
}: AttendanceRequestModalProps) {
  const isEdit = !!attendanceRequestData.uuid;
  const isShift = attendanceRequestData.request_type === 'SHIFT';

  const updateData = (fields: Partial<AttendanceRequestInput>) => {
    setAttendanceRequestData({ ...attendanceRequestData, ...fields });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl m-4">
      <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl transition-colors duration-200">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
              <ClipboardCheck size={24} />
            </div>
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEdit ? "Update Request" : "New Attendance Request"}
            </h4>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            {isShift ? "Change your work shift for a specific date." : "Change your work mode schedule for a period."}
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
            {/* 2. Request Type & Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Layers size={14} /> Request Type
                </label>
                <Select
                  options={[
                    { value: 'SHIFT', label: 'Shift Change' },
                    { value: 'WORK_MODE', label: 'Work Mode Change' },
                  ]}
                  value={attendanceRequestData.request_type}
                  onChange={(val) => updateData({ 
                    request_type: val as RequestType,
                    shift_template_uuid: undefined,
                    work_schedule_uuid: undefined,
                    end_date: null // Reset end_date jika pindah ke SHIFT
                  })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Settings size={14} /> {isShift ? 'Target Shift' : 'Target Work Mode'}
                </label>
                {isShift ? (
                  <Select
                    options={shiftTemplates.map(s => ({ value: s.uuid, label: s.name }))}
                    placeholder="Select shift..."
                    value={attendanceRequestData.shift_template_uuid || ""}
                    onChange={(val) => updateData({ shift_template_uuid: val })}
                  />
                ) : (
                  <Select
                    options={workSchedules.map(w => ({ value: w.uuid, label: w.name }))}
                    placeholder="Select work mode..."
                    value={attendanceRequestData.work_schedule_uuid || ""}
                    onChange={(val) => updateData({ work_schedule_uuid: val })}
                  />
                )}
              </div>
            </div>

            {/* 3. Date Selection (Conditional) */}
            <div className={`grid grid-cols-1 ${isShift ? 'md:grid-cols-1' : 'md:grid-cols-2'} gap-6`}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Calendar size={14} /> {isShift ? 'Selected Date' : 'Start Date'}
                </label>
                <DatePicker
                  id="request-start-date"
                  value={attendanceRequestData.start_date}
                  onChange={(_, dateStr) => updateData({ start_date: dateStr })}
                  placeholder={isShift ? "Select date" : "Select start date"}
                />
              </div>

              {!isShift && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <ArrowRight size={14} /> End Date
                  </label>
                  <DatePicker
                    id="request-end-date"
                    value={attendanceRequestData.end_date || ""}
                    onChange={(_, dateStr) => updateData({ end_date: dateStr })}
                    placeholder="Select end date"
                  />
                </div>
              )}
            </div>

            {/* 4. Reason */}
            <div className="space-y-2 px-1">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <FileText size={14} /> Reason for Request
              </label>
              <textarea
                rows={3}
                required
                value={attendanceRequestData.reason}
                onChange={(e) => updateData({ reason: e.target.value })}
                placeholder="Briefly explain the reason for this change..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
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
              className="px-8 py-2.5 rounded-xl shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white border-none"
            >
              {isLoading ? "Processing..." : isEdit ? "Update Request" : "Submit Request"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}