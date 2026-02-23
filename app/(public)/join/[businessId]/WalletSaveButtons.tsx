"use client";

import { useEffect, useState } from "react";
import {
  detectWalletPlatform,
  type WalletPlatform,
} from "./walletPlatform";
import { APPLE_WALLET_BADGE_SVG } from "./appleWalletBadgeSvg";
import { GOOGLE_WALLET_BADGE_SVG } from "./googleWalletBadgeSvg";

type WalletSaveButtonsProps = {
  saveUrl?: string;
  applePassUrl?: string;
  loading?: boolean;
  size?: "default" | "footer";
  layout?: "stack" | "row";
  walletPlatform?: WalletPlatform;
};

const WalletSaveButtons = ({
  saveUrl,
  applePassUrl,
  loading = false,
  size = "default",
  layout = "stack",
  walletPlatform: walletPlatformProp,
}: WalletSaveButtonsProps) => {
  const [detectedWalletPlatform, setDetectedWalletPlatform] =
    useState<WalletPlatform>("other");

  useEffect(() => {
    if (walletPlatformProp) return;
    setDetectedWalletPlatform(detectWalletPlatform());
  }, [walletPlatformProp]);

  const walletPlatform = walletPlatformProp ?? detectedWalletPlatform;
  const showGoogleWallet = walletPlatform !== "ios";
  const showAppleWallet = walletPlatform !== "android";

  const googleBadgeWrapperClassName =
    size === "footer"
      ? "block h-10 w-[145px] sm:h-11 sm:w-[159px] [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
      : "block h-11 w-[159px] sm:h-12 sm:w-[174px] [&_svg]:block [&_svg]:h-full [&_svg]:w-full";
  const googleBadgeDisabledWrapperClassName = `${googleBadgeWrapperClassName} opacity-60`;
  const appleBadgeWrapperClassName =
    size === "footer"
      ? "block h-10 w-[127px] sm:h-11 sm:w-[140px] [&_svg]:block [&_svg]:h-full [&_svg]:w-full"
      : "block h-11 w-[140px] sm:h-12 sm:w-[152px] [&_svg]:block [&_svg]:h-full [&_svg]:w-full";
  const appleBadgeDisabledWrapperClassName = `${appleBadgeWrapperClassName} opacity-60`;
  const fallbackButtonClassName =
    size === "footer"
      ? "inline-flex h-10 min-w-[190px] items-center justify-center rounded-xl border border-accent-4 px-4 text-sm font-semibold text-contrast/90 transition hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60 sm:h-11"
      : "inline-flex h-11 min-w-[220px] items-center justify-center rounded-xl border border-accent-4 px-4 text-sm font-semibold text-contrast/90 transition hover:bg-accent-2 disabled:cursor-not-allowed disabled:opacity-60 sm:h-12";
  const wrapperClassName =
    layout === "row"
      ? "flex flex-col items-center gap-2 sm:flex-row sm:justify-end"
      : "space-y-4";

  const renderGoogle = () => {
    if (!showGoogleWallet) return null;

    if (saveUrl && !loading) {
      return (
        <a href={saveUrl} className="block w-fit">
          <span
            aria-label="Add to Google Wallet"
            className={googleBadgeWrapperClassName}
            dangerouslySetInnerHTML={{ __html: GOOGLE_WALLET_BADGE_SVG }}
          />
        </a>
      );
    }

    return (
      <span
        aria-label="Add to Google Wallet"
        className={googleBadgeDisabledWrapperClassName}
        dangerouslySetInnerHTML={{ __html: GOOGLE_WALLET_BADGE_SVG }}
      />
    );
  };

  const renderApple = () => {
    if (!showAppleWallet) return null;

    if (applePassUrl && !loading) {
      return (
        <a href={applePassUrl} className="block w-fit">
          <span
            aria-label="Add to Apple Wallet"
            className={appleBadgeWrapperClassName}
            dangerouslySetInnerHTML={{ __html: APPLE_WALLET_BADGE_SVG }}
          />
        </a>
      );
    }

    return (
      <span
        aria-label="Add to Apple Wallet"
        className={appleBadgeDisabledWrapperClassName}
        dangerouslySetInnerHTML={{ __html: APPLE_WALLET_BADGE_SVG }}
      />
    );
  };

  return (
    <div className={wrapperClassName}>
      {renderGoogle()}
      {renderApple()}
    </div>
  );
};

export default WalletSaveButtons;
