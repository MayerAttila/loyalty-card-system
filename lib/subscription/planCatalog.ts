export type SubscriptionPlanKey = "trial" | "monthly" | "annual";

export type SubscriptionPlanCardContent = {
  title: string;
  price: string;
  interval: string;
  description: string;
  features: string[];
  badge?: string;
};

export const getSubscriptionPlanCatalog = (
  trialDays = 30,
): Record<SubscriptionPlanKey, SubscriptionPlanCardContent> => ({
  trial: {
    title: "Free trial",
    price: `${trialDays} days`,
    interval: "no card required",
    description: "Try the full product before adding payment details.",
    features: [
      "Branded loyalty card design",
      "Staff invitations",
      "Easy-to-use card stamping",
      "Stamping history logs",
      "Google Wallet support",
      "Apple Wallet support",
    ],
  },
  monthly: {
    title: "Monthly",
    price: "EUR 7.99",
    interval: "per month",
    description: "Flexible monthly plan for smaller teams.",
    features: [
      "Branded loyalty card design",
      "Staff invitations",
      "Easy-to-use card stamping",
      "Stamping history logs",
      "Google Wallet support",
      "Apple Wallet support",
      "Customer notifications",
    ],
  },
  annual: {
    title: "Annual",
    price: "EUR 79.99",
    interval: "per year",
    description: "Save with annual subscription for growing teams.",
    features: [
      "Branded loyalty card design",
      "Staff invitations",
      "Easy-to-use card stamping",
      "Stamping history logs",
      "Google Wallet support",
      "Apple Wallet support",
      "Customer notifications",
      "2 months free vs monthly",
    ],
    badge: "Best value",
  },
});
