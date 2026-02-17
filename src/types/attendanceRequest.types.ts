import { UUID } from "./common";

export type RequestType = 'SHIFT' | 'WORK_MODE';

export interface AttendanceRequestInput {
    uuid?: UUID;
    employee_nik?: string;
    request_type: RequestType;
    reason: string;
    shift_template_uuid?: UUID;
    work_schedule_uuid?: UUID;
    start_date: string;
    end_date?: string | null;
}

export interface AttendanceRequest {
    uuid: UUID;
    request_type: RequestType;
    reason: string;
    status: number;
    start_date: string;
    end_date: string | null; 
    employee: {
        name: string;
        nik: string;
    };
    shift_details?: {
        uuid: UUID;
        name: string;
    };
    work_schedule_details?: {
        uuid: UUID;
        name: string;
    };
    approved_by?: {
        name: string;
    };
    can: AttendanceRequestPermission;
    created_at: string;
}

export interface AttendanceRequestPermission {
    update: boolean;
    delete: boolean;
    approve: boolean;
}

export interface AttendanceRequestDetail extends Omit<AttendanceRequest, 'can' | 'shift_details' | 'work_schedule_details'> {
    note: string | null;
    employee: AttendanceRequest['employee'] & {
        position: string | null;
    };
    change_details: ShiftChangeDetail | WorkScheduleChangeDetail | null;
    approval_info: {
        is_processed: boolean;
        approver_name: string | null;
        processed_at: string;
    };
}

export interface ShiftChangeDetail {
    type: 'shift';
    template_name: string;
    start_time: string;
    end_time: string;
    late_tolerance: string;
    is_cross_day: boolean;
}

export interface WorkScheduleChangeDetail {
    type: 'work_schedule';
    schedule_name: string;
    work_mode: string;
    times: {
        work: string;
        break: string;
    };
    requires_location: boolean;
}