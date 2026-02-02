import React from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import Button from "@/components/Button";
import type { SubscriptionStatus } from "@/types/subscription";

type SubscriptionTiersProps = {
  trialDays: number;
  actionLoading: boolean;
  isActive: boolean;
  status: SubscriptionStatus | null;
  monthlyPriceId: string;
  annualPriceId: string;
  selectedPlan?: "trial" | "monthly" | "annual" | null;
  onStartTrial: () => void;
  onSubscribeMonthly: () => void;
  onSubscribeAnnual: () => void;
};

const SubscriptionTiers = ({
  trialDays,
  actionLoading,
  isActive,
  status,
  monthlyPriceId,
  annualPriceId,
  selectedPlan,
  onStartTrial,
  onSubscribeMonthly,
  onSubscribeAnnual,
}: SubscriptionTiersProps) => {
  const isPaidActive = status?.status === "active" || status?.status === "trialing";

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <SubscriptionCard
        title="Free trial"
        price={`${trialDays} days`}
        interval="no card required"
        description="Try the full product before adding payment details."
        features={[
          "Full access during trial",
          "No payment required",
          "Cancel anytime",
        ]}
        badge={status?.status === "trial" ? "Active trial" : undefined}
        highlighted={selectedPlan === "trial"}
        action={
          <Button
            type="button"
            onClick={onStartTrial}
            disabled={actionLoading || status?.status === "trial"}
          >
            {status?.status === "trial"
              ? "Trial active"
              : "Start free trial"}
          </Button>
        }
      />
      <SubscriptionCard
        title="Monthly"
        price="€7.99"
        interval="per month"
        description="Flexible monthly plan for smaller teams."
        features={[
          "Cancel anytime",
          "All core loyalty features",
          "Email support",
        ]}
        badge={
          status?.stripePriceId === monthlyPriceId && isPaidActive
            ? "Current plan"
            : undefined
        }
        highlighted={selectedPlan === "monthly"}
        action={
          <Button
            type="button"
            onClick={onSubscribeMonthly}
            disabled={
              actionLoading ||
              (isPaidActive && status?.stripePriceId === monthlyPriceId)
            }
          >
            {status?.stripePriceId === monthlyPriceId && isPaidActive
              ? "Current plan"
              : "Subscribe monthly"}
          </Button>
        }
      />
      <SubscriptionCard
        title="Annual"
        price="€79.99"
        interval="per year"
        description="Save with annual subscription for growing teams."
        features={[
          "2 months free vs monthly",
          "Priority support",
          "All core loyalty features",
        ]}
        highlighted={selectedPlan === "annual"}
        badge={
          status?.stripePriceId === annualPriceId && isPaidActive
            ? "Current plan"
            : "Best value"
        }
        action={
          <Button
            type="button"
            onClick={onSubscribeAnnual}
            disabled={
              actionLoading ||
              (isPaidActive && status?.stripePriceId === annualPriceId)
            }
          >
            {status?.stripePriceId === annualPriceId && isPaidActive
              ? "Current plan"
              : "Subscribe annually"}
          </Button>
        }
      />
    </div>
  );
};

export default SubscriptionTiers;
