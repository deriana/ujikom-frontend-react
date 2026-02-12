import { UUID } from "./common";

export interface EmployeeWorkSchedule {
  uuid: UUID;
  employee: {
    profile_photo?: string | undefined;
    uuid?: string;
    name: string;
    nik: string;
  };
  work_schedule: {
    uuid: string;
    name: string;
    work_mode: {
      name: string;
    };
  };
  start_date: string;
  end_date: string;
  is_active_today: boolean;
  updated_at: string | number | Date;
}

export interface EmployeeWorkScheduleInput {
  uuid?: UUID;
  employee_nik?: string;
  work_schedule_uuid: string;
  start_date: string;
  end_date?: string | null;
}
