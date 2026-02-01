"use client";

import React, { useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import { createSubscriptionIntent } from "@/api/client/billing.api";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY ?? "";
const ANNUAL_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL ?? "";

const CheckoutForm = ({
  clientSecret,
  returnUrl,
}: {
  clientSecret: string;
  returnUrl: string;
}) => {
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
      return;
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

const CheckoutClient = () => {
  const params = useParams<{ businessSlug?: string }>();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">(
    planParam === "annual" ? "annual" : "monthly"
  );

  const priceId =
    selectedPlan === "annual" ? ANNUAL_PRICE_ID : MONTHLY_PRICE_ID;

  const returnUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    if (!params?.businessSlug) return window.location.origin;
    return `${window.location.origin}/${params.businessSlug}/billing`;
  }, [params?.businessSlug]);

  const startPayment = async () => {
    if (!priceId) {
      toast.error("Missing Stripe price configuration.");
      return;
    }
    setLoading(true);
    try {
      const data = await createSubscriptionIntent({
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
    void startPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceId]);

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">Checkout</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Enter payment details to start your subscription.
          </p>
        </div>
        <Button
          type="button"
          variant="neutral"
          onClick={() => {
            if (!params?.businessSlug) return;
            window.location.href = `/${params.businessSlug}/billing`;
          }}
        >
          Back to billing
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setSelectedPlan("monthly")}
          className={`rounded-lg border p-4 text-left ${
            selectedPlan === "monthly"
              ? "border-brand bg-primary/60"
              : "border-accent-3 bg-primary/30"
          }`}
        >
          <p className="text-sm font-semibold text-contrast">Monthly</p>
          <p className="mt-2 text-xs text-contrast/70">€7.99 per month</p>
        </button>
        <button
          type="button"
          onClick={() => setSelectedPlan("annual")}
          className={`rounded-lg border p-4 text-left ${
            selectedPlan === "annual"
              ? "border-brand bg-primary/60"
              : "border-accent-3 bg-primary/30"
          }`}
        >
          <p className="text-sm font-semibold text-contrast">Annual</p>
          <p className="mt-2 text-xs text-contrast/70">€79.99 per year</p>
        </button>
      </div>

      {!clientSecret ? (
        <div className="mt-6 text-sm text-contrast/70">
          {loading ? "Preparing payment..." : "Preparing payment..."}
        </div>
      ) : null}

      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{ clientSecret, appearance: { theme: "night" } }}
        >
          <CheckoutForm clientSecret={clientSecret} returnUrl={returnUrl} />
        </Elements>
      ) : null}
    </section>
  );
};

export default CheckoutClient;
