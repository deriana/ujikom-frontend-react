import { UUID } from "./common";
import { Employee, EmployeeStatusEnum } from "./employee.types";

export interface UserLite {
  uuid: UUID;
  name: string;
  email: string;
}

export interface User {
  uuid: UUID;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  roles: string[];
  employee: Employee;
}

export interface UserInput {
  name: string;
  email: string;
  password?: string; // nullable / optional
  password_confirmation?: string;

  is_active?: boolean; 

  role_uuid?: UUID;
  team_uuid?: UUID;
  position_uuid?: UUID;
  manager_nik?: string;

  employee_status: EmployeeStatusEnum;
  contract_start?: string; // "YYYY-MM-DD"
  contract_end?: string | null;
  base_salary?: number;

  phone?: string;
  gender?: "male" | "female" | "other";
  date_of_birth?: string;
  address?: string;
  join_date?: string;
  resign_date?: string | null;
}