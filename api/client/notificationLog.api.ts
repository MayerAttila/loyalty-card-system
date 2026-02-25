import { api } from "./axios";
import type { NotificationLogEntry } from "@/types/notification";

export const getNotificationLogs = async (limit?: number) => {
  const { data } = await api.get<NotificationLogEntry[]>(
    "/notification/logs/business",
    {
      params: typeof limit === "number" ? { limit } : undefined,
    }
  );
  return data;
};
