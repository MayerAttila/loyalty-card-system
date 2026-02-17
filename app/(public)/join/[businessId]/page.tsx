"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import AddToWalletForm from "./AddToWalletForm";
import JoinCustomerDetailsStep from "./JoinCustomerDetailsStep";
import Stepper, { StepperTheme } from "@/components/Stepper";
import { createCustomer } from "@/api/client/customer.api";
import type { CustomerCardPreview } from "@/api/client/customer.api";
import {
  getAppleWalletPassUrl,
  getGoogleWalletSaveLink,
} from "@/api/client/userCard.api";
import { toast } from "react-toastify";
import { detectWalletPlatform } from "./walletPlatform";

const steps = [
  { key: "details", label: "Details", description: "Enter your information" },
  {
    key: "wallet",
    label: "Wallet",
    description: "Save your loyalty card",
  },
];

const JoinPage = () => {
  const params = useParams<{ businessId?: string | string[] }>();
  const [activeStep, setActiveStep] = useState(0);
  const [pendingStep, setPendingStep] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const [saveUrl, setSaveUrl] = useState<string | undefined>();
  const [applePassUrl, setApplePassUrl] = useState<string | undefined>();
  const [walletError, setWalletError] = useState<string | undefined>();
  const [walletPreview, setWalletPreview] =
    useState<CustomerCardPreview | null>(null);

  const isAnimating = pendingStep !== null;

  // ✅ All styling + timing configured HERE
  const stepperTheme = {
    connectorWidthPx: 90,
    connectorGapPx: 14,
    connectorDurationMs: 300,
    dotDurationMs: 120,

    // your tokens (rgb triples)
    brand: "rgb(var(--color-brand))",
    track: "rgb(var(--color-accent-3) / 0.6)",

    dotBg: "transparent",
    inactiveBorder: "rgb(var(--color-accent-3))",
    inactiveText: "rgb(var(--color-contrast) / 0.6)",

    activeText: "rgb(var(--color-brand))",
    completeText: "rgb(var(--color-primary))",

    labelInactive: "rgb(var(--color-contrast) / 0.7)",
  };

  const requestStep = (next: number) => {
    if (isAnimating) return;
    if (next < 0 || next > steps.length - 1) return;
    if (next === activeStep) return;
    setPendingStep(next);
  };

  const handleJoinSubmit = async () => {
    if (submitting) return;

    const businessId = Array.isArray(params?.businessId)
      ? params?.businessId[0]
      : params?.businessId;

    if (!businessId) {
      toast.error("Missing business link.");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!customerEmail.trim()) {
      toast.error("Email is required.");
      return;
    }

    setSubmitting(true);
    setWalletError(undefined);
    setSaveUrl(undefined);
    setApplePassUrl(undefined);
    setWalletPreview(null);

    try {
      const result = await createCustomer({
        name: customerName.trim(),
        email: customerEmail.trim(),
        businessId,
      });

      setWalletLoading(true);
      const cardId = result?.cardId;
      if (!cardId) {
        setWalletError("No loyalty card found for this customer.");
        toast.error("No loyalty card found for this customer.");
        setWalletLoading(false);
        requestStep(1);
        return;
      }

      setWalletPreview(
        result.cardPreview ?? {
          issuerName: "Loyale",
          programName: "Stamps",
          maxPoints: 10,
          cardColor: "#d43555",
          logoUrl: null,
        },
      );

      const walletPlatform = detectWalletPlatform();

      if (walletPlatform !== "android") {
        setApplePassUrl(getAppleWalletPassUrl(cardId));
      }

      if (walletPlatform !== "ios") {
        const wallet = await getGoogleWalletSaveLink(cardId);
        setSaveUrl(wallet?.saveUrl);
        if (!wallet?.saveUrl) {
          setWalletError("Unable to generate Wallet link.");
          toast.error("Unable to generate Wallet link.");
        }
      }
      requestStep(1);
    } catch (error) {
      console.error(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ??
        (error instanceof Error ? error.message : "Unable to register.");
      toast.error(message);
    } finally {
      setSubmitting(false);
      setWalletLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-contrast">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Join the loyalty program
          </p>
          <h1 className="text-3xl font-semibold text-brand">
            Get your digital card
          </h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            Complete your details first, then add your card to Google Wallet.
          </p>
        </header>

        <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
          <div className="mb-8">
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

          <div className="rounded-lg border border-accent-3 bg-primary p-6">
            {activeStep === 0 ? (
              <JoinCustomerDetailsStep
                customerName={customerName}
                customerEmail={customerEmail}
                submitting={submitting}
                onCustomerNameChange={setCustomerName}
                onCustomerEmailChange={setCustomerEmail}
                onSubmit={handleJoinSubmit}
              />
            ) : (
              <AddToWalletForm
                saveUrl={saveUrl}
                applePassUrl={applePassUrl}
                loading={walletLoading}
                errorMessage={walletError}
                preview={walletPreview}
              />
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="neutral"
              onClick={() => requestStep(activeStep - 1)}
              disabled={activeStep === 0 || isAnimating}
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (activeStep === 0) {
                  void handleJoinSubmit();
                  return;
                }
                requestStep(activeStep + 1);
              }}
              disabled={
                activeStep === steps.length - 1 || isAnimating || submitting
              }
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JoinPage;
