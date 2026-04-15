import { UUID } from "./common";
import { PointCategory } from "@/constants/PointCategory";

export interface Employee {
    id: number;
    uuid: UUID;
    nik: string;
    employee_name?: string; 
    photo_url?: string;      
    position_id?: number;
    team_id?: number;
    employment_state: string;
}

export interface PointRule {
    uuid: UUID;
    category: PointCategory;
    event_name: string;
    points: number;
    operator: '<' | '<=' | '>' | '>=' | '==' | 'BETWEEN';
    min_value: number | null;
    max_value: number | null;
    description: string | null;
    is_active: boolean;
    system_reserve: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface PointRuleInput {
    uuid?: UUID;
    category: PointCategory;
    event_name: string;
    points: number;
    operator: '<' | '<=' | '>' | '>=' | '==' | 'BETWEEN';
    min_value?: number | null;
    max_value?: number | null;
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
    employee_nik: string;
    point_rule_id: number;
    point_period_id: number;
    current_points: number;
    created_at: string;
    employee?: Employee;
    rule?: PointRule;
    period?: PointPeriode;
}

export interface LeaderboardUser {
    employee_nik: string;
    user_id: number;
    employee_name: string;
    total_points: number;
    photo_url: string;
}

/**
 * Mewakili satu baris di daftar Leaderboard
 */
export interface PointLeaderboard {
    nik: string;
    employee_name: string;
    position: string | null;
    total_points: number;
    photo_url: string;
    rank?: number; // Opsional, ada jika dihitung di backend
}

/**
 * Response API untuk Leaderboard List
 */
export interface PointLeaderboardResponse {
    data: {
        meta: {
            period: string;
            my_rank: number | null;
            my_points: number;
        };
        list: PointLeaderboard[];
    };
}

/**
 * Detail satu transaksi poin
 */
export interface PointTransactionDetail {
    uuid: string;
    points: number;
    note: string | null;
    event: string;        // Contoh: "Hadir Tepat Waktu"
    category: string;     // Contoh: "attendance"
    description: string | null;
    period_name: string;
    timestamp: string;    // Contoh: "2 minutes ago"
    formatted_date: string; // Contoh: "15 Apr 2026 08:00"
}

/**
 * Informasi ringkas karyawan di halaman detail poin
 */
export interface PointEmployeeSummary {
    nik: string;
    name: string;
    position: string | null;
    photo_url: string;
    total_points: number;
}

/**
 * Response API lengkap untuk Detail Leaderboard
 */
export interface PointLeaderboardDetailResponse {
    data: {
        employee: PointEmployeeSummary;
        transactions: PointTransactionDetail[];
    };
}