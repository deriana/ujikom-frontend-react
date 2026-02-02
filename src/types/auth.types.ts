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

export interface User {
  uuid: string;
  name: string;
  email: string;
  roles: Role[];
  employee?: {
    position?: { name: string };
    team?: {
      name: string;
      division?: { name: string };
    };
    manager?: {
      user?: {
        name: string;
      };
    };
  };
}
