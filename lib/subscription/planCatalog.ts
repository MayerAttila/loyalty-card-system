export type SubscriptionPlanKey = "trial" | "monthly" | "annual";

export type SubscriptionPlanCardContent = {
  title: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  badge?: string;
};

export const getSubscriptionPlanCatalog = (trialDays = 30): Record<
  SubscriptionPlanKey,
  SubscriptionPlanCardContent
> => ({
  trial: {
    title: "Free trial",
    price: `${trialDays} days`,
    interval: "no card required",
    description: "Try the full product before adding payment details.",
    features: [
      "Full access during trial",
      "Custom card branding",
      "Staff invitations",
      "Stamping history logs",
      "Google Wallet cards",
    ],
  },
  monthly: {
    title: "Monthly",
    price: "EUR 7.99",
    interval: "per month",
    description: "Flexible monthly plan for smaller teams.",
    features: [
      "Custom card branding",
      "Staff invitations",
      "Stamping history logs",
      "Google Wallet cards",
      "Apple Wallet (Coming soon)",
      "Customer notifications (Coming soon)",
    ],
  },
  annual: {
    title: "Annual",
    price: "EUR 79.99",
    interval: "per year",
    description: "Save with annual subscription for growing teams.",
    features: [
      "Custom card branding",
      "Staff invitations",
      "Stamping history logs",
      "Google Wallet cards",
      "Apple Wallet (Coming soon)",
      "Customer notifications (Coming soon)",
      "2 months free vs monthly",
    ],
    badge: "Best value",
  },
});

