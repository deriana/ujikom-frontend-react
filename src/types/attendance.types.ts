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
}

export interface AttendanceInput {
  descriptor: number[] | string;
  photo: File;
  latitude: number;
  longitude: number;
}

export interface IndividualDetection {
  descriptor: number[] | string;
  photo: Blob | File; // Gunakan Blob jika hasil crop dari canvas
}

export interface BulkAttendanceInput {
  attendances: IndividualDetection[];
  latitude: number;
  longitude: number;
}

// Tambahkan ini di types/attendance.types.ts
export interface BulkAttendanceResponse {
  success_count: number;
  failed_count: number;
  details: {
    name?: string;
    status: "Success" | "Failed";
    message?: string;
  }[];
}
