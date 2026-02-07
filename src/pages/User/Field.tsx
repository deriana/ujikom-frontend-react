// File: @/components/form/users/UserField.tsx
import { CurrencyInput } from "@/components/form/form-elements/CurrencyInput";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import SelectDivisionTeam from "@/components/form/users/SelectDivisionsTeam";
import { Division, Position, UserInput, Manager } from "@/types";
import { EmployeeStatusEnum } from "@/types/employee.types";
import {
  User,
  ShieldCheck,
  Briefcase,
  Banknote,
  Calendar,
  Phone,
  MapPin,
  Cake,
  Clock,
} from "lucide-react";
import Checkbox from "@/components/form/input/Checkbox";
import DatePicker from "@/components/form/date-picker";

interface UserFieldProps {
  value: UserInput;
  onChange: (val: UserInput) => void;
  roles: { id: number; name: string }[];
  positions: Position[];
  divisions: Division[];
  managers: Manager[];
  disabled?: boolean;
}

export default function UserField({
  value,
  onChange,
  roles,
  positions,
  divisions,
  managers,
  disabled = false,
}: UserFieldProps) {
  const employeeStatusOptions = [
    { value: EmployeeStatusEnum.PROBATION, label: "Probation" },
    { value: EmployeeStatusEnum.PERMANENT, label: "Permanent" },
    { value: EmployeeStatusEnum.CONTRACT, label: "Contract" },
    { value: EmployeeStatusEnum.INTERN, label: "Intern" },
  ];

  const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
  ];

  return (
    <div className="space-y-10">
      {/* SECTION 1: PERSONAL & ACCOUNT */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <User size={20} className="text-brand-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
              Personal & Account
            </h3>
          </div>
          <Checkbox
            label="Account Active"
            checked={!!value.is_active}
            onChange={() => onChange({ ...value, is_active: !value.is_active })}
            disabled={disabled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              Full Name
            </label>
            <Input
              value={value.name}
              disabled={disabled}
              placeholder="e.g. John Doe"
              onChange={(e) => onChange({ ...value, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Gender
            </label>
            <Select
              options={genderOptions}
              value={value.gender || ""}
              onChange={(val) =>
                onChange({ ...value, gender: val as "male" | "female" })
              }
              disabled={disabled}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Phone size={12} /> Phone Number
            </label>
            <Input
              value={value.phone || ""}
              disabled={disabled}
              placeholder="0812..."
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Cake size={12} /> Date of Birth
            </label>
            <DatePicker
              id="dob_picker"
              placeholder="Select birthday"
              value={value.date_of_birth || ""}
              onChange={(_selectedDates, dateStr) => {
                onChange({ ...value, date_of_birth: dateStr });
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              Email Address
            </label>
            <Input
              type="email"
              value={value.email}
              disabled={disabled}
              placeholder="john@company.com"
              onChange={(e) => onChange({ ...value, email: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">
              Password
            </label>
            <Input
              type="password"
              value={value.password || ""}
              disabled={disabled}
              placeholder="••••••••"
              onChange={(e) => onChange({ ...value, password: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">
              Confirm Password
            </label>
            <Input
              type="password"
              value={value.password_confirmation || ""}
              disabled={disabled}
              placeholder="••••••••"
              onChange={(e) =>
                onChange({ ...value, password_confirmation: e.target.value })
              }
            />
          </div>
          <div className="space-y-1.5 lg:col-span-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <MapPin size={12} /> Full Address
            </label>
            <Input
              value={value.address || ""}
              disabled={disabled}
              placeholder="e.g. Street Name, City, Province"
              onChange={(e) => onChange({ ...value, address: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: EMPLOYMENT & HIERARCHY */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
          <Briefcase size={20} className="text-brand-500" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
            Employment & Hierarchy
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <ShieldCheck size={12} /> Access Role
            </label>
            <Select
              options={roles.map((r) => ({
                value: r.id.toString(),
                label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
              }))}
              value={value.role_id?.toString() || ""}
              onChange={(val) =>
                onChange({ ...value, role_id: val ? Number(val) : undefined })
              }
              disabled={disabled}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              Division & Team
            </label>
            <SelectDivisionTeam
              divisions={divisions}
              value={value.team_uuid || ""}
              onChange={(val) =>
                onChange({ ...value, team_uuid: val || undefined })
              }
              disabled={disabled}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              Job Position
            </label>
            <Select
              options={positions.map((p) => ({ value: p.uuid, label: p.name }))}
              value={value.position_uuid || ""}
              onChange={(val) =>
                onChange({ ...value, position_uuid: val || undefined })
              }
              disabled={disabled}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              Direct Manager
            </label>
            <Select
              options={managers.map((m) => ({ value: m.nik, label: m.name }))}
              value={value.manager_nik || ""}
              onChange={(val) =>
                onChange({ ...value, manager_nik: val || undefined })
              }
              disabled={disabled}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Calendar size={12} /> Join Date
            </label>
            <DatePicker
              id="join_date_picker"
              placeholder="Select join date"
              value={value.join_date || ""}
              defaultDate={
                value.join_date || new Date().toISOString().split("T")[0]
              }
              onChange={(_, dateStr) =>
                onChange({ ...value, join_date: dateStr })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Clock size={12} /> Resign Date
            </label>
            <DatePicker
              id="resign_date_picker"
              placeholder="Select resign date"
              value={value.resign_date || ""}
              onChange={(_, dateStr) =>
                onChange({ ...value, resign_date: dateStr || null })
              }
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: STATUS & COMPENSATION */}
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
            <Select
              options={employeeStatusOptions.map((opt) => ({
                value: opt.value.toString(),
                label: opt.label,
              }))}
              value={value.employee_status.toString()}
              onChange={(val) =>
                onChange({
                  ...value,
                  employee_status: Number(val) as EmployeeStatusEnum,
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
              <Input
                type="date"
                value={value.contract_start || ""}
                disabled={disabled}
                onChange={(e) =>
                  onChange({ ...value, contract_start: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                <Calendar size={12} /> Contract Duration End
              </label>
              <Input
                type="date"
                value={value.contract_end || ""}
                disabled={disabled}
                onChange={(e) =>
                  onChange({ ...value, contract_end: e.target.value || null })
                }
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
