import { AllowancePositionPivot, UUID } from "./common";

/** ===== Position & Team ===== */
export interface Position {
  uuid?: UUID;
  name: string;
  base_salary: string;
  allowances?: AllowancePositionPivot[];
}

export interface Team {
  uuid?: UUID;
  name: string;
  division: string;
}

export interface Manager {
  uuid?: UUID;
  name: string;
  nik: string;
  role: string;
  position: string;
}

export interface EmployeeLite {
  nik: string;
  name: string;
  profile_photo?: string;
}

/** ===== Employee Status (from backend enum EmployeeStatus) ===== */
export enum EmployeeStatusEnum {
  PERMANENT = 0,
  CONTRACT = 1,
  INTERN = 2,
  PROBATION = 3,
}

export type EmployeeStatusColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

export interface EmployeeStatusMeta {
  label: string;
  color: EmployeeStatusColor;
}

export const employeeStatusMap: Record<EmployeeStatusEnum, EmployeeStatusMeta> = {
  [EmployeeStatusEnum.PERMANENT]: { label: "Permanent", color: "success" },
  [EmployeeStatusEnum.CONTRACT]: { label: "Contract", color: "info" },
  [EmployeeStatusEnum.INTERN]: { label: "Intern", color: "light" },
  [EmployeeStatusEnum.PROBATION]: { label: "Probation", color: "warning" },
};

/** ===== Employment State (from backend enum EmploymentState) ===== */
export enum EmploymentStateEnum {
  ACTIVE = "active",
  RESIGNED = "resigned",
  TERMINATED = "terminated",
}

export interface EmploymentStateMeta {
  label: string;
  color: EmployeeStatusColor;
}

export const employmentStateMap: Record<EmploymentStateEnum, EmploymentStateMeta> = {
  [EmploymentStateEnum.ACTIVE]: { label: "Active", color: "success" },
  [EmploymentStateEnum.RESIGNED]: { label: "Resigned", color: "warning" },
  [EmploymentStateEnum.TERMINATED]: { label: "Terminated", color: "error" },
};

export interface LeaveBalance {
  leave_type: string;
  year: number;
  total_days: number;
  used_days: number;
  remaining_days: number;
  is_unlimited?: boolean;
}

/** ===== Employee ===== */
export interface Employee {
  nik: string;
  profile_photo?: string;
  status: EmployeeStatusEnum;
  statusMeta?: EmployeeStatusMeta;
  base_salary: string;
  position: Position;
  team: Team;
  manager: Manager;
  phone?: string;
  gender?: "male" | "female";
  date_of_birth?: string;
  address?: string;
  join_date?: string;
  resign_date?: string | null;
  contract_start?: string | null;
  contract_end?: string | null;
  employment_state: EmploymentStateEnum;
  termination_date?: string | null;
  termination_reason?: string | null;
  has_face_descriptor?: boolean;
  leave_balances?: LeaveBalance[];
}

export interface EmployeeLeavaBalances {
  uuid: UUID;
  profile_photo?: string;
  nik: string;
  name: string;
  email: string;
  position: string;
  leave_balances: LeaveBalance[];
}