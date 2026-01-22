"use client";

import React from "react";

type LoyaltyCardProps = {
  businessName: string;
  ownerName: string;
  maxPoints: number;
  filledPoints?: number;
  rewardsCollected?: number;
  cardColor?: string;
  accentColor?: string;
  textColor?: string;
  logoSrc?: string;
  useLogo?: boolean;
  filledStampSrc?: string;
  emptyStampSrc?: string;
  useStampImages?: boolean;
  className?: string;
};

const LoyaltyCard = ({
  businessName,
  ownerName,
  maxPoints,
  filledPoints = 0,
  rewardsCollected = 0,
  cardColor = "#141b2d",
  accentColor = "#f59e0b",
  textColor = "#f8fafc",
  logoSrc,
  useLogo = false,
  filledStampSrc,
  emptyStampSrc,
  useStampImages = false,
  className = "",
}: LoyaltyCardProps) => {
  const safeMax = Math.max(4, Math.min(16, maxPoints));
  const safeFilled = Math.min(Math.max(0, filledPoints), safeMax);
  const shouldSplitRows = safeMax > 6;
  const firstRowCount = shouldSplitRows ? Math.ceil(safeMax / 2) : safeMax;
  const secondRowCount = shouldSplitRows ? safeMax - firstRowCount : 0;
  const stamps = Array.from({ length: safeMax });
  const shouldUseStampImages =
    useStampImages && Boolean(filledStampSrc) && Boolean(emptyStampSrc);

  const withAlpha = (color: string, alpha: number) => {
    const normalized = color.trim();
    if (!normalized.startsWith("#")) return color;
    const hex = normalized.replace("#", "");
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    if (full.length !== 6) return color;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div
      className={`w-full max-w-[360px] aspect-[1.586/1] rounded-2xl border p-5 text-contrast ${className}`}
      style={{
        backgroundColor: cardColor,
        borderColor: withAlpha(accentColor, 0.35),
        color: textColor,
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {useLogo && logoSrc ? (
            <div className="flex h-9 w-9 items-center justify-center bg-transparent">
              <img
                src={logoSrc}
                alt={`${businessName} logo`}
                className="h-7 w-7 object-contain"
              />
            </div>
          ) : null}
          <h3 className="text-lg font-semibold" style={{ color: accentColor }}>
            {businessName}
          </h3>
        </div>
        <div
          className="rounded-full border px-3 py-1 text-xs font-semibold"
          style={{
            borderColor: withAlpha(accentColor, 0.35),
            backgroundColor: withAlpha(accentColor, 0.12),
            color: withAlpha(textColor, 0.85),
          }}
        >
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
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                  shouldUseStampImages
                    ? ""
                    : isFilled
                      ? "border"
                      : "border border-accent-3 bg-primary text-contrast/60"
                }`}
                style={
                  shouldUseStampImages
                    ? {
                        backgroundColor: "transparent",
                      }
                    : isFilled
                      ? {
                          borderColor: withAlpha(accentColor, 0.6),
                          backgroundColor: withAlpha(accentColor, 0.18),
                          color: accentColor,
                        }
                      : {
                          borderColor: withAlpha(textColor, 0.18),
                          backgroundColor: withAlpha(textColor, 0.06),
                          color: withAlpha(textColor, 0.65),
                        }
                }
              >
                {shouldUseStampImages ? (
                  <img
                    src={isFilled ? filledStampSrc : emptyStampSrc}
                    alt={isFilled ? "Stamp on" : "Stamp off"}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  index + 1
                )}
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
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition ${
                    shouldUseStampImages
                      ? ""
                      : isFilled
                        ? "border"
                        : "border border-accent-3 bg-primary text-contrast/60"
                  }`}
                  style={
                    shouldUseStampImages
                      ? {
                          backgroundColor: "transparent",
                        }
                      : isFilled
                        ? {
                            borderColor: withAlpha(accentColor, 0.6),
                            backgroundColor: withAlpha(accentColor, 0.18),
                            color: accentColor,
                          }
                        : {
                            borderColor: withAlpha(textColor, 0.18),
                            backgroundColor: withAlpha(textColor, 0.06),
                            color: withAlpha(textColor, 0.65),
                          }
                  }
                >
                  {shouldUseStampImages ? (
                    <img
                      src={isFilled ? filledStampSrc : emptyStampSrc}
                      alt={isFilled ? "Stamp on" : "Stamp off"}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    absoluteIndex + 1
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div
        className="mt-4 flex items-center justify-between text-sm"
        style={{ color: withAlpha(textColor, 0.7) }}
      >
        <span> {ownerName}</span>
        <span>Rewards: {rewardsCollected}</span>
      </div>
    </div>
  );
};

export default LoyaltyCard;
