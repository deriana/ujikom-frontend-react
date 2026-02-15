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