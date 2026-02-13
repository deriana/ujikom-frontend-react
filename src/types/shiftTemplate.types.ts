import { UUID } from "./common";

export interface ShiftTemplate {
  uuid: UUID;
  name: string;
  start_time: string;
  end_time: string;
  cross_day: boolean;
  late_tolerance_minutes?: number;
  employee_shifts_count: number;
  creator?: {
    uuid: UUID;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ShiftTemplateInput {
  uuid?: UUID;
  name: string;
  start_time: string;
  end_time: string;
  cross_day: boolean;
  late_tolerance_minutes?: number;
}
