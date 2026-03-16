import { UserLite, UUID } from "./common";

export interface DivisionInput {
    uuid?: UUID;
    name: string;
    code: string;
    teams: TeamInput[];
}

export interface TeamInput {
    uuid?: UUID;
    name: string;
}

export interface Division {
    uuid: UUID;
    name: string;
    code: string;
    teams: Team[];
    system_reserve: boolean;
    creator: UserLite;
    created_at: string;
    updated_at: string;
}

export interface Team {
    uuid: UUID;
    name: string;
}

export interface DivisionTeamEmployee {
    uuid: UUID;
    division_name: string;
    division_code: string;
    teams: TeamWithMembers[];
    stats: {
        total_teams: number;
        total_employees: number;
    };
}

export interface TeamWithMembers {
    uuid: UUID;
    team_name: string;
    members: DivisionMember[];
    total_members: number;
}

export interface DivisionMember {
    nik: string;
    name: string;
    email: string;
    phone: string | null;
    position: string;
    status: {
        label: string;
        type: number;
        is_active: boolean;
    };
    employment: {
        join_date: string | null;
        years_of_service: number | null;
        contract_due: string | null;
        is_contract_ended: boolean;
    };
    avatar: string;
}