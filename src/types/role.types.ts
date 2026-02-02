export interface Role {
  id: number;
  name: string;
  permissions: Permissions[];
  system_reserve: boolean;
}

export interface Permissions {
    id: number;
    name: string;
}

export interface Modules {
  id: number;
  name: string;
  actions: Permissions[];
}

export interface RoleInput {
  name: string;
  permissions: number[];
}