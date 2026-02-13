import { UUID } from "./common";

export interface EmployeeShift {
    uuid: UUID;
    shift_date: string;
    employee: {
        uuid: UUID;
        nik: string;
        name: string;
        profile_photo?: string;
    };
    shift_template: {
        uuid: UUID;
        name: string;
        start_time: string;
        end_time: string;
    };
    created_at: string;
}

export interface EmployeeShiftInput {
    uuid?: UUID;
    employee_nik: string;
    shift_template_uuid: UUID;
    shift_date: string;
}