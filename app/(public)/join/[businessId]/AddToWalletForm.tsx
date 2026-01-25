import Button from "@/components/Button";

const AddToWalletForm = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Step 2: Add to Wallet</h2>
        <p className="mt-2 text-sm text-contrast/70">
          Tap below to save your loyalty card in Google Wallet.
        </p>
      </div>
      <div className="rounded-lg border border-accent-3 bg-accent-1/50 p-4 text-sm text-contrast/80">
        Wallet save link will appear here once the card is created.
      </div>
      <Button type="button" variant="neutral" className="w-full">
        Add to Google Wallet
      </Button>
    </div>
  );
};

export default AddToWalletForm;
