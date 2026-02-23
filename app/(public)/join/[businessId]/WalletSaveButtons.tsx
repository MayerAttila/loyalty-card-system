"use client";

import { useEffect, useState } from "react";
import {
  detectWalletPlatform,
  type WalletPlatform,
} from "./walletPlatform";

type WalletSaveButtonsProps = {
  saveUrl?: string;
  applePassUrl?: string;
  loading?: boolean;
  size?: "default" | "footer";
  layout?: "stack" | "row";
};

const WalletSaveButtons = ({
  saveUrl,
  applePassUrl,
  loading = false,
  size = "default",
  layout = "stack",
}: WalletSaveButtonsProps) => {
  const [walletPlatform, setWalletPlatform] = useState<WalletPlatform>("other");
  const [googleBadgeMissing, setGoogleBadgeMissing] = useState(false);
  const [appleBadgeMissing, setAppleBadgeMissing] = useState(false);

  useEffect(() => {
    setWalletPlatform(detectWalletPlatform());
  }, []);

  const showGoogleWallet = walletPlatform !== "ios";
  const showAppleWallet = walletPlatform !== "android";
  const googleBadgeSrc = "/wallet/google/en.svg";
  const appleBadgeSrc = "/wallet/apple/en.svg";

  const badgeImageClassName =
    size === "footer"
      ? "block h-10 w-auto max-w-full sm:h-11"
      : "block h-11 w-auto max-w-full sm:h-12";
  const badgeDisabledClassName = `${badgeImageClassName} opacity-60`;
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

    if (googleBadgeMissing) {
      return (
        <button
          type="button"
          className={fallbackButtonClassName}
          disabled={!saveUrl || loading}
          onClick={() => {
            if (saveUrl) {
              window.location.href = saveUrl;
            }
          }}
        >
          Add to Google Wallet
        </button>
      );
    }

    if (saveUrl && !loading) {
      return (
        <a href={saveUrl} className="block w-fit">
          <img
            src={googleBadgeSrc}
            alt="Add to Google Wallet"
            className={badgeImageClassName}
            onError={() => setGoogleBadgeMissing(true)}
          />
        </a>
      );
    }

    return (
      <img
        src={googleBadgeSrc}
        alt="Add to Google Wallet"
        className={badgeDisabledClassName}
        onError={() => setGoogleBadgeMissing(true)}
      />
    );
  };

  const renderApple = () => {
    if (!showAppleWallet) return null;

    if (appleBadgeMissing) {
      return (
        <button
          type="button"
          className={fallbackButtonClassName}
          disabled={!applePassUrl || loading}
          onClick={() => {
            if (applePassUrl) {
              window.location.href = applePassUrl;
            }
          }}
        >
          Add to Apple Wallet
        </button>
      );
    }

    if (applePassUrl && !loading) {
      return (
        <a href={applePassUrl} className="block w-fit">
          <img
            src={appleBadgeSrc}
            alt="Add to Apple Wallet"
            className={badgeImageClassName}
            onError={() => setAppleBadgeMissing(true)}
          />
        </a>
      );
    }

    return (
      <img
        src={appleBadgeSrc}
        alt="Add to Apple Wallet"
        className={badgeDisabledClassName}
        onError={() => setAppleBadgeMissing(true)}
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
