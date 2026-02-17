"use client";

export type WalletPlatform = "ios" | "android" | "other";

export function detectWalletPlatform(): WalletPlatform {
  if (typeof navigator === "undefined") {
    return "other";
  }

  const userAgent = navigator.userAgent ?? "";
  const platform = navigator.platform ?? "";
  const touchPoints = navigator.maxTouchPoints ?? 0;

  const isIOS =
    /iPad|iPhone|iPod/i.test(userAgent) ||
    (platform === "MacIntel" && touchPoints > 1);
  if (isIOS) {
    return "ios";
  }

  if (/Android/i.test(userAgent)) {
    return "android";
  }

  return "other";
}
