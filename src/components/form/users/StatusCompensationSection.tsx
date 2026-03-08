import Select from "@/components/form/Select";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";
import { UserInput } from "@/types";
import { useEffect } from "react";
import { EmployeeStatusEnum } from "@/types/employee.types";
import { Banknote, Calendar } from "lucide-react";
import DatePicker from "../date-picker";
import toast from "react-hot-toast";

interface Props {
  value: UserInput;
  onChange: (val: UserInput) => void;
  disabled?: boolean;
}

export default function StatusCompensationSection({
  value,
  onChange,
  disabled = false,
}: Props) {
  const employeeStatusOptions = [
    { value: EmployeeStatusEnum.PERMANENT, label: "Permanent" },
    { value: EmployeeStatusEnum.CONTRACT, label: "Contract" },
    { value: EmployeeStatusEnum.INTERN, label: "Intern" },
    { value: EmployeeStatusEnum.PROBATION, label: "Probation" },
  ];

  // Set default start date to today if empty when status is Contract/Probation/Intern
  useEffect(() => {
    if (
      (value.employee_status === EmployeeStatusEnum.CONTRACT ||
        value.employee_status === EmployeeStatusEnum.INTERN ||
        value.employee_status === EmployeeStatusEnum.PROBATION) &&
      !value.contract_start
    ) {
      const today = new Date().toISOString().split("T")[0];
      onChange({ ...value, contract_start: today });
    }
  }, [value.employee_status]);

  const handleEndDateChange = (dateStr: string) => {
    if (value.employee_status === EmployeeStatusEnum.PROBATION && value.contract_start && dateStr) {
      const start = new Date(value.contract_start);
      const end = new Date(dateStr);
      
      // Calculate 3 months limit
      const limit = new Date(start);
      limit.setMonth(limit.getMonth() + 3);

      if (end > limit) {
        toast.error("Probation period cannot exceed 3 months");
        onChange({ ...value, contract_end: null });
        return;
      }
    }
    onChange({ ...value, contract_end: dateStr || null });
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 space-y-6">
      <div className="flex items-center gap-2">
        <Banknote size={18} className="text-brand-500" />
        <h3 className="font-bold text-gray-800 dark:text-white/90">
          Status & Compensation
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            Employment Status
          </label>
          <Select<number>
            options={employeeStatusOptions}
            value={value.employee_status}
            onChange={(val) =>
              onChange({
                ...value,
                employee_status: val,
              })
            }
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            Base Salary (Monthly)
          </label>
          <CurrencyInput
            value={value.base_salary || 0}
            onChange={(val) => onChange({ ...value, base_salary: val })}
            placeholder="0"
          />
        </div>
      </div>

      {/* Conditional Contract Dates */}
      {(value.employee_status === EmployeeStatusEnum.CONTRACT ||
        value.employee_status === EmployeeStatusEnum.PROBATION || value.employee_status === EmployeeStatusEnum.INTERN) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <Calendar size={12} />{" "}
              {value.employee_status === EmployeeStatusEnum.PROBATION
                ? "Probation"
                : value.employee_status === EmployeeStatusEnum.INTERN ? "Internship" : "Contract"}{" "}
              Start
            </label>
            <DatePicker
              id="contract_start_picker"
              placeholder="Select start date"
              value={value.contract_start || ""}
              disabled={disabled}
              onChange={(_selectedDates, dateStr) =>
                onChange({ ...value, contract_start: dateStr })
              }
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <Calendar size={12} />{" "}
              {value.employee_status === EmployeeStatusEnum.PROBATION
                ? "Probation"
                : value.employee_status === EmployeeStatusEnum.INTERN ? "Internship" : "Contract"}{" "}
              End
            </label>
            <DatePicker
              id="contract_end_picker"
              placeholder="Select end date"
              value={value.contract_end || ""}
              disabled={disabled}
              onChange={(_selectedDates, dateStr) => handleEndDateChange(dateStr)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
