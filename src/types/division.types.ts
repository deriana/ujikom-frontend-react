import { UUID } from "./common";

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
}

export interface Team {
    uuid: UUID;
    name: string;
}