import { UUID } from "./common";

export interface Payroll {
    uuid: UUID;
    employee_name: string;
    employe_nik: string;
    period_start: string;
    period_end: string;
    net_salary: number;
    gross_salary: number;
    adjustment_note: string;
    manual_adjustment: number;
    status: number;
    can: PayrollPermission;
    created_at: string;
    updated_at: string;
}

export interface PayrollPermission {
    pay: boolean;
    update: boolean;
}

export interface PayrollUpdateInput {
    uuid?: UUID
    manual_adjustment?: number
    adjustment_note?: string
}

export interface PayrollCreateInput {
  month: string; // Format: "2024-03"
  employee_niks: string[]; 
}

export interface PayrollFormState extends Partial<PayrollCreateInput>, Partial<PayrollUpdateInput> {
  uuid?: string;
  employee_name?: string; 
}

export interface PayrollDetail {
  uuid: UUID;

  status: PayrollStatus;
  finalized_at: string | null;

  employee: EmployeeInfo;

  period: PayrollPeriod;

  earnings: PayrollEarnings;

  deductions: PayrollDeductions;

  tax_summary: PayrollTaxSummary;

  summary: PayrollFinalSummary;

  adjustment_note: string | null;

  created_at: string;
  updated_at: string;
}

export interface PayrollStatus {
  code: number;
label: PayrollStatusEnum;
  is_editable: boolean;
}

export interface EmployeeInfo {
  nik: string;
  name: string;
  phone: string | null;
  employment_status: string | null;
  join_date: string | null;

  position: {
    name: string | null;
    base_salary_position: number | null;
  };

  profile_photo: string | null;
}

export interface PayrollPeriod {
  start: string;
  end: string;
  days: number | null;
}

export interface PayrollEarnings {
  base_salary: number;

  allowances: PayrollAllowance[];
  assessment_bonus: number;
  allowance_total: number;
  overtime_pay: number;
  manual_adjustment: number;

  gross_salary: number;
}

export interface PayrollAllowance {
  name: string;
  type: string; // could narrow later if enum exists
  amount: number;
}

export interface PayrollDeductions {
  late_deduction: number;
  early_leave_deduction: number;
  total_attendance_deduction: number;

  tax_amount: number;

  total_deduction: number;
}

export interface PayrollTaxSummary {
  ptkp: number;
  taxable_income: number;
  tax_rate_percent: number;
  tax_rate_decimal: number | null;
  tax_amount: number;
}

export interface PayrollFinalSummary {
  gross_salary: number;
  total_deduction: number;
  net_salary: number;
}

export enum PayrollStatusEnum {
  DRAFT = "Draft",
  FINALIZED = "Finalized",
  VOIDED = "Voided"
}