import { UUID } from "./common";

export interface LeaveType {
    uuid: UUID;
    name: string;
    is_active: boolean;
    default_days: number;
    requires_family_status: boolean;
    gender: "male" | "female" | "all";
    creator: {
        uuid: UUID;
        name: string
    };
    created_at: string;
    updated_at: string;
}

export interface LeaveTypeInput {
    uuid?: UUID;
    name: string;
    is_active: boolean;
    default_days: number;
    requires_family_status: boolean;
    gender: "male" | "female" | "all";
}