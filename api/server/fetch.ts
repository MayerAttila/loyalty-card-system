import "server-only";

const API_URL =
  process.env.API_PROXY_TARGET ||
  process.env.NEXT_PUBLIC_API_URL ||
  "";

if (!API_URL || API_URL === "/") {
  throw new Error("Missing API_PROXY_TARGET or NEXT_PUBLIC_API_URL");
}

type ApiFetchOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}
