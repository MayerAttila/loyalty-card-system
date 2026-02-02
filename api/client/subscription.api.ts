import { api } from "./axios";
import type { SubscriptionStatus } from "@/types/subscription";

export async function getSubscriptionStatus() {
  const res = await api.get<SubscriptionStatus>("/subscription/status");
  return res.data;
}

export async function createCheckoutSession(payload: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  withTrial?: boolean;
  requireCard?: boolean;
}) {
  const res = await api.post<{ url: string }>("/subscription/checkout", payload);
  return res.data;
}

export async function createSubscriptionIntent(payload: {
  priceId: string;
  withTrial?: boolean;
}) {
  const res = await api.post<{ clientSecret: string; subscriptionId: string }>(
    "/subscription/subscribe",
    payload
  );
  return res.data;
}

export async function startTrialNoCard() {
  const res = await api.post<{ status: string; trialEndsAt?: string }>(
    "/subscription/trial"
  );
  return res.data;
}

export async function cancelSubscription() {
  const res = await api.post<{ status: string; cancelAtPeriodEnd: boolean }>(
    "/subscription/cancel"
  );
  return res.data;
}

export async function cancelSubscriptionNow() {
  const res = await api.post<{ status: string }>("/subscription/cancel-now");
  return res.data;
}

export async function resetSubscriptionForTesting() {
  const res = await api.post<{ status: string }>("/subscription/reset");
  return res.data;
}

export async function createPortalSession(payload: { returnUrl: string }) {
  const res = await api.post<{ url: string }>("/subscription/portal", payload);
  return res.data;
}
