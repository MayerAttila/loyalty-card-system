"use client";

import useSWR from "swr";
import { AppSession } from "@/types/session";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
const SESSION_URL =
  !baseURL || baseURL === "/" ? "/auth/session" : `${baseURL}/auth/session`;

const fetcher = async (url: string) => {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Session request failed (${res.status})`);
  return (await res.json()) as AppSession;
};

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR<AppSession>(
    SESSION_URL,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60_000,
    }
  );

  return {
    session: data,
    loading: isLoading,
    error,
    refresh: mutate,
    isAuthed: !!data?.user,
  };
}
