import { UUID } from "./common";

export interface Overtime {
    uuid: UUID;
    employee_name: string;
    employee_nik: string;
    date: string;
    duration_minutes: number;
    reason: string;
    status: number;
    status_label: string;
    approved_by: string;
    approved_at: string;
    can: OvertimePermissions;
}

export interface OvertimePermissions {
    update: boolean;
    delete: boolean;
    approve: boolean;
}

export interface OvertimeDetail {
    uuid: UUID;
    employee: {
        name: string;
        nik: string;
        division: string;
        team: string;
    };
    attendance: {
        date: string;
        clock_in: string;
        clock_out: string;
    };
    duration_minutes: number;
    reason: string;
    status: number;
    status_label: string;
    approved_by: {
        name: string;
    }
    approved_at: string;
    note: string;
}

export interface OvertimeInput {
    uuid?: UUID;
    employee_nik?: string;
    reason: string;
}