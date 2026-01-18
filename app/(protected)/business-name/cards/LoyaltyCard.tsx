"use client";

import React from "react";

type LoyaltyCardProps = {
  businessName: string;
  ownerName: string;
  maxPoints: number;
  filledPoints?: number;
  rewardsCollected?: number;
  className?: string;
};

const LoyaltyCard = ({
  businessName,
  ownerName,
  maxPoints,
  filledPoints = 0,
  rewardsCollected = 0,
  className = "",
}: LoyaltyCardProps) => {
  const safeMax = Math.max(1, Math.min(24, maxPoints));
  const safeFilled = Math.min(Math.max(0, filledPoints), safeMax);
  const shouldSplitRows = safeMax > 6;
  const firstRowCount = shouldSplitRows ? Math.ceil(safeMax / 2) : safeMax;
  const secondRowCount = shouldSplitRows ? safeMax - firstRowCount : 0;
  const stamps = Array.from({ length: safeMax });

  return (
    <div
      className={`w-full max-w-[360px] aspect-[1.586/1] rounded-2xl border border-accent-3 bg-accent-1 p-5 text-contrast ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-brand">{businessName}</h3>
        <div className="rounded-full border border-accent-3 bg-primary px-3 py-1 text-xs font-semibold text-contrast/80">
          {safeFilled}/{safeMax} stamps
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap justify-between gap-2">
          {stamps.slice(0, firstRowCount).map((_, index) => {
            const isFilled = index < safeFilled;
            return (
              <div
                key={`stamp-${index}`}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                  isFilled
                    ? "border-brand/50 bg-brand/15 text-brand"
                    : "border-accent-3 bg-primary text-contrast/60"
                }`}
              >
                {index + 1}
              </div>
            );
          })}
        </div>
        {secondRowCount > 0 ? (
          <div className="flex flex-wrap justify-between gap-2">
            {stamps.slice(firstRowCount).map((_, index) => {
              const absoluteIndex = firstRowCount + index;
              const isFilled = absoluteIndex < safeFilled;
              return (
                <div
                  key={`stamp-${absoluteIndex}`}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition ${
                    isFilled
                      ? "border-brand/50 bg-brand/15 text-brand"
                      : "border-accent-3 bg-primary text-contrast/60"
                  }`}
                >
                  {absoluteIndex + 1}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-contrast/70">
        <span>Owner: {ownerName}</span>
        <span>Rewards collected: {rewardsCollected}</span>
      </div>
    </div>
  );
};

export default LoyaltyCard;
