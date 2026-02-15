import { UUID } from "./common";

export interface EarlyLeave {
  uuid: UUID;
  employee_name: string;
  employee_nik: string;
  reason: string;
  date: string;
  minutes_early: number;
  status: number;
  approved_at: string;
  can: EarlyLeavePermissions;
}

export interface EarlyLeavePermissions {
  update: boolean;
  delete: boolean;
  approve: boolean;
}


export interface EarlyLeaveInput {
  uuid?: UUID;
  employee_nik?: string;
  attachment?: File | EarlyLeaveAttachment | null;
  reason: string;
}

export interface EarlyLeaveAttachment {
  exists: boolean;
  filename: string;
  download_url?: string;
  path?: string;
}

export interface EarlyLeaveDetail {
  uuid: UUID;
  date: string;
  employee: {
    name: string;
    nik: string;
  };
  minutes_early: number;
  reason: string;
  attachment: EarlyLeaveAttachment | null;
  status: string;
  approval: {
    approved_by_name: string;
    approved_at: string;
    note?: string;
  };
}
