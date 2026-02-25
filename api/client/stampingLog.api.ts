import { api } from "./axios";
import type { StampingLogEntry } from "@/types/stampingLog";

export const getStampingLogs = async (limit?: number, offset?: number) => {
  const { data } = await api.get(`/stamping-log/business`, {
    params:
      typeof limit === "number" || typeof offset === "number"
        ? {
            ...(typeof limit === "number" ? { limit } : {}),
            ...(typeof offset === "number" ? { offset } : {}),
          }
        : undefined,
  });
  return data as StampingLogEntry[];
};
