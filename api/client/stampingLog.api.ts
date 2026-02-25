import { api } from "./axios";
import type { StampingLogEntry } from "@/types/stampingLog";

export const getStampingLogs = async (limit?: number) => {
  const { data } = await api.get(`/stamping-log/business`, {
    params: typeof limit === "number" ? { limit } : undefined,
  });
  return data as StampingLogEntry[];
};
