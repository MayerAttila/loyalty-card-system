import "server-only";
import { cookies } from "next/headers";

const resolveApiUrl = () => {
  const apiUrl =
    process.env.API_PROXY_TARGET ||
    process.env.NEXT_PUBLIC_API_URL ||
    "";

  if (!apiUrl || apiUrl === "/") {
    throw new Error("Missing API_PROXY_TARGET or NEXT_PUBLIC_API_URL");
  }

  return apiUrl;
};

type ApiFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const apiUrl = resolveApiUrl();
  let cookieHeader = "";

  try {
    if (!("cookie" in (options.headers ?? {}))) {
      const cookieStore = await cookies();
      cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");
    }
  } catch {
    // No request cookie context (e.g. build-time execution). Continue without cookies.
  }

  const res = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
