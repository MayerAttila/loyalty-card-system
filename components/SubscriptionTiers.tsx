import React from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
import Button from "@/components/Button";
import type { SubscriptionStatus } from "@/types/subscription";
import { getSubscriptionPlanCatalog } from "@/lib/subscription/planCatalog";

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
  const plans = getSubscriptionPlanCatalog(trialDays);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <SubscriptionCard
        variant="glassy"
        title={plans.trial.title}
        price={plans.trial.price}
        interval={plans.trial.interval}
        description={plans.trial.description}
        features={plans.trial.features}
        badge={status?.status === "trial" ? "Active trial" : undefined}
        highlighted={selectedPlan === "trial"}
        action={
          <Button
            type="button"
            onClick={onStartTrial}
            disabled={actionLoading || status?.status === "trial"}
          >
            {status?.status === "trial" ? "Trial active" : "Start free trial"}
          </Button>
        }
      />

      <SubscriptionCard
        variant="glassy"
        title={plans.monthly.title}
        price={plans.monthly.price}
        interval={plans.monthly.interval}
        description={plans.monthly.description}
        features={plans.monthly.features}
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
        variant="glassy"
        title={plans.annual.title}
        price={plans.annual.price}
        interval={plans.annual.interval}
        description={plans.annual.description}
        features={plans.annual.features}
        highlighted={selectedPlan === "annual"}
        badge={
          status?.stripePriceId === annualPriceId && isPaidActive
            ? "Current plan"
            : plans.annual.badge
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
