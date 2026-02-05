import { UUID } from "./common";
import { Role } from "./role.types";

export interface User {
  uuid: UUID;
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
