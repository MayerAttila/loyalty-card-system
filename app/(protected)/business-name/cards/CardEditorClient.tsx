"use client";

import React, { useMemo, useState } from "react";
import CustomInput from "@/components/CustomInput";
import LoyaltyCard from "./LoyaltyCard";

type CardEditorClientProps = {
  initialBusinessName?: string;
  initialMaxPoints?: number;
  initialFilledPoints?: number;
  initialCardColor?: string;
  initialAccentColor?: string;
  initialTextColor?: string;
};

const CardEditorClient = ({
  initialBusinessName = "Coffee Club",
  initialMaxPoints = 10,
  initialFilledPoints = 3,
  initialCardColor = "#121826",
  initialAccentColor = "#f59e0b",
  initialTextColor = "#f8fafc",
}: CardEditorClientProps) => {
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [maxPoints, setMaxPoints] = useState(initialMaxPoints);
  const [filledPoints, setFilledPoints] = useState(initialFilledPoints);
  const rewardsCollected = 1;
  const [cardColor, setCardColor] = useState(initialCardColor);
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [textColor, setTextColor] = useState(initialTextColor);

  const sanitized = useMemo(() => {
    const safeMax = Math.max(4, Math.min(16, maxPoints || 4));
    const safeFilled = Math.min(Math.max(0, filledPoints || 0), safeMax);
    const safeRewards = Math.max(0, rewardsCollected || 0);

    return {
      businessName: businessName.trim() || "Business Name",
      ownerName: "Card holder",
      maxPoints: safeMax,
      filledPoints: safeFilled,
      rewardsCollected: safeRewards,
      cardColor,
      accentColor,
      textColor,
    };
  }, [
    accentColor,
    businessName,
    cardColor,
    filledPoints,
    maxPoints,
    rewardsCollected,
    textColor,
  ]);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="rounded-xl border border-accent-3 bg-primary/40 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-contrast/70">
          Card Details
        </h3>
        <div className="mt-4 space-y-4">
          <CustomInput
            id="cardBusinessName"
            placeholder="Business name"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-contrast/70">
              Max stamps
              <input
                type="number"
                min={4}
                max={16}
                value={maxPoints}
                onChange={(event) =>
                  setMaxPoints(Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-accent-3 bg-primary px-4 py-3 text-sm text-contrast outline-none"
              />
            </label>
            <label className="block text-xs text-contrast/70">
              Stamps filled
              <input
                type="number"
                min={0}
                max={maxPoints}
                value={filledPoints}
                onChange={(event) =>
                  setFilledPoints(Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-accent-3 bg-primary px-4 py-3 text-sm text-contrast outline-none"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-xs text-contrast/70">
              Card color
              <input
                type="color"
                value={cardColor}
                onChange={(event) => setCardColor(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer rounded-lg border border-accent-3 bg-primary p-1"
              />
            </label>
            <label className="block text-xs text-contrast/70">
              Accent color
              <input
                type="color"
                value={accentColor}
                onChange={(event) => setAccentColor(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer rounded-lg border border-accent-3 bg-primary p-1"
              />
            </label>
            <label className="block text-xs text-contrast/70">
              Text color
              <input
                type="color"
                value={textColor}
                onChange={(event) => setTextColor(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer rounded-lg border border-accent-3 bg-primary p-1"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-accent-3 bg-primary/30 p-5">
        <LoyaltyCard
          businessName={sanitized.businessName}
          ownerName={sanitized.ownerName}
          maxPoints={sanitized.maxPoints}
          filledPoints={sanitized.filledPoints}
          rewardsCollected={sanitized.rewardsCollected}
          cardColor={sanitized.cardColor}
          accentColor={sanitized.accentColor}
          textColor={sanitized.textColor}
        />
      </div>
    </div>
  );
};

export default CardEditorClient;
