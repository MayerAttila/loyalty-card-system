"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import SubscriptionCard from "@/components/SubscriptionCard";
import { createSubscriptionIntentAction } from "@/lib/subscription/actions";
import { getSubscriptionPlanCatalog } from "@/lib/subscription/planCatalog";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "";
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL ?? "";

const CheckoutForm = ({ returnUrl }: { returnUrl: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    });

    if (error) {
      toast.error(error.message ?? "Payment failed.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || submitting}>
        {submitting ? "Processing..." : "Pay now"}
      </Button>
    </form>
  );
};

const SubscriptionCheckout = ({
  plan,
  onClose,
  showBack = true,
  showPlanSelector = true,
}: {
  plan: "monthly" | "annual";
  onClose?: () => void;
  showBack?: boolean;
  showPlanSelector?: boolean;
}) => {
  const params = useParams<{ businessSlug?: string }>();
  const plans = getSubscriptionPlanCatalog(30);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(plan);

  const priceId =
    selectedPlan === "annual" ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID;

  const returnUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (!params?.businessSlug) return window.location.origin;
    return `${window.location.origin}/${params.businessSlug}/subscription`;
  }, [params?.businessSlug]);

  const startPayment = async () => {
    if (!priceId) {
      toast.error("Missing Stripe price configuration.");
      return;
    }

    setLoading(true);
    try {
      const data = await createSubscriptionIntentAction({
        priceId,
        withTrial: false,
      });
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error(error);
      toast.error("Unable to create payment.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setSelectedPlan(plan);
    setClientSecret(null);
  }, [plan]);

  React.useEffect(() => {
    void startPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceId]);

  return (
    <section className="glass-card p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">Checkout</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Enter payment details to start your subscription.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-accent-3 bg-primary/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-contrast/70">
            {selectedPlan === "annual" ? "Annual" : "Monthly"} plan
          </span>
          {showBack ? (
            <Button
              type="button"
              variant="neutral"
              onClick={() => {
                if (onClose) {
                  onClose();
                  return;
                }
                if (!params?.businessSlug) return;
                window.location.href = `/${params.businessSlug}/subscription`;
              }}
            >
              Back to subscription
            </Button>
          ) : null}
        </div>
      </div>

      {showPlanSelector ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <SubscriptionCard
            variant="glassy"
            title={plans.monthly.title}
            price={plans.monthly.price}
            interval={plans.monthly.interval}
            description={plans.monthly.description}
            features={plans.monthly.features}
            highlighted={selectedPlan === "monthly"}
            action={
              <Button
                type="button"
                onClick={() => setSelectedPlan("monthly")}
                variant={selectedPlan === "monthly" ? "brand" : "neutral"}
                className="w-full"
              >
                {selectedPlan === "monthly" ? "Selected" : "Choose monthly"}
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
            badge={plans.annual.badge}
            highlighted={selectedPlan === "annual"}
            action={
              <Button
                type="button"
                onClick={() => setSelectedPlan("annual")}
                variant={selectedPlan === "annual" ? "brand" : "neutral"}
                className="w-full"
              >
                {selectedPlan === "annual" ? "Selected" : "Choose annual"}
              </Button>
            }
          />
        </div>
      ) : null}

      {!clientSecret ? (
        <div className="mt-6 text-sm text-contrast/70">
          {loading ? "Preparing payment..." : "Preparing payment..."}
        </div>
      ) : null}

      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "night",
              variables: {
                colorPrimary: "#e6345a",
                colorBackground: "rgb(15 23 42)",
                colorText: "rgb(248 250 252)",
                colorDanger: "rgb(239 68 68)",
                colorSuccess: "#e6345a",
              },
              rules: {
                ".Tab": {
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderColor: "rgba(255, 255, 255, 0.15)",
                },
                ".Tab:hover": {
                  borderColor: "rgba(255, 255, 255, 0.4)",
                },
                ".Tab--selected": {
                  backgroundColor: "rgba(230, 52, 90, 0.12)",
                  borderColor: "#e6345a",
                  boxShadow: "0 0 0 1px #e6345a",
                },
                ".Label": {
                  color: "rgba(255, 255, 255, 0.7)",
                },
                ".Input": {
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  borderColor: "rgba(255, 255, 255, 0.18)",
                },
                ".Input:focus": {
                  borderColor: "#e6345a",
                  boxShadow: "0 0 0 1px #e6345a",
                },
              },
            },
          }}
        >
          <CheckoutForm returnUrl={returnUrl} />
        </Elements>
      ) : null}
    </section>
  );
};

export default SubscriptionCheckout;
