 "use client";

import Button from "@/components/Button";

type AddToWalletFormProps = {
  saveUrl?: string;
  applePassUrl?: string;
  loading?: boolean;
  errorMessage?: string;
};

const AddToWalletForm = ({
  saveUrl,
  applePassUrl,
  loading = false,
  errorMessage,
}: AddToWalletFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Step 2: Add to Wallet</h2>
        <p className="mt-2 text-sm text-contrast/70">
          Save your loyalty card in Google Wallet or Apple Wallet.
        </p>
      </div>
      <div className="rounded-lg border border-accent-3 bg-accent-1/50 p-4 text-sm text-contrast/80">
        {loading
          ? "Generating your Wallet link..."
          : errorMessage
            ? errorMessage
            : saveUrl
              ? "Your Wallet link is ready. Tap below to add it."
              : "Wallet save link will appear here once the card is created."}
      </div>
      <Button
        type="button"
        variant="neutral"
        className="w-full"
        disabled={!saveUrl || loading}
        onClick={() => {
          if (saveUrl) {
            window.location.href = saveUrl;
          }
        }}
      >
        Add to Google Wallet
      </Button>
      <Button
        type="button"
        variant="neutral"
        className="w-full"
        disabled={!applePassUrl || loading}
        onClick={() => {
          if (applePassUrl) {
            window.location.href = applePassUrl;
          }
        }}
      >
        Add to Apple Wallet
      </Button>
    </div>
  );
};

export default AddToWalletForm;
