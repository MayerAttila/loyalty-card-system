"use client";

import CustomInput from "@/components/CustomInput";

type JoinCustomerDetailsStepProps = {
  customerName: string;
  customerEmail: string;
  submitting: boolean;
  onCustomerNameChange: (value: string) => void;
  onCustomerEmailChange: (value: string) => void;
  onSubmit: () => Promise<void>;
};

const JoinCustomerDetailsStep = ({
  customerName,
  customerEmail,
  submitting,
  onCustomerNameChange,
  onCustomerEmailChange,
  onSubmit,
}: JoinCustomerDetailsStepProps) => {
  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <div>
        <h2 className="text-lg font-semibold">Step 1: Your details</h2>
        <p className="mt-2 text-sm text-contrast/70">
          Fill in your name and email to create your loyalty card.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CustomInput
          id="customerName"
          type="text"
          placeholder="Full name"
          value={customerName}
          onChange={(event) => onCustomerNameChange(event.target.value)}
          disabled={submitting}
        />
        <CustomInput
          id="customerEmail"
          type="email"
          placeholder="Email address"
          value={customerEmail}
          onChange={(event) => onCustomerEmailChange(event.target.value)}
          disabled={submitting}
        />
      </div>
    </form>
  );
};

export default JoinCustomerDetailsStep;
