"use server";

import {
  getSubscriptionStatus,
  createCheckoutSession,
  createSubscriptionIntent,
  startTrialNoCard,
  cancelSubscription,
  cancelSubscriptionNow,
  resetSubscriptionForTesting,
  createPortalSession,
} from "@/api/server/subscription.api";

export async function getSubscriptionStatusAction() {
  return getSubscriptionStatus();
}

export async function createCheckoutSessionAction(payload: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  withTrial?: boolean;
  requireCard?: boolean;
}) {
  return createCheckoutSession(payload);
}

export async function createSubscriptionIntentAction(payload: {
  priceId: string;
  withTrial?: boolean;
}) {
  return createSubscriptionIntent(payload);
}

export async function startTrialNoCardAction() {
  return startTrialNoCard();
}

export async function cancelSubscriptionAction() {
  return cancelSubscription();
}

export async function cancelSubscriptionNowAction() {
  return cancelSubscriptionNow();
}

export async function resetSubscriptionForTestingAction() {
  return resetSubscriptionForTesting();
}

export async function createPortalSessionAction(payload: { returnUrl: string }) {
  return createPortalSession(payload);
}
