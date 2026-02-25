"use client";

import React from "react";
import type { PreviewCardProps } from "./GooglePreviewCard";

const ApplePreviewCard = ({
  text1,
  maxPoints,
  filledPoints = 0,
  rewardsCollected = 0,
  cardColor = "#e6345a",
  logoSrc,
  useLogo = false,
  filledStampSrc,
  emptyStampSrc,
  useStampImages = false,
  className = "",
}: PreviewCardProps) => {
  const safeMax = Math.max(4, Math.min(16, maxPoints));
  const safeFilled = Math.min(Math.max(0, filledPoints), safeMax);
  const shouldUseStampImages =
    useStampImages && Boolean(filledStampSrc) && Boolean(emptyStampSrc);

  const getContrastTextColor = (hexColor: string) => {
    const normalized = hexColor.trim().replace("#", "");
    if (normalized.length !== 6) return "#ffffff";
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.62 ? "#111827" : "#ffffff";
  };

  const toRgb = (hexColor: string) => {
    const hex = hexColor.replace("#", "").trim();
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex;
    if (full.length !== 6) {
      return { r: 230, g: 52, b: 90 };
    }
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
    };
  };

  const withAlpha = (hexColor: string, alpha: number) => {
    const { r, g, b } = toRgb(hexColor);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const textColor = getContrastTextColor(cardColor);
  const isDarkText = textColor !== "#ffffff";
  const mutedText = isDarkText
    ? "rgba(17,24,39,0.75)"
    : "rgba(255,255,255,0.82)";
  const faintText = isDarkText
    ? "rgba(17,24,39,0.58)"
    : "rgba(255,255,255,0.64)";

  const stamps = Array.from({ length: safeMax }, (_, index) => index);
  const columns = safeMax <= 6 ? safeMax : safeMax <= 10 ? 5 : 6;

  return (
    <div
      className={`w-full max-w-[320px] rounded-[22px] border p-4 shadow-[0_18px_35px_rgba(0,0,0,0.22)] ${className}`}
      style={{
        color: textColor,
        borderColor: withAlpha(cardColor, isDarkText ? 0.2 : 0.35),
        backgroundColor: cardColor,
      }}
    >
        <div className="flex items-start justify-between gap-3">
          {useLogo && logoSrc ? (
            <img
              src={logoSrc}
              alt={`${text1} logo`}
              className="h-9 w-9 shrink-0 rounded-full object-contain"
            />
          ) : null}
          <div className="min-w-0 flex-1 text-right">
            <p
              className="text-[9px] leading-tight font-semibold tracking-[0.06em] uppercase"
              style={{ color: mutedText }}
            >
              Business
            </p>
            <p
              className="mt-0.5 truncate text-[13px] leading-tight font-semibold"
              style={{ color: textColor }}
            >
              {text1}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {stamps.map((index) => {
              const isFilled = index < safeFilled;
              const stampTone = withAlpha(textColor, isFilled ? 0.18 : 0.08);
              const stampBorder = withAlpha(textColor, isFilled ? 0.35 : 0.2);

              return (
                <div
                  key={`apple-stamp-${index}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: shouldUseStampImages ? "transparent" : stampTone,
                    border: shouldUseStampImages ? "none" : `1px solid ${stampBorder}`,
                    color: mutedText,
                  }}
                >
                  {shouldUseStampImages ? (
                    <img
                      src={isFilled ? filledStampSrc : emptyStampSrc}
                      alt={isFilled ? "Stamp on" : "Stamp off"}
                      className="h-11 w-11 rounded-full object-contain"
                    />
                  ) : (
                    <span
                      className="leading-none"
                      style={{ color: withAlpha(textColor, 0.85) }}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span
              className="text-[11px] font-semibold tracking-[0.06em] uppercase"
              style={{ color: faintText }}
            >
              Stamps
            </span>
            <span
              className="text-sm font-semibold leading-tight tabular-nums"
              style={{ color: textColor }}
            >
              {safeFilled}/{safeMax}
            </span>
          </div>
          <div className="text-right">
            <span
              className="text-[11px] font-semibold tracking-[0.06em] uppercase"
              style={{ color: faintText }}
            >
              Rewards
            </span>
            <div
              className="text-sm font-semibold leading-tight tabular-nums"
              style={{ color: textColor }}
            >
              {Math.max(0, rewardsCollected)}
            </div>
          </div>
        </div>
    </div>
  );
};

export default ApplePreviewCard;
