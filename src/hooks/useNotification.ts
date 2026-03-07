import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "@/api/notification.api";
import { LaravelNotification } from "@/types/notification.types";

// 1. Fetch All Notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1000 * 60, // 1 minute (adjust as needed)
  });
};

// 2. Fetch Unread Notifications
export const useUnreadNotifications = () => {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadNotifications,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// 3. Mark As Read (Single) - Optimistic Update
export const useMarkAsRead = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const previous = qc.getQueryData(["notifications"]);

      qc.setQueryData(["notifications"], (old: LaravelNotification[] = []) =>
        old.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous)
        qc.setQueryData(["notifications"], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// 4. Mark All As Read - Optimistic Update
export const useMarkAllAsRead = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const previous = qc.getQueryData(["notifications"]);

      qc.setQueryData(["notifications"], (old: LaravelNotification[] = []) =>
        old.map((n) => ({
          ...n,
          read_at: n.read_at ?? new Date().toISOString(),
        })),
      );

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous)
        qc.setQueryData(["notifications"], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

// 5. Delete Notification - Optimistic Update
export const useDeleteNotification = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const previous = qc.getQueryData(["notifications"]);

      qc.setQueryData(["notifications"], (old: LaravelNotification[] = []) =>
        old.filter((n) => n.id !== id),
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous)
        qc.setQueryData(["notifications"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};

// 6. Delete All Notifications - Optimistic Update
export const useDeleteAllNotifications = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteAllNotifications,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ["notifications"] });
      const previous = qc.getQueryData(["notifications"]);

      qc.setQueryData(["notifications"], () => []);

      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous)
        qc.setQueryData(["notifications"], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
};
