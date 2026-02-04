import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import { Modules, RoleInput } from "@/types/role.types";

interface RoleFieldProps {
  value: RoleInput;
  onChange: (val: RoleInput) => void;
  modules: Modules[];
  disabled?: boolean;
}

export default function RoleField({
  value,
  onChange,
  modules,
  disabled = false,
}: RoleFieldProps) {
  const togglePermission = (id: number) => {
    const exists = value.permissions.includes(id);

    const newPermissions = exists
      ? value.permissions.filter((p) => p !== id)
      : [...value.permissions, id];

    onChange({ ...value, permissions: newPermissions });
  };

  const toggleModule = (module: Modules) => {
    const ids = module.permissions.map((p) => p.id);
    const allSelected = ids.every((id) => value.permissions.includes(id));

    const newPermissions = allSelected
      ? value.permissions.filter((p) => !ids.includes(p))
      : [...new Set([...value.permissions, ...ids])];

    onChange({ ...value, permissions: newPermissions });
  };

  return (
    <div className="space-y-6">
      {/* Role Name */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
          Role Name
        </label>
        <Input
          value={value.name}
          disabled={disabled}
          placeholder="Enter role name"
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>

      {/* Permissions */}
      <div className="space-y-5">
        {modules.map((module) => {
          const ids = module.permissions.map((p) => p.id);
          const allChecked = ids.every((id) =>
            value.permissions.includes(id)
          );

          return (
            <div
              key={module.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm 
                         dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold capitalize text-gray-800 dark:text-white/90">
                  {module.name}
                </h3>

                <Checkbox
                  checked={allChecked}
                  onChange={() => toggleModule(module)}
                  label="Select All"
                  disabled={disabled}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3">
                {module.permissions.map((permission) => (
                  <Checkbox
                    key={permission.id}
                    id={`perm-${permission.id}`}
                    checked={value.permissions.includes(permission.id)}
                    onChange={() => togglePermission(permission.id)}
                    label={permission.name}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
