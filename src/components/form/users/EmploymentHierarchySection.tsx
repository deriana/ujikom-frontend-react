import Select from "@/components/form/Select";
import SelectDivisionTeam from "@/components/form/users/SelectDivisionsTeam";
import DatePicker from "@/components/form/date-picker";
import { UserInput, Division, Position, Manager } from "@/types";
import { Briefcase, ShieldCheck, Calendar, Clock } from "lucide-react";

interface Props {
  value: UserInput;
  onChange: (val: UserInput) => void;
  roles: { id: number; name: string }[];
  positions: Position[];
  divisions: Division[];
  managers: Manager[];
  disabled?: boolean;
}

export default function EmploymentHierarchySection({
  value,
  onChange,
  roles,
  positions,
  divisions,
  managers,
  disabled = false,
}: Props) {
  // helper function untuk cek role manager
  const isManagerRole = (role?: string) => {
    return role?.toLowerCase() === "manager";
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
        <Briefcase size={20} className="text-brand-500" />
        <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
          Employment & Hierarchy
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Access Role */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <ShieldCheck size={12} /> Access Role
          </label>
          <Select
            options={roles.map((r) => ({
              value: r.name.toLowerCase(), // langsung pakai name sebagai string
              label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
            }))}
            value={value.role || ""} // pakai role, bukan role_id
            onChange={(val) => {
              onChange({
                ...value,
                role: val || undefined,
                manager_nik: val === "manager" ? value.manager_nik : undefined,
              });
            }}
            disabled={disabled}
          />
        </div>

        {/* Division & Team */}
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

        {/* Job Position */}
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

        {/* Direct Manager (conditional) */}
        {!isManagerRole(value.role) && (
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
        )}

        {/* Join Date */}
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

        {/* Resign Date */}
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
  );
}
