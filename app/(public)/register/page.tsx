"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import BusinessRegistrationForm from "./BusinessRegistrationForm";
import Stepper from "@/components/Stepper";
import SubscriptionTiers from "@/components/SubscriptionTiers";
import SubscriptionCheckout from "@/components/SubscriptionCheckout";
import { startTrialNoCard } from "@/api/client/subscription.api";

const steps = [
  { key: "info", label: "Info" },
  { key: "plan", label: "Plan" },
];

const stepperTheme = {
  connectorWidthPx: 90,
  connectorGapPx: 14,
  connectorDurationMs: 300,
  dotDurationMs: 120,
  brand: "rgb(var(--color-brand))",
  track: "rgb(var(--color-accent-3) / 0.6)",
  dotBg: "transparent",
  inactiveBorder: "rgb(var(--color-accent-3))",
  inactiveText: "rgb(var(--color-contrast) / 0.6)",
  activeText: "rgb(var(--color-brand))",
  completeText: "rgb(var(--color-primary))",
  labelInactive: "rgb(var(--color-contrast) / 0.7)",
};

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [businessSlug, setBusinessSlug] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<"monthly" | "annual" | null>(
    null,
  );

  const requestStep = (next: number) => {
    if (pendingStep !== null) return;
    if (next < 0 || next > steps.length - 1) return;
    if (next === activeStep) return;
    setPendingStep(next);
  };

  return (
    <main className="min-h-screen bg-transparent text-contrast">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Get started
          </p>
          <h1 className="text-3xl font-semibold text-brand">
            Register your business
          </h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            Create a business account to start managing loyalty programs and
            invite employees later.
          </p>
        </header>
        <div className="mb-8 ">
          <Stepper
            steps={steps}
            activeStep={activeStep}
            pendingStep={pendingStep}
            theme={stepperTheme}
            onCommitStep={(step) => {
              setActiveStep(step);
              setPendingStep(null);
            }}
          />
        </div>

        {activeStep === 0 ? (
          <BusinessRegistrationForm
            onRegistered={(slug) => {
              setBusinessSlug(slug);
              requestStep(1);
            }}
          />
        ) : (
          <div className="space-y-6">
            <SubscriptionTiers
              trialDays={30}
              actionLoading={actionLoading}
              isActive={false}
              status={null}
              monthlyPriceId=""
              annualPriceId=""
              selectedPlan={checkoutPlan ?? null}
              onStartTrial={async () => {
                if (!businessSlug || actionLoading) return;
                setActionLoading(true);
                try {
                  await startTrialNoCard();
                  toast.success("Trial started.");
                  window.location.href = `/${businessSlug}`;
                } catch (error) {
                  console.error(error);
                  toast.error("Unable to start trial.");
                } finally {
                  setActionLoading(false);
                }
              }}
              onSubscribeMonthly={() => {
                if (!businessSlug) return;
                setCheckoutPlan("monthly");
              }}
              onSubscribeAnnual={() => {
                if (!businessSlug) return;
                setCheckoutPlan("annual");
              }}
            />

            {checkoutPlan ? (
              <SubscriptionCheckout
                plan={checkoutPlan}
                showPlanSelector={false}
                showBack={false}
                onClose={() => setCheckoutPlan(null)}
              />
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
};

export default RegisterPage;
