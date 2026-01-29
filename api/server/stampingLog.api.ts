import "server-only";
import { cookies } from "next/headers";
import { apiFetch } from "./fetch";
import type { StampingLogEntry } from "@/types/stampingLog";

export const getStampingLogs = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const data = await apiFetch<StampingLogEntry[]>("/stamping-log/business", {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  return data;
};
