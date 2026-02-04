"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  getCardById,
  stampCard,
  type CardDetails,
  type StampCardResult,
} from "@/api/client/userCard.api";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import ScannerModal from "./ScannerModal";

const StampingPage = () => {
  const [cardId, setCardId] = useState("");
  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [stampAmount, setStampAmount] = useState("1");
  const [result, setResult] = useState<StampCardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const currentCycle = cardDetails?.customerLoyaltyCardCycles?.[0];
  const currentStamps = currentCycle?.stampCount ?? 0;
  const maxPoints = cardDetails?.template?.maxPoints ?? 0;

  const handleScan = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setCardId(trimmed);
    setResult(null);
    setCardDetails(null);
    setDetailsLoading(true);
    try {
      const details = await getCardById(trimmed);
      setCardDetails(details);
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : "Unable to load card details.";
      toast.error(message);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStamp = async () => {
    const trimmed = cardId.trim();
    if (!trimmed) {
      toast.error("Scan a card first.");
      return;
    }

    const parsedAmount = Number.parseInt(stampAmount.trim(), 10);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Enter a valid stamp amount (1 or more).");
      return;
    }

    setLoading(true);
    try {
      const data = await stampCard(trimmed, parsedAmount);
      setResult(data);
      toast.success("Stamp applied.");
      setCardId("");
      setCardDetails(null);
      setStampAmount("1");
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
        Scan the customer QR code to load their loyalty card.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-contrast/70">
          {cardDetails
            ? "Card loaded. Review details and apply stamps."
            : "No card scanned yet."}
        </div>
        <Button
          variant="neutral"
          onClick={() => setScannerOpen(true)}
          disabled={loading || detailsLoading}
        >
          {cardDetails ? "Scan another card" : "Scan QR"}
        </Button>
      </div>

      {detailsLoading || cardDetails ? (
        <div className="mt-4 rounded-xl border border-accent-3 bg-primary/40 p-5">
          {detailsLoading ? (
            <p className="text-sm text-contrast/70">Loading card details...</p>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-contrast/60">
                  Customer
                </p>
                <p className="mt-1 text-base font-semibold text-contrast">
                  {cardDetails?.customer?.name ?? "Unknown"}
                </p>
                <p className="text-sm text-contrast/70">
                  {cardDetails?.customer?.email ?? ""}
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-contrast/60">
                    Card
                  </p>
                  <p className="mt-1 text-sm text-contrast/80">
                    {cardDetails?.template?.template ?? "Loyalty Card"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-contrast/60">
                    Progress
                  </p>
                  <p className="mt-1 text-sm text-contrast/80">
                    {currentStamps}/{maxPoints} stamps
                  </p>
                  {currentCycle?.cycleNumber ? (
                    <p className="text-xs text-contrast/60">
                      Cycle {currentCycle.cycleNumber}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {cardDetails ? (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="w-full sm:max-w-[220px]">
            <CustomInput
              id="stamp-amount"
              label="Stamps to add"
              placeholder="1"
              value={stampAmount}
              onChange={(event) => setStampAmount(event.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleStamp} disabled={loading}>
            {loading ? "Stamping..." : "Stamp card"}
          </Button>
        </div>
      ) : null}

      {result && (result.rewardsEarned ?? 0) > 0 ? (
        <div className="mt-6 rounded-lg border border-brand/30 bg-brand/10 p-4 text-sm text-brand">
          Reward unlocked for {result.customerName}.
        </div>
      ) : null}

      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={handleScan}
      />
    </section>
  );
};

export default StampingPage;
