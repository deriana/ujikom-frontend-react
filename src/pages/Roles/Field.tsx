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
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Section: Role Name */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all">
        <label className="block text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
          Informasi Role
        </label>
        <Input
          value={value.name}
          disabled={disabled}
          placeholder="Contoh: Admin Gudang, Manager Marketing..."
          className="text-lg font-medium"
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="h-6 w-1.5 bg-blue-600 rounded-full"></span>
          Pengaturan Izin Modul
        </h2>

        {/* Permissions Grid */}
        <div className="grid grid-cols-1 gap-6">
          {modules.map((module) => {
            const ids = module.permissions.map((p) => p.id);
            const allChecked = ids.every((id) => value.permissions.includes(id));

            return (
              <div
                key={module.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 
                  ${allChecked 
                    ? "border-blue-200 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-900/10" 
                    : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
                  } hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700`}
              >
                {/* Module Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${allChecked ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                      {/* Simbol folder/modul sederhana */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-bold capitalize text-gray-900 dark:text-white">
                        {module.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {ids.filter(id => value.permissions.includes(id)).length} dari {ids.length} akses aktif
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <Checkbox
                      checked={allChecked}
                      onChange={() => toggleModule(module)}
                      label={<span className="text-xs font-bold uppercase tracking-tight">Pilih Semua</span>}
                      disabled={disabled}
                    />
                  </div>
                </div>

                {/* Permissions Inner Grid */}
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {module.permissions.map((permission) => {
                    const isActive = value.permissions.includes(permission.id);
                    return (
                      <div 
                        key={permission.id}
                        className={`flex items-center p-3 rounded-xl border transition-all ${
                          isActive 
                          ? "border-blue-100 bg-blue-50/50 dark:bg-blue-500/5 dark:border-blue-500/20" 
                          : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <Checkbox
                          id={`perm-${permission.id}`}
                          checked={isActive}
                          onChange={() => togglePermission(permission.id)}
                          label={
                            <span className={`ml-1 text-sm ${isActive ? "font-semibold text-blue-700 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
                              {permission.name}
                            </span>
                          }
                          disabled={disabled}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}