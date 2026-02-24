import "server-only";
import { cookies } from "next/headers";
import { apiFetch } from "./fetch";
import type { NotificationLogEntry } from "@/types/notification";

export const getNotificationLogs = async (limit = 300) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const data = await apiFetch<NotificationLogEntry[]>(
    `/notification/logs/business?limit=${encodeURIComponent(String(limit))}`,
    {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }
  );

  return data;
};

