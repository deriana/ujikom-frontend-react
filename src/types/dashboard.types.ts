export interface EmployeeStats {
  total: number;
  aktif: number;
  resign_bulan_ini: number;
  baru_bulan_ini: number;
}

export interface AttendanceToday {
  hadir: number;
  cuti: number;
  terlambat: number;
  tanpa_keterangan: number;
}

export interface LeaveSummary {
  disetujui: number;
  ditolak: number;
  pending: number;
  sisa_cuti: number;
}

export interface PendingTasks {
  cuti: number;
  lembur: number;
  attendance_request: number;
}

export interface MapLocation {
  name: string;
  lat: string | number | null;
  lng: string | number | null;
  time: string;
}

export interface MonthlyChart {
  hadir: number[];
  absent: number[];
}

export interface OfficeLocation {
  lat: number;
  lng: number;
  radius_meters: number;
}

export interface AdminDashboardData {
  employee_stats: EmployeeStats;
  attendance_today: AttendanceToday;
  leave_summary: LeaveSummary;
  pending_tasks: PendingTasks;
  map_locations: MapLocation[];
  monthly_chart: MonthlyChart;
  office_location: OfficeLocation;
}

export interface EmployeeProfile {
  name: string;
  nik: string;
  position: string;
  team: string;
  division: string;
  profile_photo: string | null;
}

export interface PersonalStats {
  sisa_cuti: number;
  total_terlambat: number;
  total_menit_lembur: number;
  total_menit_kerja: number;
  kehadiran_bulan_ini: number;
}

export interface OvertimeLog {
  date: string;
  duration: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | string;
}

export interface LeaveLog {
  type: string;
  date_range: string;
  status: string;
  reason: string;
}

export interface Attendance {
  id: number;
  employee_id: number;
  date: string;
  status: string;
  late_minutes: number;
  work_minutes: number;
  overtime_minutes: number;
}

export interface YearlyAttendanceChart {
  presence: number[];
  late: number[];
}

export interface PendingRequest {
  leave: number;
  overtime: number;
  attendance_request: number;
  // total: number;
}

export interface PendingApprovalItem {
  id: string;
  title: string;
  subtitle: string;
  type: "leave" | "overtime" | "attendance";
  status: string;
}

export interface PendingCounts {
  leave: number;
  overtime: number;
  attendance_request: number;
}

export interface SalaryLog {
  uuid: string;
  period: string;
  payment_date: string;
  net_salary: number;
  formatted_net_salary: string;
  status: number;
}

export interface TodaySchedule {
  date: string;
  is_workday: boolean;
  label: string;
  work_start: string;
  work_end: string;
  tolerance: string;
  must_at_office: boolean;
}

export interface EmployeeDashboardData {
  profile: EmployeeProfile;
  personal_stats: PersonalStats;
  recent_attendance: Attendance[];
  pending_requests: PendingRequest;
  yearly_attendance_chart: YearlyAttendanceChart;
  today_schedule: TodaySchedule;
  logs: {
    overtime: OvertimeLog[];
    leave: LeaveLog[];
    salary: SalaryLog[];
  };
}

export interface MobileHomeData {
  attendance_status: {
    is_checked_in: boolean;
    is_checked_out: boolean;
    clock_in_time: string;
    clock_out_time: string;
    attendance_id: number | null;
  };
  today_schedule: TodaySchedule;
  office: {
    lat: number;
    lng: number;
    radius: number;
  };
  activities: Array<{
    type: string;
    time: string;
    label: string;
    status: string;
  }>;
}

export interface WeeklyTrend {
  day: string;
  work_minutes: number;
  status: 'present' | 'absent' | 'leave' | 'late' | string; 
}
export interface SalaryLog {
  period: string;       
  net_salary: number;
  status: number;      
}
export interface UpcomingHoliday {
  uuid: string;
  name: string;
  date: string;         
  is_recurring: boolean | number;
}
export interface MobileStatsData {
  personal_stats: PersonalStats;
  weekly_trend: WeeklyTrend[];
  salary_logs: SalaryLog[];
  upcoming_holidays: UpcomingHoliday[];
}

export interface MobileDailyTrackerData {
  tracker: {
    date: string;
    clock_in: {
      time: string;
      is_done: boolean;
      late_minutes: number;
      status: string;
    };
    clock_out: {
      time: string;
      is_done: boolean;
      status: string;
      early_leave_minutes: number;
      is_early_leave_approved: boolean;
    };
    overtime: {
      is_requested: boolean;
      minutes: number;
      reason: string;
      status: string;
    };
    early_leave: {
      is_requested: boolean;
      minutes: number;
      reason: string;
      status: string;
    };
    leave: {
      is_on_leave: boolean;
      type: string;
      reason: string;
      status: string;
    };
    work_duration: {
      work_minutes: number;
      formatted_work: string;
      overtime_minutes?: number;
      formatted_overtime?: string;
    };
    payday_info: {
      next_payday: string;
      days_remaining: number;
    };
    holiday_info: {
      is_holiday: boolean;
      holiday_name: string | null;
    };
    annual_leave_summary: Array<{
      type: string;
      start: string;
      end: string;
      status: string;
      is_upcoming: boolean;
    }>;
  };
  timeline: Array<{
    time: string | null;
    event: string;
    desc: string;
  }>;
  schedule: {
    start: string;
    end: string;
    label: string;
  };
  yearly_holidays: Array<{
    full_date: string;
    name: string;
    date: string;
  }>;
  my_approved_leaves: Array<{
    type: string;
    start: string;
    end: string;
    status: string;
    is_upcoming: boolean;
  }>;
  upcoming_holidays: Array<{
    name: string;
    date: string;
    days_away: number;
  }>;
}
