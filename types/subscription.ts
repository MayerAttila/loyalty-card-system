export type SubscriptionStatus = {
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
