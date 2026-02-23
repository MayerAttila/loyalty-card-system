"use client";

import { useEffect, useState } from "react";
import type { CustomerCardPreview } from "@/api/client/customer.api";
import { detectWalletPlatform, type WalletPlatform } from "./walletPlatform";
import WalletCardPreview from "@/app/(protected)/[businessSlug]/cards/WalletCardPreview";
import WalletSaveButtons from "./WalletSaveButtons";

type AddToWalletFormProps = {
  saveUrl?: string;
  applePassUrl?: string;
  loading?: boolean;
  errorMessage?: string;
  preview?: CustomerCardPreview | null;
  showWalletButtons?: boolean;
};

const AddToWalletForm = ({
  saveUrl,
  applePassUrl,
  loading = false,
  errorMessage,
  preview,
  showWalletButtons = true,
}: AddToWalletFormProps) => {
  const [walletPlatform, setWalletPlatform] = useState<WalletPlatform>("other");

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

  return (
    <div className="space-y-4">
      <div>
        <p className="mt-2 text-sm text-contrast/70">
          Save your loyalty card in {walletTypeLabel}.
        </p>
      </div>

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
      {errorMessage ? (
        <p className="text-sm text-brand">{errorMessage}</p>
      ) : !loading && !hasAnyWalletLink ? (
        <p className="text-sm text-contrast/70">
          Wallet save link will appear once the card is ready.
        </p>
      ) : null}
      {showWalletButtons ? (
        <WalletSaveButtons
          saveUrl={saveUrl}
          applePassUrl={applePassUrl}
          loading={loading}
          size="default"
          layout="stack"
        />
      ) : null}
    </div>
  );
};

export default AddToWalletForm;
