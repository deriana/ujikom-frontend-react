export interface Role {
  map: any;
  id: number;
  name: string;
  permissions: Permissions[];
  system_reserve: boolean;
}

export interface Permissions {
    id: number;
    name: string;
    guard_name?: string;
    module_name?: string;
}

export interface Modules {
    id: number;
    name: string;
    actions?: string | null;
    permissions: Permissions[];
}

export interface RoleInput {
  name: string;
  permissions: number[];
}