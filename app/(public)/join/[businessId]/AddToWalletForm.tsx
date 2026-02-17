"use client";

import { useEffect, useState } from "react";
import type { CustomerCardPreview } from "@/api/client/customer.api";
import {
  detectWalletPlatform,
  type WalletPlatform,
} from "./walletPlatform";
import WalletCardPreview from "@/app/(protected)/[businessSlug]/cards/WalletCardPreview";

type AddToWalletFormProps = {
  saveUrl?: string;
  applePassUrl?: string;
  loading?: boolean;
  errorMessage?: string;
  preview?: CustomerCardPreview | null;
};

const AddToWalletForm = ({
  saveUrl,
  applePassUrl,
  loading = false,
  errorMessage,
  preview,
}: AddToWalletFormProps) => {
  const [walletPlatform, setWalletPlatform] = useState<WalletPlatform>("other");
  const [googleBadgeMissing, setGoogleBadgeMissing] = useState(false);
  const [appleBadgeMissing, setAppleBadgeMissing] = useState(false);

  useEffect(() => {
    setWalletPlatform(detectWalletPlatform());
  }, []);

  const showGoogleWallet = walletPlatform !== "ios";
  const showAppleWallet = walletPlatform !== "android";
  const walletTypeLabel =
    walletPlatform === "ios"
      ? "Apple Wallet"
      : walletPlatform === "android"
        ? "Google Wallet"
        : "Google Wallet or Apple Wallet";
  const hasAnyWalletLink = Boolean(
    (showGoogleWallet && saveUrl) || (showAppleWallet && applePassUrl),
  );
  const googleBadgeSrc = "/wallet/google/en.svg";
  const appleBadgeSrc = "/wallet/apple/en.svg";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Step 2: Add to Wallet</h2>
        <p className="mt-2 text-sm text-contrast/70">
          Save your loyalty card in {walletTypeLabel}.
        </p>
      </div>

      <div>
        {loading ? (
          <p className="text-sm text-contrast/80">
            Generating your Wallet link...
          </p>
        ) : preview ? (
          <WalletCardPreview
            text1={preview.issuerName}
            text2={preview.programName}
            maxPoints={preview.maxPoints}
            filledPoints={0}
            rewardsCollected={0}
            cardColor={preview.cardColor}
            logoSrc={preview.logoUrl ?? undefined}
            useLogo={Boolean(preview.logoUrl)}
            className="mx-auto"
          />
        ) : (
          <p className="text-sm text-contrast/80">
            Card preview will appear here once the card is created.
          </p>
        )}
      </div>
      {errorMessage ? (
        <p className="text-sm text-brand">{errorMessage}</p>
      ) : !loading && !hasAnyWalletLink ? (
        <p className="text-sm text-contrast/70">
          Wallet save link will appear once the card is ready.
        </p>
      ) : null}
      {showGoogleWallet ? (
        <div className="w-full">
          {googleBadgeMissing ? (
            <button
              type="button"
              className="w-full py-2 text-sm font-semibold text-contrast/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!saveUrl || loading}
              onClick={() => {
                if (saveUrl) {
                  window.location.href = saveUrl;
                }
              }}
            >
              Add to Google Wallet
            </button>
          ) : saveUrl && !loading ? (
            <a href={saveUrl} className="mx-auto block w-full max-w-xs">
              <img
                src={googleBadgeSrc}
                alt="Add to Google Wallet"
                className="block h-auto w-full"
                onError={() => setGoogleBadgeMissing(true)}
              />
            </a>
          ) : (
            <img
              src={googleBadgeSrc}
              alt="Add to Google Wallet"
              className="mx-auto block h-auto w-full max-w-xs opacity-60"
              onError={() => setGoogleBadgeMissing(true)}
            />
          )}
        </div>
      ) : null}
      {showAppleWallet ? (
        <div className="w-full">
          {appleBadgeMissing ? (
            <button
              type="button"
              className="w-full py-2 text-sm font-semibold text-contrast/90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!applePassUrl || loading}
              onClick={() => {
                if (applePassUrl) {
                  window.location.href = applePassUrl;
                }
              }}
            >
              Add to Apple Wallet
            </button>
          ) : applePassUrl && !loading ? (
            <a href={applePassUrl} className="mx-auto block w-full max-w-xs">
              <img
                src={appleBadgeSrc}
                alt="Add to Apple Wallet"
                className="block h-auto w-full"
                onError={() => setAppleBadgeMissing(true)}
              />
            </a>
          ) : (
            <img
              src={appleBadgeSrc}
              alt="Add to Apple Wallet"
              className="mx-auto block h-auto w-full max-w-xs opacity-60"
              onError={() => setAppleBadgeMissing(true)}
            />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default AddToWalletForm;
