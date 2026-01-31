"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import {
  createCheckoutSession,
  createPortalSession,
  getBillingStatus,
  type BillingStatus,
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
    status?.status === "active" || status?.status === "trialing";

  const handleSubscribe = async (
    priceId: string,
    withTrial = false,
    requireCard = true
  ) => {
    if (!priceId) {
      toast.error("Missing price configuration.");
      return;
    }
    setActionLoading(true);
    try {
      const { url } = await createCheckoutSession({
        priceId,
        successUrl: billingUrl,
        cancelUrl: billingUrl,
        withTrial,
        requireCard,
      });
      if (url) {
        window.location.href = url;
        return;
      }
      toast.error("Stripe checkout URL missing.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to start checkout.");
    } finally {
      setActionLoading(false);
    }
  };

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
          <Button
            type="button"
            onClick={handleManageBilling}
            disabled={actionLoading || !status?.stripeCustomerId}
            variant="neutral"
          >
            Manage billing
          </Button>
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

      <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-contrast">
              Start free trial
            </h3>
            <p className="mt-2 text-sm text-contrast/70">
              {TRIAL_DAYS}-day trial. No card required. Add a card before the trial ends to keep access.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => handleSubscribe(MONTHLY_PRICE_ID, true, false)}
            disabled={actionLoading || isActive}
          >
            Start free trial
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
          <h3 className="text-lg font-semibold text-contrast">Monthly</h3>
          <p className="mt-2 text-sm text-contrast/70">
            €7.99 per month.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => handleSubscribe(MONTHLY_PRICE_ID)}
              disabled={
                actionLoading ||
                (isActive && status?.stripePriceId === MONTHLY_PRICE_ID)
              }
            >
              {status?.stripePriceId === MONTHLY_PRICE_ID && isActive
                ? "Current plan"
                : "Subscribe monthly"}
            </Button>
          </div>
        </div>
        <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
          <h3 className="text-lg font-semibold text-contrast">Annual</h3>
          <p className="mt-2 text-sm text-contrast/70">
            €79.99 per year.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              onClick={() => handleSubscribe(ANNUAL_PRICE_ID)}
              disabled={
                actionLoading ||
                (isActive && status?.stripePriceId === ANNUAL_PRICE_ID)
              }
            >
              {status?.stripePriceId === ANNUAL_PRICE_ID && isActive
                ? "Current plan"
                : "Subscribe annually"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillingClient;
