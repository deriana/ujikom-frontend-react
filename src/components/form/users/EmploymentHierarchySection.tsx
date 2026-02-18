import Select from "@/components/form/Select";
import SelectDivisionTeam from "@/components/form/users/SelectDivisionsTeam";
import DatePicker from "@/components/form/date-picker";
import { UserInput, Division, Position, Manager } from "@/types";
import { Briefcase, ShieldCheck, Calendar, Clock } from "lucide-react";

interface Props {
  value: UserInput;
  onChange: (val: UserInput) => void;
  roles: { id: number; name: string; system_reserve: boolean}[];
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
  // 1. Filter Divisions & Positions yang bukan System Reserve
  const filteredDivisions = divisions.filter((d) => !!d.system_reserve !== true);
  const filteredPositions = positions.filter((p) => !!p.system_reserve !== true);
  const filteredRoles = roles.filter((r) => !!r.system_reserve !== true);

  // - Kalau role 'manager', atasan cuma boleh 'director'
  // - Kalau role 'employee'/'staff', atasan boleh 'manager' atau 'director'
  const filteredManagers = managers.filter((m) => {
    if (value.role?.toLowerCase() === "manager") {
      return m.role?.toLowerCase() === "director";
    }
    // Default: tampilkan semua manager & director untuk staff biasa
    return true;
  });

  return (
    <section className="space-y-6">
      {/* ... bagian header tetap sama ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Access Role */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Access Role
          </label>
          <Select
            options={filteredRoles.map((r) => ({
              value: r.name.toLowerCase(),
              label: r.name.charAt(0).toUpperCase() + r.name.slice(1),
            }))}
            value={value.role || ""}
            onChange={(val) => {
              onChange({
                ...value,
                role: val || undefined,
                // Reset manager_nik jika role berubah supaya tidak salah atasan
                manager_nik: undefined,
              });
            }}
            disabled={disabled}
          />
        </div>

        {/* Division & Team - Menggunakan data yang sudah difilter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Division & Team
          </label>
          <SelectDivisionTeam
            divisions={filteredDivisions} // Pakai yang sudah di-filter
            value={value.team_uuid || ""}
            onChange={(val) =>
              onChange({ ...value, team_uuid: val || undefined })
            }
            disabled={disabled}
          />
        </div>

        {/* Job Position - Menggunakan data yang sudah difilter */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Job Position
          </label>
          <Select
            options={filteredPositions.map((p) => ({
              value: p.uuid,
              label: p.name,
            }))}
            value={value.position_uuid || ""}
            onChange={(val) =>
              onChange({ ...value, position_uuid: val || undefined })
            }
            disabled={disabled}
          />
        </div>

        {/* Direct Manager - Selalu tampilkan kecuali role Director */}
        {value.role?.toLowerCase() !== "director" && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Direct Manager
            </label>
            <Select
              options={filteredManagers.map((m) => ({
                value: m.nik,
                label: `${m.name} (${m.position})`,
              }))}
              value={value.manager_nik || ""}
              onChange={(val) =>
                onChange({ ...value, manager_nik: val || undefined })
              }
              disabled={disabled}
              placeholder={
                value.role?.toLowerCase() === "manager"
                  ? "Select Director"
                  : "Select Manager/Director"
              }
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
            onChange={(_, dateStr) =>
              onChange({ ...value, join_date: dateStr })
            }
          />
        </div>

        {/* Resign Toggle */}
        <div className="space-y-1.5">
          {value.isResigned && (
            <>
              <label
                htmlFor="resign_date_picker"
                title="Only fill this if the employee has resigned"
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400"
              >
                <Clock size={12} /> Resign Date
              </label>

              <DatePicker
                id="resign_date_picker"
                placeholder="Select resign date"
                value={value.resign_date || ""}
                onChange={(_, dateStr) =>
                  onChange({ ...value, resign_date: dateStr || null })
                }
                disabled={disabled}
              />

              {value.resign_date && (
                <button
                  type="button"
                  onClick={() => onChange({ ...value, resign_date: null })}
                  className="text-sm text-red-500 hover:underline mt-1"
                >
                  Clear Resign Date
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
