import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";
import { UserInput } from "@/types";
import { EmployeeStatusEnum } from "@/types/employee.types";
import { Banknote, Calendar } from "lucide-react";
import DatePicker from "../date-picker";

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
      {value.employee_status === EmployeeStatusEnum.CONTRACT && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
              <Calendar size={12} /> Contract Duration Start
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
              <Calendar size={12} /> Contract Duration End
            </label>
            <DatePicker
              id="contract_end_picker"
              placeholder="Select end date"
              value={value.contract_end || ""}
              disabled={disabled}
              onChange={(_selectedDates, dateStr) =>
                onChange({ ...value, contract_end: dateStr || null })
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}
