import React, { useState, useEffect } from "react";
import { Modules, RoleInput } from "@/types/role.types";
import Switch from "@/components/form/switch/Switch";
import Input from "@/components/form/input/InputField";

interface RoleFieldProps {
  modules: Modules[];
  initialData?: RoleInput;
  onChange: (data: RoleInput) => void;
}

const RoleField: React.FC<RoleFieldProps> = ({
  modules,
  initialData,
  onChange,
}) => {
  const [roleName, setRoleName] = useState(initialData?.name || "");
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    initialData?.permissions || []
  );

  // Sinkronisasi saat initialData berubah
  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.name);
      setSelectedPermissions(initialData.permissions);
    }
  }, [initialData]);

  useEffect(() => {
    onChange({
      name: roleName,
      permissions: selectedPermissions,
    });
  }, [roleName, selectedPermissions]);

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleModule = (modulePermissions: number[]) => {
    const allSelected = modulePermissions.every((id) =>
      selectedPermissions.includes(id)
    );

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !modulePermissions.includes(id))
      );
    } else {
      setSelectedPermissions((prev) => [
        ...prev,
        ...modulePermissions.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Name */}
      <div>
        <label
          htmlFor="roleName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Role Name
        </label>
        <Input
          type="text"
          id="roleName"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-blue-400 sm:text-sm"
          placeholder="Enter role name"
        />
      </div>

      {/* Modules + permissions */}
      <div className="space-y-4">
        {modules.map((module) => {
          const modulePermissionIds = module.permissions.map((p) => p.id);
          const allSelected = modulePermissionIds.every((id) =>
            selectedPermissions.includes(id)
          );

          return (
            <div
              key={module.id}
              className="border rounded-md p-4 dark:border-gray-600"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">
                  {module.name}
                </h3>
                <Switch
                  label="Select All"
                  checked={allSelected}
                  onChange={() => toggleModule(modulePermissionIds)}
                  color="blue"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {module.permissions.map((perm) => (
                  <Switch
                    key={perm.id}
                    label={perm.name}
                    checked={selectedPermissions.includes(perm.id)}
                    onChange={() => togglePermission(perm.id)}
                    color="blue"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoleField;
