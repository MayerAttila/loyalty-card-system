"use client";

import React from "react";

type WalletCardPreviewProps = {
  text1: string;
  text2: string;
  maxPoints: number;
  filledPoints?: number;
  rewardsCollected?: number;
  cardColor?: string;
  logoSrc?: string;
  useLogo?: boolean;
  filledStampSrc?: string;
  emptyStampSrc?: string;
  useStampImages?: boolean;
  className?: string;
};

const WalletCardPreview = ({
  text1,
  text2,
  maxPoints,
  filledPoints = 0,
  rewardsCollected = 0,
  cardColor = "#141b2d",
  logoSrc,
  useLogo = false,
  filledStampSrc,
  emptyStampSrc,
  useStampImages = false,
  className = "",
}: WalletCardPreviewProps) => {
  const safeMax = Math.max(4, Math.min(16, maxPoints));
  const safeFilled = Math.min(Math.max(0, filledPoints), safeMax);
  const stamps = Array.from({ length: safeMax });
  const firstRowCount = Math.ceil(safeMax / 2);
  const secondRowCount = safeMax - firstRowCount;
  const shouldUseStampImages =
    useStampImages && Boolean(filledStampSrc) && Boolean(emptyStampSrc);

  const getContrastTextColor = (hexColor: string) => {
    const normalized = hexColor.trim().replace("#", "");
    if (normalized.length !== 6) return "#ffffff";
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? "#0f172a" : "#ffffff";
  };

  const textColor = getContrastTextColor(cardColor);

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
      className={`w-full max-w-[320px] rounded-[28px] p-5 shadow-[0_18px_35px_rgba(0,0,0,0.25)] ${className}`}
      style={{ backgroundColor: cardColor, color: textColor }}
    >
      <div className="flex items-center gap-2 text-xs tracking-wide">
        {useLogo && logoSrc ? (
          <img
            src={logoSrc}
            alt={`${text1} logo`}
            className="h-6 w-6 rounded-full object-contain"
          />
        ) : null}
        <span className="truncate" style={{ color: withAlpha(textColor, 0.85) }}>
          {text1}
        </span>
      </div>
      <h3 className="mt-1 text-xl font-semibold leading-tight">
        {text2}
      </h3>

      <div className="mt-5 space-y-2">
        <div className="flex flex-wrap justify-between gap-2">
          {stamps.slice(0, firstRowCount).map((_, index) => {
            const isFilled = index < safeFilled;
            return (
              <div
                key={`stamp-${index}`}
                className="flex h-8 w-8 items-center justify-center text-xs font-semibold"
                style={{
                  backgroundColor: shouldUseStampImages
                    ? "transparent"
                    : withAlpha(textColor, isFilled ? 0.18 : 0.08),
                  borderRadius: "9999px",
                  border: shouldUseStampImages
                    ? "none"
                    : `1px solid ${withAlpha(textColor, isFilled ? 0.35 : 0.2)}`,
                }}
              >
                {shouldUseStampImages ? (
                  <img
                    src={isFilled ? filledStampSrc : emptyStampSrc}
                    alt={isFilled ? "Stamp on" : "Stamp off"}
                    className="h-6 w-6 object-contain"
                  />
                ) : (
                  <span style={{ color: withAlpha(textColor, 0.85) }}>
                    {index + 1}
                  </span>
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
                  className="flex h-8 w-8 items-center justify-center text-xs font-semibold"
                  style={{
                    backgroundColor: shouldUseStampImages
                      ? "transparent"
                      : withAlpha(textColor, isFilled ? 0.18 : 0.08),
                    borderRadius: "9999px",
                    border: shouldUseStampImages
                      ? "none"
                      : `1px solid ${withAlpha(
                          textColor,
                          isFilled ? 0.35 : 0.2
                        )}`,
                  }}
                >
                  {shouldUseStampImages ? (
                    <img
                      src={isFilled ? filledStampSrc : emptyStampSrc}
                      alt={isFilled ? "Stamp on" : "Stamp off"}
                      className="h-6 w-6 object-contain"
                    />
                  ) : (
                    <span style={{ color: withAlpha(textColor, 0.85) }}>
                      {absoluteIndex + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div
        className="mt-4 flex items-center justify-between text-sm"
        style={{ color: withAlpha(textColor, 0.85) }}
      >
        <span>
          Stamps {safeFilled}/{safeMax}
        </span>
        <span>Rewards {Math.max(0, rewardsCollected)}</span>
      </div>

      <div className="mt-5" />
    </div>
  );
};

export default WalletCardPreview;
