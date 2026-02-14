import { UUID } from "./common";
import { Role } from "./role.types";

export interface User {
  uuid: UUID;
  name: string;
  email: string;
  roles: Role[];
  employee?: {
    position?: { name: string };
    nik?: string;
    team?: {
      name: string;
      division?: { name: string };
    };
    profile_photo?: string;
    manager?: {
      user?: {
        name: string;
      };
    };
  };
}
