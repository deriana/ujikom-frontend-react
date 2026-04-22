import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTickets,
  getTicketByUuid,
  createTicket,
  updateTicket,
  deleteTicket,
  replyTicket,
  rateTicket,
  updateTicketStatus,
  getTicketDashboard,
} from "@/api/ticket.api";
import { TicketInput, ReplyTicketInput, RateTicketInput } from "@/types";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: getTickets,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTicketByUuid = (uuid: string) => {
  return useQuery({
    queryKey: ["tickets", uuid],
    queryFn: () => getTicketByUuid(uuid),
    enabled: !!uuid,
    refetchInterval: 3000, 
    refetchIntervalInBackground: true, 
  });
};

export const useTicketDashboard = () => {
  return useQuery({
    queryKey: ["tickets", "dashboard"],
    queryFn: getTicketDashboard,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TicketInput) => createTicket(payload),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useUpdateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: TicketInput }) =>
      updateTicket(uuid, payload),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useDeleteTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (uuid: string) => deleteTicket(uuid),
    onSettled: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
};

export const useUpdateTicketStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ uuid, status }: { uuid: string; status: string }) =>
      updateTicketStatus(uuid, status),
    onSettled: (_data, _error, variables) => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["tickets", variables.uuid] });
    },
  });
};

export const useReplyTicket = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: ReplyTicketInput }) => 
      replyTicket(uuid, payload),
    
    onMutate: async (newReply) => {
      await qc.cancelQueries({ queryKey: ["tickets", newReply.uuid] });

      const previousTicket = qc.getQueryData(["tickets", newReply.uuid]);

      qc.setQueryData(["tickets", newReply.uuid], (old: any) => {
        return {
          ...old,
          replies: [...(old?.replies || []), { ...newReply.payload, createdAt: new Date().toISOString() }]
        };
      });

      return { previousTicket };
    },

    onError: (_err, newReply, context) => {
      qc.setQueryData(["tickets", newReply.uuid], context?.previousTicket);
    },

    onSettled: (_data, _error, variables) => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["tickets", variables.uuid] });
    },
  });
};
export const useRateTicket = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      uuid,
      payload,
    }: {
      uuid: string;
      payload: RateTicketInput;
    }) => rateTicket(uuid, payload),
    onSettled: (_data, _error, variables) => {
      qc.invalidateQueries({ queryKey: ["tickets"] });
      qc.invalidateQueries({ queryKey: ["tickets", variables.uuid] });
    },
  });
};