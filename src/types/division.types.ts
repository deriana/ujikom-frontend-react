export interface DivisionInput {
    uuid?: string;
    name: string;
    code: string;
    teams: TeamInput[];
}

export interface TeamInput {
    uuid: string;
    name: string;
}

export interface Division {
    uuid: string;
    name: string;
    code: string;
    teams: Team[];
}

export interface Team {
    uuid: string;
    name: string;
}