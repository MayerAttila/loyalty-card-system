import "server-only";
import { cookies } from "next/headers";
import type { AppSession } from "@/types/session";
import { apiFetch } from "./fetch";

export async function getSession(): Promise<AppSession | null> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    return await apiFetch<AppSession | null>("/auth/session", {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
  } catch {
    return null;
  }
}
