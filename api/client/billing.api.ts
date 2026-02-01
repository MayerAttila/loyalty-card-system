import { api } from "./axios";

export type BillingStatus = {
  businessId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  status: string;
  currentPeriodEnd?: string | null;
  trialEndsAt?: string | null;
  cancelAtPeriodEnd?: boolean;
  interval?: string | null;
};

export async function getBillingStatus() {
  const res = await api.get<BillingStatus>("/billing/status");
  return res.data;
}

export async function createCheckoutSession(payload: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  withTrial?: boolean;
  requireCard?: boolean;
}) {
  const res = await api.post<{ url: string }>("/billing/checkout", payload);
  return res.data;
}

export async function createSubscriptionIntent(payload: {
  priceId: string;
  withTrial?: boolean;
}) {
  const res = await api.post<{ clientSecret: string; subscriptionId: string }>(
    "/billing/subscribe",
    payload
  );
  return res.data;
}

export async function startTrialNoCard() {
  const res = await api.post<{ status: string; trialEndsAt?: string }>(
    "/billing/trial"
  );
  return res.data;
}

export async function cancelSubscription() {
  const res = await api.post<{ status: string; cancelAtPeriodEnd: boolean }>(
    "/billing/cancel"
  );
  return res.data;
}

export async function cancelSubscriptionNow() {
  const res = await api.post<{ status: string }>("/billing/cancel-now");
  return res.data;
}

export async function resetSubscriptionForTesting() {
  const res = await api.post<{ status: string }>("/billing/reset");
  return res.data;
}

export async function createPortalSession(payload: { returnUrl: string }) {
  const res = await api.post<{ url: string }>("/billing/portal", payload);
  return res.data;
}
