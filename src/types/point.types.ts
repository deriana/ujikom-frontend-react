import { UUID } from "./common";

export interface Employee {
    id: number;
    uuid: UUID;
    nik: string;
    user_id: number;
    employee_name?: string; 
    photo_url?: string;      
    position_id?: number;
    team_id?: number;
    employment_state: string;
}

export interface PointRule {
    uuid: UUID;
    event_name: string;
    points: number;
    description: string | null;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface PointRuleInput {
    uuid?: UUID;
    event_name: string;
    points: number;
    description?: string;
    is_active: boolean;
}

export interface PointPeriode {
    uuid: UUID;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export interface PointTransaction {
    uuid: UUID;
    employee_id: number;
    point_rule_id: number;
    point_period_id: number;
    current_points: number;
    created_at: string;
    employee?: Employee;
    rule?: PointRule;
    period?: PointPeriode;
}

export interface LeaderboardUser {
    employee_id: number;
    user_id: number;
    employee_name: string;
    total_points: number;
    photo_url: string;
}