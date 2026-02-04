export interface DivisionInput {
    uuid?: string;
    name: string;
    code: string;
    teams: TeamInput[];
}

export interface TeamInput {
    name: string;
}

export interface Division {
    uuid: string;
    name: string;
    code: string;
    teams: Team[];
}

export interface Team {
    id: number;
    name: string;
}