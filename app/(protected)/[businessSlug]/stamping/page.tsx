"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { stampCard, type StampCardResult } from "@/api/client/userCard.api";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";

const StampingPage = () => {
  const [cardId, setCardId] = useState("");
  const [result, setResult] = useState<StampCardResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStamp = async () => {
    const trimmed = cardId.trim();
    if (!trimmed) {
      toast.error("Enter a card ID first.");
      return;
    }

    setLoading(true);
    try {
      const data = await stampCard(trimmed);
      setResult(data);
      toast.success("Stamp applied.");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Unable to apply stamp.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <h2 className="text-xl font-semibold text-brand">Stamping</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Enter a loyalty card ID to apply a stamp for this business.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
        <CustomInput
          id="card-id"
          label="Card ID"
          placeholder="Paste card ID from the QR code"
          value={cardId}
          onChange={(event) => setCardId(event.target.value)}
          helperText="You can find this in the QR code payload on the customer card."
          className="w-full"
        />
        <Button onClick={handleStamp} disabled={loading}>
          {loading ? "Stamping..." : "Stamp card"}
        </Button>
      </div>

      {result ? (
        <div className="mt-6 rounded-lg border border-accent-3 bg-primary p-4 text-sm text-contrast">
          <p className="font-semibold text-contrast">Stamp applied</p>
          <p className="mt-2 text-contrast/70">
            {result.customerName} • {result.customerEmail}
          </p>
          <p className="mt-2 text-contrast/70">{result.cardTitle}</p>
          <p className="mt-3 text-sm text-contrast">
            {result.stampCount}/{result.maxPoints} stamps
          </p>
          {result.walletUpdated === false ? (
            <p className="mt-2 text-xs text-brand">
              Stamp saved, but Google Wallet failed to update.
            </p>
          ) : result.walletUpdated ? (
            <p className="mt-2 text-xs text-contrast/70">
              Google Wallet updated.
            </p>
          ) : null}
          {result.completed ? (
            <p className="mt-2 text-xs text-brand">
              Card completed. Start a new cycle to continue stamping.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export default StampingPage;
