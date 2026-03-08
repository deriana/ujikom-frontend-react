import { LaravelNotification } from "@/types/notification.types";
import api from "./axios";

export const getNotifications = async () => {
  const res = await api.get<LaravelNotification[]>("/notifications");
  return res.data;
};

export const getUnreadNotifications = async () => {
  const res = await api.get<LaravelNotification[]>("/notifications/unread");
  return res.data;
};

export const markAsRead = async (id: string) => {
  const res = await api.patch<LaravelNotification[]>(`/notifications/${id}/read`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await api.patch<LaravelNotification[]>("/notifications/mark-all-read");
  return res.data;
};

export const deleteNotification = async (id: string) => {
  const res = await api.delete<LaravelNotification[]>(`/notifications/${id}`);
  return res.data;
};

export const deleteAllNotifications = async () => {
  const res = await api.delete<LaravelNotification[]>("/notifications/delete-all");
  return res.data;
};