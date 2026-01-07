"use client";

import CustomInput from "@/components/CustomInput";
import { toast } from "react-toastify";
import { createBusiness } from "@/api/client/business.api";
import { CreateBusinessPayload } from "@/api/client/business.api";

const BusinessRegistrationForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);

    const payload: CreateBusinessPayload = {
      name: String(formData.get("businessName") ?? ""),
      email: String(formData.get("businessEmail") ?? ""),
      password: String(formData.get("businessPassword") ?? ""),
      address: String(formData.get("businessAddress") ?? "") || undefined,
    };

    try {
      await createBusiness(payload);
      form.reset();
      toast.success("Business account created!");
    } catch (error) {
      console.error("createBusiness failed", error);
      toast.error("Unable to create business account.");
    }
  };

  return (
    <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <h2 className="text-lg font-semibold">Register a Business</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Set up your business profile, rewards, and team access.
      </p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <CustomInput
          id="businessName"
          type="text"
          placeholder="Business name"
        />
        <CustomInput
          id="businessEmail"
          type="email"
          placeholder="Business email"
        />
        <div className="md:col-span-2">
          <CustomInput
            id="businessAddress"
            type="text"
            placeholder="Business address (optional)"
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="businessPassword"
            type="password"
            placeholder="Create password"
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="businessPasswordConfirm"
            type="password"
            placeholder="Confirm password"
          />
        </div>
        <button
          type="submit"
          className="md:col-span-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
        >
          Create Business Account
        </button>
      </form>
    </div>
  );
};

export default BusinessRegistrationForm;
