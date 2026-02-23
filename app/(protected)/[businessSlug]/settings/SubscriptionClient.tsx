"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import SubscriptionTiers from "@/components/SubscriptionTiers";
import SubscriptionCheckout from "@/components/SubscriptionCheckout";
import type { SubscriptionStatus } from "@/types/subscription";
import { getSubscriptionPlanCatalog } from "@/lib/subscription/planCatalog";
import {
  createPortalSessionAction,
  cancelSubscriptionAction,
  resetSubscriptionForTestingAction,
  getSubscriptionStatusAction,
  startTrialNoCardAction,
} from "@/lib/subscription/actions";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "";
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL ?? "";
const TRIAL_DAYS = Number(process.env.NEXT_PUBLIC_STRIPE_TRIAL_DAYS ?? 30);

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
};

const toStatusLabel = (status?: string | null) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const getStatusChipClassName = (status?: string | null) => {
  void status;
  return "border-brand/30 bg-brand/10 text-brand";
};

type SubscriptionClientProps = {
  embedded?: boolean;
};

const SubscriptionClient = ({ embedded = false }: SubscriptionClientProps) => {
  const params = useParams<{ businessSlug?: string }>();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<"monthly" | "annual" | null>(
    null,
  );
  const [showUpgradeOptions, setShowUpgradeOptions] = useState(false);
  const tiersSectionRef = useRef<HTMLDivElement | null>(null);
  const checkoutSectionRef = useRef<HTMLDivElement | null>(null);
  const planCatalog = useMemo(() => getSubscriptionPlanCatalog(TRIAL_DAYS), []);

  const basePath = params?.businessSlug ? `/${params.businessSlug}` : "";
  const subscriptionUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${basePath}/settings`
      : "";

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    getSubscriptionStatusAction()
      .then((data) => {
        if (isActive) setStatus(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Unable to load subscription status.");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!showUpgradeOptions) return;

    const timeoutId = window.setTimeout(() => {
      tiersSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [showUpgradeOptions]);

  useEffect(() => {
    if (!checkoutPlan) return;

    const timeoutId = window.setTimeout(() => {
      checkoutSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);

    return () => window.clearTimeout(timeoutId);
  }, [checkoutPlan]);

  const currentPlanLabel = useMemo(() => {
    if (!status?.stripePriceId) return "No plan";
    if (status.stripePriceId === MONTHLY_PRICE_ID) return "Monthly";
    if (status.stripePriceId === ANNUAL_PRICE_ID) return "Annual";
    return "Custom";
  }, [status?.stripePriceId]);

  const isActive =
    status?.status === "active" ||
    status?.status === "trialing" ||
    status?.status === "trial";
  const canCancel = isActive && !status?.cancelAtPeriodEnd;
  const hasPaidSubscription =
    status?.status === "active" && Boolean(status?.stripeSubscriptionId);

  const handleManageSubscription = async () => {
    setActionLoading(true);
    try {
      const { url } = await createPortalSessionAction({
        returnUrl: subscriptionUrl,
      });
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error("Stripe portal URL missing.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to open subscription portal.");
    } finally {
      setActionLoading(false);
    }
  };

  const trialEnds = formatDate(status?.trialEndsAt);
  const periodEnds = formatDate(status?.currentPeriodEnd);
  const isTrialPlan =
    status?.status === "trial" || status?.status === "trialing";
  const isSubscribedPlan = status?.status === "active" && !isTrialPlan;
  const pendingPaidPlanLabel =
    isTrialPlan && status?.stripePriceId
      ? status.stripePriceId === MONTHLY_PRICE_ID
        ? "Monthly subscription"
        : status.stripePriceId === ANNUAL_PRICE_ID
          ? "Annual subscription"
          : "Paid subscription"
      : null;
  const billingCycleLabel = loading
    ? "Loading..."
    : isTrialPlan
      ? "Trial period"
      : status?.interval === "month"
        ? "Monthly billing"
        : status?.interval === "year"
          ? "Annual billing"
          : isSubscribedPlan
            ? "Recurring billing"
            : "No billing cycle";
  const statusLabel = loading ? "Loading" : toStatusLabel(status?.status);
  const statusChipClassName = getStatusChipClassName(status?.status);
  const showDangerRow = canCancel || actionLoading;
  const summaryCardClassName =
    "rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/10 via-primary/20 to-primary/5 p-4";
  const infoRowClassName =
    "rounded-xl border border-accent-3 bg-primary/35 px-4 py-3";
  const planTypeLabel = loading
    ? "Loading..."
    : isTrialPlan
      ? "Trial"
      : isSubscribedPlan
        ? `${currentPlanLabel} subscription`
        : "No active plan";
  const timingLabel = isTrialPlan ? "Trial ends" : "Next payment";
  const timingValue = loading
    ? "Loading..."
    : isTrialPlan
      ? (trialEnds ?? "Not available")
      : isSubscribedPlan
        ? (periodEnds ?? "Not scheduled")
        : "No payment scheduled";
  const benefitsPlanKey = isTrialPlan
    ? "trial"
    : status?.stripePriceId === ANNUAL_PRICE_ID
      ? "annual"
      : status?.stripePriceId === MONTHLY_PRICE_ID
        ? "monthly"
        : "monthly";
  const benefitsPlan = planCatalog[benefitsPlanKey];
  const benefitsTitle = loading
    ? "Included with your plan"
    : isActive
      ? `Included with your ${benefitsPlan.title.toLowerCase()}`
      : `Included with ${benefitsPlan.title.toLowerCase()} after activation`;

  const containerClassName = embedded
    ? ""
    : "rounded-xl border border-accent-3 bg-accent-1 p-6";

  return (
    <section className="space-y-6">
      <div className={containerClassName}>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-brand">Subscription</h2>
            <span
              className={`inline-flex h-8 w-fit items-center rounded-full border px-3 text-xs font-semibold uppercase leading-none tracking-[0.12em] ${statusChipClassName}`}
            >
              {statusLabel}
            </span>
          </div>
          <p className="mt-2 text-sm text-contrast/80">
            Manage your plan, billing timeline, and payment portal access.
          </p>
        </div>

        <div className={`mt-5 ${summaryCardClassName}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-contrast/60">
                Current plan
              </p>
              <p className="mt-2 text-2xl font-semibold text-contrast">
                {planTypeLabel}
              </p>
              <p className="mt-2 text-sm text-contrast/75">
                {isTrialPlan
                  ? "Trial access is active for this business."
                  : isSubscribedPlan
                    ? "Your business is on an active paid subscription."
                    : "No active subscription is attached to this business."}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className={infoRowClassName}>
                <p className="text-xs uppercase tracking-wide text-contrast/60">
                  Billing cycle
                </p>
                <p className="mt-1 text-sm font-semibold text-contrast">
                  {billingCycleLabel}
                </p>
              </div>
              <div className={infoRowClassName}>
                <p className="text-xs uppercase tracking-wide text-contrast/60">
                  {timingLabel}
                </p>
                <p className="mt-1 text-sm font-semibold text-contrast">
                  {timingValue}
                </p>
              </div>
            </div>
          </div>

          {status?.cancelAtPeriodEnd ? (
            <p className="mt-3 text-xs text-brand">
              Cancellation is scheduled and access remains active until the end
              of the current period.
            </p>
          ) : null}
          {pendingPaidPlanLabel ? (
            <p className="mt-2 text-xs text-contrast/75">
              {pendingPaidPlanLabel} activates on {trialEnds ?? "trial end"}.
            </p>
          ) : null}
        </div>

        <div className="mt-5 rounded-2xl border border-accent-3 bg-primary/20 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-contrast">
                Plan benefits
              </p>
              <p className="mt-1 text-xs text-contrast/65">{benefitsTitle}</p>
            </div>
            {!isActive && !loading ? (
              <span className="inline-flex w-fit items-center rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-semibold text-brand">
                Activate plan to unlock
              </span>
            ) : null}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {benefitsPlan.features.map((feature) => (
              <div
                key={feature}
                className="rounded-xl border border-accent-3 bg-primary/35 px-4 py-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                      isActive || loading
                        ? "border-brand/30 bg-brand/10 text-brand"
                        : "border-accent-4 bg-primary/50 text-contrast/70"
                    }`}
                    aria-hidden="true"
                  >
                    {isActive || loading ? "✓" : "•"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-contrast">
                      {feature}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 border-t border-accent-3 pt-4">
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {showDangerRow ? (
                <Button
                  type="button"
                  variant="neutral"
                  className="border-brand/30 text-brand hover:border-brand/60 hover:bg-brand/10"
                  onClick={async () => {
                    if (!canCancel) return;
                    setActionLoading(true);
                    try {
                      await cancelSubscriptionAction();
                      const updated = await getSubscriptionStatusAction();
                      setStatus(updated);
                      toast.success("Cancellation scheduled.");
                    } catch (error) {
                      console.error(error);
                      toast.error("Unable to cancel subscription.");
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  disabled={actionLoading || !canCancel}
                >
                  Cancel plan
                </Button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasPaidSubscription ? (
                <Button
                  type="button"
                  onClick={handleManageSubscription}
                  disabled={actionLoading || !status?.stripeCustomerId}
                  variant="neutral"
                >
                  Manage billing
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={() => setShowUpgradeOptions((prev) => !prev)}
                disabled={actionLoading}
              >
                {showUpgradeOptions ? "Hide plans" : "Change plan"}
              </Button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="neutral"
              onClick={async () => {
                if (actionLoading) return;
                setActionLoading(true);
                try {
                  await resetSubscriptionForTestingAction();
                  const updated = await getSubscriptionStatusAction();
                  setStatus(updated);
                  toast.success("Subscription history reset.");
                } catch (error) {
                  console.error(error);
                  toast.error("Unable to reset subscription.");
                } finally {
                  setActionLoading(false);
                }
              }}
              disabled={actionLoading}
            >
              Test reset
            </Button>
          </div>
        </div>
      </div>

      {showUpgradeOptions ? (
        <>
          <div ref={tiersSectionRef} className="scroll-mt-24">
            <SubscriptionTiers
              trialDays={TRIAL_DAYS}
              actionLoading={actionLoading}
              isActive={isActive}
              status={status}
              monthlyPriceId={MONTHLY_PRICE_ID}
              annualPriceId={ANNUAL_PRICE_ID}
              selectedPlan={checkoutPlan}
              onStartTrial={async () => {
                if (actionLoading) return;
                setActionLoading(true);
                try {
                  await startTrialNoCardAction();
                  const updated = await getSubscriptionStatusAction();
                  setStatus(updated);
                  toast.success("Trial started.");
                } catch (error) {
                  console.error(error);
                  toast.error("Unable to start trial.");
                } finally {
                  setActionLoading(false);
                }
              }}
              onSubscribeMonthly={() => {
                setCheckoutPlan("monthly");
              }}
              onSubscribeAnnual={() => {
                setCheckoutPlan("annual");
              }}
            />
          </div>

          {checkoutPlan ? (
            <div ref={checkoutSectionRef} className="scroll-mt-24">
              <SubscriptionCheckout
                plan={checkoutPlan}
                showPlanSelector={false}
                showBack={false}
                onClose={() => setCheckoutPlan(null)}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
};

export default SubscriptionClient;
