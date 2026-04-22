import { UUID } from "./common";

export interface Ticket {
  uuid: UUID;
  reporter: {
    id: number | null;
    name: string;
  };
  operator: {
    id: number | null;
    name: string;
  };
  subject: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
    can: TicketPermission;
}

export interface TicketPermission {
    update: boolean;
    delete: boolean;
    reply: boolean;
    rate: boolean;
}

export interface TicketDetail extends Ticket {
  id: number;
  response_time: any;
  responses?: {
    id: number;
    uuid: UUID;
    responder_id: number;
    responder_name: string;
    response: string;
    is_auto_reply: boolean;
    created_at: string;
  }[];
  rating?: {
    rating: number;
    feedback: string | null;
    created_at: string;
  } | null;
}

export interface TicketInput {
  uuid?: UUID;
  subject: string;
  description: string;
  priority: string;
  status?: string;
  force?: boolean;
  //   operator_id?: number | null;
}

export interface RateTicketInput {
  rating: number;
  feedback?: string | null;
}

export interface ReplyTicketInput {
  response: string;
}
