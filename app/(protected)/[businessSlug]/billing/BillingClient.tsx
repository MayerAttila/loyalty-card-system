"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import SubscriptionTiers from "./SubscriptionTiers";
import {
  createPortalSession,
  cancelSubscription,
  cancelSubscriptionNow,
  resetSubscriptionForTesting,
  getBillingStatus,
  type BillingStatus,
  startTrialNoCard,
} from "@/api/client/billing.api";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "";
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL ?? "";
const TRIAL_DAYS = Number(process.env.NEXT_PUBLIC_STRIPE_TRIAL_DAYS ?? 30);

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
};

const BillingClient = () => {
  const params = useParams<{ businessSlug?: string }>();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const basePath = params?.businessSlug ? `/${params.businessSlug}` : "";
  const billingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${basePath}/billing`
      : "";

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    getBillingStatus()
      .then((data) => {
        if (isActive) setStatus(data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Unable to load billing status.");
      })
      .finally(() => {
        if (isActive) setLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, []);

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

  const handleManageBilling = async () => {
    setActionLoading(true);
    try {
      const { url } = await createPortalSession({ returnUrl: billingUrl });
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error("Stripe portal URL missing.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to open billing portal.");
    } finally {
      setActionLoading(false);
    }
  };

  const trialEnds = formatDate(status?.trialEndsAt);
  const periodEnds = formatDate(status?.currentPeriodEnd);

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand">Billing</h2>
            <p className="mt-2 text-sm text-contrast/80">
              Manage your subscription and payment details.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              onClick={handleManageBilling}
              disabled={actionLoading || !status?.stripeCustomerId}
              variant="neutral"
            >
              Manage billing
            </Button>
            <Button
              type="button"
              variant="neutral"
              onClick={async () => {
                if (!canCancel) return;
                setActionLoading(true);
                try {
                  await cancelSubscription();
                  const updated = await getBillingStatus();
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
            <Button
              type="button"
              variant="neutral"
              onClick={async () => {
                if (!isActive) return;
                setActionLoading(true);
                try {
                  await cancelSubscriptionNow();
                  const updated = await getBillingStatus();
                  setStatus(updated);
                  toast.success("Subscription canceled immediately.");
                } catch (error) {
                  console.error(error);
                  toast.error("Unable to cancel immediately.");
                } finally {
                  setActionLoading(false);
                }
              }}
              disabled={actionLoading || !isActive}
            >
              Test
            </Button>
            <Button
              type="button"
              variant="neutral"
              onClick={async () => {
                if (actionLoading) return;
                setActionLoading(true);
                try {
                  await resetSubscriptionForTesting();
                  const updated = await getBillingStatus();
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
              Test (reset)
            </Button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-accent-3 bg-primary p-4">
            <p className="text-xs uppercase tracking-wide text-contrast/60">
              Status
            </p>
            <p className="mt-2 text-lg font-semibold text-contrast">
              {loading ? "Loading..." : status?.status ?? "Not subscribed"}
            </p>
            <p className="mt-1 text-xs text-contrast/70">
              Current plan: {currentPlanLabel}
            </p>
          </div>
          <div className="rounded-lg border border-accent-3 bg-primary p-4">
            <p className="text-xs uppercase tracking-wide text-contrast/60">
              Renewal
            </p>
            <p className="mt-2 text-sm text-contrast/80">
              {trialEnds
                ? `Trial ends on ${trialEnds}`
                : periodEnds
                ? `Renews on ${periodEnds}`
                : "No renewal scheduled"}
            </p>
            {status?.cancelAtPeriodEnd ? (
              <p className="mt-2 text-xs text-brand">
                Cancellation scheduled at period end.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <SubscriptionTiers
        trialDays={TRIAL_DAYS}
        actionLoading={actionLoading}
        isActive={isActive}
        status={status}
        monthlyPriceId={MONTHLY_PRICE_ID}
        annualPriceId={ANNUAL_PRICE_ID}
        onStartTrial={async () => {
          if (actionLoading) return;
          setActionLoading(true);
          try {
            await startTrialNoCard();
            const updated = await getBillingStatus();
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
          if (!params?.businessSlug) return;
          window.location.href = `/${params.businessSlug}/billing/checkout?plan=monthly`;
        }}
        onSubscribeAnnual={() => {
          if (!params?.businessSlug) return;
          window.location.href = `/${params.businessSlug}/billing/checkout?plan=annual`;
        }}
      />
    </section>
  );
};

export default BillingClient;
