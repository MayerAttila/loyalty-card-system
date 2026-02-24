import { api } from "./axios";
import type {
  CreateNotificationPayload,
  NotificationRecord,
  UpdateNotificationStatusPayload,
} from "@/types/notification";

export async function createNotification(payload: CreateNotificationPayload) {
  const res = await api.post<NotificationRecord>("/notification", payload);
  return res.data;
}

export async function getNotificationsByBusinessId(
  businessId: string,
  filters?: { status?: "active" | "inactive" }
) {
  const res = await api.get<NotificationRecord[]>(
    `/notification/business/${businessId}`,
    {
      params: filters?.status ? { status: filters.status } : undefined,
    }
  );
  return res.data;
}

export async function getNotificationById(id: string) {
  const res = await api.get<NotificationRecord>(`/notification/id/${id}`);
  return res.data;
}

export async function updateNotification(
  id: string,
  payload: Partial<CreateNotificationPayload>
) {
  const res = await api.patch<NotificationRecord>(`/notification/id/${id}`, payload);
  return res.data;
}

export async function updateNotificationStatus(
  id: string,
  payload?: UpdateNotificationStatusPayload
) {
  const res = await api.patch<NotificationRecord>(
    `/notification/id/${id}/status`,
    payload ?? {}
  );
  return res.data;
}

export async function deleteNotification(id: string) {
  const res = await api.delete<{ id: string; deleted: boolean }>(
    `/notification/id/${id}`
  );
  return res.data;
}
