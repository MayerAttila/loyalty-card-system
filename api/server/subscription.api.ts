import "server-only";
import { cookies } from "next/headers";
import { apiFetch } from "./fetch";
import type { SubscriptionStatus } from "@/types/subscription";

type ApiRequestOptions = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

async function apiFetchWithAuth<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      cookie: cookieHeader,
    },
    cache: "no-store",
  });
}

export async function getSubscriptionStatus() {
  return apiFetchWithAuth<SubscriptionStatus>("/subscription/status");
}

export async function createCheckoutSession(payload: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  withTrial?: boolean;
  requireCard?: boolean;
}) {
  return apiFetchWithAuth<{ url: string }>("/subscription/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createSubscriptionIntent(payload: {
  priceId: string;
  withTrial?: boolean;
}) {
  return apiFetchWithAuth<{ clientSecret: string; subscriptionId: string }>(
    "/subscription/subscribe",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function startTrialNoCard() {
  return apiFetchWithAuth<{ status: string; trialEndsAt?: string }>(
    "/subscription/trial",
    { method: "POST" }
  );
}

export async function cancelSubscription() {
  return apiFetchWithAuth<{ status: string; cancelAtPeriodEnd: boolean }>(
    "/subscription/cancel",
    { method: "POST" }
  );
}

export async function cancelSubscriptionNow() {
  return apiFetchWithAuth<{ status: string }>(
    "/subscription/cancel-now",
    { method: "POST" }
  );
}

export async function resetSubscriptionForTesting() {
  return apiFetchWithAuth<{ status: string }>(
    "/subscription/reset",
    { method: "POST" }
  );
}

export async function createPortalSession(payload: { returnUrl: string }) {
  return apiFetchWithAuth<{ url: string }>("/subscription/portal", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
