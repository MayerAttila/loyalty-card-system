import { api } from "./axios";
import type { StampingLogEntry } from "@/types/stampingLog";

export const getStampingLogs = async (limit = 100) => {
  const { data } = await api.get(`/stamping-log/business`, {
    params: { limit },
  });
  return data as StampingLogEntry[];
};
