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
    // Matikan polling otomatis atau buat sangat lama (misal 5 menit)
    refetchInterval: 60000 * 5,
    // Data dianggap basi setelah 1 menit, tapi tidak narik data terus menerus
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
};

// 2. Fetch Unread Notifications
export const useUnreadNotifications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["notifications", "unread"],
    queryFn: getUnreadNotifications,
    refetchInterval: 15000, // 15 detik sudah cukup cepat untuk notif push
    refetchOnWindowFocus: true,
    staleTime: 0,
    enabled: enabled && !!localStorage.getItem("token"),
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
