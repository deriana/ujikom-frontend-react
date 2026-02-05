import { AllowancePositionPivot, UserLite, UUID } from "./common";

export interface PositionInput {
    uuid?: UUID;
    name: string;
    base_salary: number;
    allowances: AllowancePositionPivot[];
}

export interface Position {
    uuid: UUID;
    name: string;
    base_salary: number;
    creator: UserLite;
    created_at: string;
    updated_at: string;
    allowances: AllowancePositionPivot[];
}