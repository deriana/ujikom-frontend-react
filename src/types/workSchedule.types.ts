import { UserLite, UUID, WorkMode } from "./common";

export interface WorkSchedule {
  uuid: UUID;
  name: string;
  work_mode?: WorkMode | null;
  total_employees?: number;
  work_start_time?: string; // format "HH:mm"
  work_end_time?: string; // format "HH:mm"
  requires_office_location?: boolean;
  creator?: UserLite | null; // user yang membuat schedule
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface WorkScheduleInput {
  uuid?: UUID;
  name: string;
  work_mode_id: number |undefined;
  work_start_time: string;
  work_end_time: string;
  requires_office_location: boolean;
}
