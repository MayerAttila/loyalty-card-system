export type Customer = {
  id: string;
  name: string;
  email: string;
  businessId: string;
  createdAt: string;
  updatedAt: string;
  loyaltyCardCount?: number;
  cardSummary?: {
    templateTitle: string | null;
    stampCount: number;
    maxPoints: number | null;
    rewardsEarned: number;
    lastActivity: string | null;
    hasWallet: boolean;
  } | null;
};
