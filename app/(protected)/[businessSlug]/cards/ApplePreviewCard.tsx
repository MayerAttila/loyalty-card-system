"use client";

import React from "react";
import type { PreviewCardProps } from "./GooglePreviewCard";

const ApplePreviewCard = ({
  text1,
  text2,
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

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

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

  const mixWithWhite = (hexColor: string, ratio: number) => {
    const { r, g, b } = toRgb(hexColor);
    const clamped = clamp(ratio, 0, 1);
    const mixed = {
      r: Math.round(r + (255 - r) * clamped),
      g: Math.round(g + (255 - g) * clamped),
      b: Math.round(b + (255 - b) * clamped),
    };
    return `rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
  };

  const withAlpha = (hexColor: string, alpha: number) => {
    const { r, g, b } = toRgb(hexColor);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const textColor = getContrastTextColor(cardColor);
  const isDarkText = textColor !== "#ffffff";
  const backgroundTop = mixWithWhite(cardColor, isDarkText ? 0.1 : 0.2);
  const backgroundBottom = mixWithWhite(cardColor, isDarkText ? 0.35 : 0.45);
  const panelBg = isDarkText
    ? "rgba(255,255,255,0.64)"
    : "rgba(255,255,255,0.16)";
  const panelBorder = isDarkText
    ? "rgba(255,255,255,0.72)"
    : "rgba(255,255,255,0.24)";
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
      className={`w-full max-w-[320px] rounded-[22px] border p-3 shadow-[0_18px_35px_rgba(0,0,0,0.22)] ${className}`}
      style={{
        color: textColor,
        borderColor: withAlpha(cardColor, isDarkText ? 0.2 : 0.35),
        background: `linear-gradient(180deg, ${backgroundTop} 0%, ${backgroundBottom} 100%)`,
      }}
    >
      <div
        className="rounded-[18px] border p-3 backdrop-blur-md"
        style={{
          backgroundColor: panelBg,
          borderColor: panelBorder,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {useLogo && logoSrc ? (
                <img
                  src={logoSrc}
                  alt={`${text1} logo`}
                  className="h-7 w-7 rounded-md bg-white/70 object-contain p-0.5"
                />
              ) : null}
              <span
                className="truncate text-[11px] font-semibold tracking-[0.08em] uppercase"
                style={{ color: mutedText }}
              >
                {text1}
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-tight">
              {text2}
            </h3>
          </div>
          <div
            className="shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]"
            style={{
              borderColor: withAlpha(cardColor, isDarkText ? 0.22 : 0.35),
              backgroundColor: withAlpha(cardColor, isDarkText ? 0.08 : 0.15),
              color: mutedText,
            }}
          >
            Loyalty
          </div>
        </div>

        <div className="mt-4">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {stamps.map((index) => {
              const isFilled = index < safeFilled;
              const stampTone = isFilled
                ? withAlpha(cardColor, isDarkText ? 0.24 : 0.28)
                : isDarkText
                  ? "rgba(17,24,39,0.05)"
                  : "rgba(255,255,255,0.08)";
              const stampBorder = isFilled
                ? withAlpha(cardColor, isDarkText ? 0.45 : 0.55)
                : isDarkText
                  ? "rgba(17,24,39,0.14)"
                  : "rgba(255,255,255,0.16)";

              return (
                <div
                  key={`apple-stamp-${index}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold"
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
                      className="h-10 w-10 rounded-full object-contain"
                    />
                  ) : (
                    <span style={{ color: isFilled ? textColor : faintText }}>
                      {index + 1}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs font-medium">
          <div className="flex flex-col">
            <span style={{ color: faintText }}>Stamps</span>
            <span style={{ color: textColor }}>
              {safeFilled}/{safeMax}
            </span>
          </div>
          <div className="text-right">
            <span style={{ color: faintText }}>Rewards</span>
            <div style={{ color: textColor }}>{Math.max(0, rewardsCollected)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplePreviewCard;

