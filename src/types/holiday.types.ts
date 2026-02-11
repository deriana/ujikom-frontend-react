import { UUID } from "./common";

export interface Holiday {
    uuid: UUID;
    name: string;
    date: string;
    is_recurring: boolean;
    creator: {
        uuid: UUID;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

export interface HolidayInput {
    uuid?: UUID;
    name: string;
    date: string;
    is_recurring: boolean;
}