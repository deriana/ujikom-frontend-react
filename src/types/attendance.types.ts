export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  clock_in: string | null;
  clock_out: string | null;
  latitude_in: string | null;
  longitude_in: string | null;
  latitude_out: string | null;
  longitude_out: string | null;
  work_minutes: number | null;
  status: 'present' | 'absent' | 'late';
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
    status: 'Success' | 'Failed';
    message?: string;
  }[];
}