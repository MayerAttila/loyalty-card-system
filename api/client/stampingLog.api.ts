import { api } from "./axios";

export type StampingLogEntry = {
  id: string;
  stampedAt: string;
  stampedBy: {
    id: string;
    name: string;
    email: string;
    role: "OWNER" | "ADMIN" | "STAFF";
  };
  cardId: string;
  cycleId: string;
  cycleNumber: number;
  stampCount: number;
  addedStamps: number;
  stampCountAfter: number;
  cardCompleted: boolean;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  cardTemplate: {
    id: string;
    title: string;
    maxPoints: number;
  };
};

export const getStampingLogs = async (limit = 100) => {
  const { data } = await api.get(`/stamping-log/business`, {
    params: { limit },
  });
  return data as StampingLogEntry[];
};
