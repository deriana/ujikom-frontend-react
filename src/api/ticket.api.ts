import api from "./axios";
import { ApiResponse, Ticket, TicketDetail, TicketInput, ReplyTicketInput, RateTicketInput } from "@/types";

export const getTickets = async () => {
  const res = await api.get<ApiResponse<Ticket[]>>("ticketing");
  return res.data.data;
};

export const createTicket = async (payload: TicketInput) => {
  const res = await api.post<ApiResponse<Ticket>>("ticketing", payload);
  return res.data.data;
};

export const getTicketByUuid = async (uuid: string) => {
  const res = await api.get<ApiResponse<TicketDetail>>(`ticketing/${uuid}`);
  return res.data.data;
};

export const updateTicket = async (uuid: string, payload: TicketInput) => {
  const res = await api.put<ApiResponse<Ticket>>(`ticketing/${uuid}`, payload);
  return res.data.data;
};

export const deleteTicket = async (uuid: string) => {
  const res = await api.delete<ApiResponse<null>>(`ticketing/${uuid}`);
  return res.data.data;
};

export const replyTicket = async (uuid: string, payload: ReplyTicketInput) => {
  const res = await api.post<ApiResponse<TicketDetail>>(
    `ticketing/${uuid}/reply`,
    payload
  );
  return res.data.data;
};

export const rateTicket = async (uuid: string, payload: RateTicketInput) => {
  const res = await api.post<ApiResponse<TicketDetail>>(`ticketing/${uuid}/rate`, payload);
  return res.data.data;
};

export const updateTicketStatus = async (
  uuid: string,
  status: string
) => {
  const res = await api.put<ApiResponse<Ticket>>(`ticketing/${uuid}/status`, { status });
  return res.data.data;
};