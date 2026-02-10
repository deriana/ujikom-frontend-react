import { AllowancePositionPivot, UserLite, UUID } from "./common";

export interface AllowanceInput {
  uuid?: UUID;
  name: string;
  type: "fixed" | "percentage";
  amount: number;
}

export interface Allowance {
  uuid: UUID;
  name: string;
  type: "fixed" | "percentage";
  amount: number;
  positions: AllowancePositionPivot[];
  creator: UserLite;
  created_at: string ;
  updated_at: string ;
}

export interface AllowanceTypeMeta {
  label: string;
  color: "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";
}

export type AllowanceType = "fixed" | "percentage";
export type AllowanceTypeMap = Record<AllowanceType, AllowanceTypeMeta>;
