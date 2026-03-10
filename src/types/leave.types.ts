import { UUID } from "./common";

export interface LeaveInput {
  uuid?: UUID;
  leave_type_uuid: string;
  date_start: string;
  date_end: string;
  reason: string;
  attachment?: File | LeaveAttachment | null;
  is_half_day?: boolean;
  employee_nik?: string;
  approval_status?: 0 | 1 | 2;
}

export interface LeavePermissions {
  update: boolean;
  delete: boolean;
  approve: boolean;
}

export interface Leave {
  uuid: UUID;
  current_approval_uuid?: string;
  employee_name: string;
  employee_nik: string;
  leave_type: string;
  leave_type_uuid: string;
  date_start: string;
  date_end: string;
  reason: string;
  attachment?: LeaveAttachment | null;
  approval_status: 0 | 1 | 2;
  is_half_day: boolean;
  duration: number;
  duration_label: string;
  current_level: number;
  next_approver: string | null;
  approval_levels: {
    level: number;
    status: number;
    nama_approver: string;
  }[];

  can: LeavePermissions;
}

export interface LeaveAttachment {
  exists: boolean;
  filename: string;
  download_url?: string;
  path?: string;
}

export type ApprovalStatus = 0 | 1 | 2; // 0: Pending, 1: Approved, 2: Rejected

export interface LeaveApprover {
  uuid: UUID;
  name: string;
  role: string;
}

export interface LeaveApprovalLog {
  uuid: UUID;
  approver: LeaveApprover;
  level: number;
  status: ApprovalStatus;
  approved_at: string | null;
  note: string | null;
}

export interface LeaveBalance {
  year: number;
  total_days: number;
  used_days: number;
  remaining_days: number;
}

export interface LeaveDetail {
  uuid: UUID;
  employee: {
    name: string;
    nik: string;
    role: string;
  };
  leave_type: {
    uuid: UUID;
    name: string;
    default_days: number;
    is_active: boolean;
    gender: string | null;
    requires_family_status: boolean;
  };
  date_start: string; // format Y-m-d
  date_end: string; // format Y-m-d
  is_half_day: boolean;
  reason: string;
  attachment: LeaveAttachment | null;
  approval_status: ApprovalStatus;
  next_approver: string | null;
  approvals: LeaveApprovalLog[];
  employee_leave_detail: {
    start_date: string;
    end_date: string;
    days_taken: number;
    status: string;
  } | null;
  leave_balance: LeaveBalance | null;
}
