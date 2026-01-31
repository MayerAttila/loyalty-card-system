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

export async function createPortalSession(payload: { returnUrl: string }) {
  const res = await api.post<{ url: string }>("/billing/portal", payload);
  return res.data;
}
