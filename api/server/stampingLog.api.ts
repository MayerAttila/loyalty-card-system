import "server-only";
import { cookies } from "next/headers";
import { apiFetch } from "./fetch";
import type { StampingLogEntry } from "@/types/stampingLog";

export const getStampingLogs = async (limit?: number) => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const params = new URLSearchParams();
  if (typeof limit === "number" && Number.isFinite(limit)) {
    params.set("limit", String(limit));
  }

  const data = await apiFetch<StampingLogEntry[]>(
    `/stamping-log/business${params.size ? `?${params.toString()}` : ""}`,
    {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    }
  );

  return data;
};
