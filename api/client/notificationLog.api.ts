import { api } from "./axios";
import type { NotificationLogEntry } from "@/types/notification";

export const getNotificationLogs = async (limit?: number, offset?: number) => {
  const { data } = await api.get<NotificationLogEntry[]>(
    "/notification/logs/business",
    {
      params:
        typeof limit === "number" || typeof offset === "number"
          ? {
              ...(typeof limit === "number" ? { limit } : {}),
              ...(typeof offset === "number" ? { offset } : {}),
            }
          : undefined,
    }
  );
  return data;
};
