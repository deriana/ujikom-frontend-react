import { UUID } from "./common";

export interface Attendance {
  id: number;
  employee: {
    nik: string | null;
    name: string | null;
    email: string | null;
    profile_photo: string | null;
  };
  date: string;
  status: string | null;
  clock_in: string | null;
  clock_out: string | null;
  late_minutes: number | null;
  early_leave_minutes: number | null;
  work_minutes: number | null;
  overtime_minutes: number | null;
  clock_in_photo: string | null;
  clock_out_photo: string | null;
  location_in: {
    latitude: number | null;
    longitude: number | null;
  };
  location_out: {
    latitude: number | null;
    longitude: number | null;
  };
  is_corrected?: boolean;
  correction?: AttendanceCorrectionDetail;
  can: {
    update: boolean;
    delete: boolean;
  }
}

export interface AttendanceInput {
  descriptor: number[] | string;
  photo: File;
  latitude: number;
  longitude: number;
}

export interface IndividualDetection {
  descriptor: number[] | string;
  photo: Blob | File;
}

export interface BulkAttendanceInput {
  attendances: IndividualDetection[];
  latitude: number;
  longitude: number;
}

export interface SingleAttendanceInput {
  descriptor: number[] | string;
  photo: Blob | File;
  latitude: number;
  longitude: number;
}

export interface SingleAttendanceResponse {
  success: boolean;
  message: string;
}

export interface ManualAttendanceInput {
  reason: string;
  attachment: File | null;
  latitude: number;
  longitude: number;
}

export interface ManualAttendanceResponse {
  success: boolean;
  message: string;
}

export interface BulkAttendanceResponse {
  success_count: number;
  failed_count: number;
  details: {
    name?: string;
    status: "Success" | "Failed";
    message?: string;
  }[];
}

export interface AttendanceCorrectionAttachment {
  exists: boolean;
  filename: string;
  download_url?: string;
  path?: string;
}


export interface AttendanceCorrectionInput {
  uuid?: UUID;
  attendance_id?: number;
  clock_in_requested?: string;
  clock_out_requested?: string;
  reason: string;
  attachment?: File | AttendanceCorrectionAttachment | null;
  employee_nik?: string;
}

export interface AttendanceCorrection {
  uuid: UUID;
  attendance_id: number;
  employee_name: string ;
  employee_nik: string | null;
  attendance_date: string | null;
  actual_clock_in: string | null;
  actual_clock_out: string | null;
  clock_in_requested: string | null;
  clock_out_requested: string | null;
  reason: string;
  attachment: AttendanceCorrectionAttachment | null;
  status: number;
  status_label: string;
  note: string | null;
  approver_name: string | null;
  approved_at: string | null;
  can: {
    update: boolean;
    delete: boolean;
    approve: boolean;
  };
  created_at: string;
}

export interface AttendanceCorrectionDetail {
  uuid: UUID;
  attendance: {
    actual_clock_in: string | null;
    actual_clock_out: string | null;
  };
  requested_times: {
    clock_in: string | null;
    clock_out: string | null;
  };
  reason: string;
  attachment: {
    exists: boolean;
    filename: string;
    path: string;
  } | null;
  status: number;
  approval: {
    approved_by_name: string | null;
    approved_at: string | null;
    note: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface AttendanceLogs {
  id: number;
  employee_id: number;
  employee_nik: number;

  status: string;
  action: string;
  reason: string;

  similarity_score: any;
  ip_address: string;
  user_agent: string;

  location: {
    latitude: number;
    longitude: number;
  }

  employee: {
    nik: string;
    name:string
  }

  created_at: string;
  time_ago: any;
}
