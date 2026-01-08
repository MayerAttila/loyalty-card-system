"use client";

import CustomInput from "@/components/CustomInput";
import { toast } from "react-toastify";
import { createBusiness } from "@/api/client/business.api";
import { CreateBusinessPayload } from "@/api/client/business.api";
import { createUser } from "@/api/client/user.api";
import { useState } from "react";

const BusinessRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<string, string>>
  >({});

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const ownerPassword = String(formData.get("ownerPassword") ?? "");
    const ownerPasswordConfirm = String(
      formData.get("ownerPasswordConfirm") ?? ""
    );

    const nextErrors: Partial<Record<string, string>> = {};
    const businessName = String(formData.get("businessName") ?? "").trim();
    const ownerName = String(formData.get("ownerName") ?? "").trim();
    const ownerEmail = String(formData.get("ownerEmail") ?? "").trim();

    if (!businessName) {
      nextErrors.businessName = "Business name is required.";
    }
    if (!ownerName) {
      nextErrors.ownerName = "Owner name is required.";
    }
    if (!ownerEmail) {
      nextErrors.ownerEmail = "Owner email is required.";
    }
    if (!ownerPassword) {
      nextErrors.ownerPassword = "Owner password is required.";
    }
    if (!ownerPasswordConfirm) {
      nextErrors.ownerPasswordConfirm = "Confirm the owner password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fill in the required fields.");
      return;
    }

    if (ownerPassword !== ownerPasswordConfirm) {
      setErrors({
        ownerPasswordConfirm: "Passwords do not match.",
      });
      toast.error("Owner passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const payload: CreateBusinessPayload = {
      name: businessName,
      address: String(formData.get("businessAddress") ?? "") || undefined,
    };

    try {
      const business = await createBusiness(payload);
      await createUser({
        name: String(formData.get("ownerName") ?? ""),
        email: String(formData.get("ownerEmail") ?? ""),
        password: ownerPassword,
        businessId: business.id,
        role: "OWNER",
      });
      setErrors({});
      form.reset();
      toast.success("Business account created!");
    } catch (error) {
      console.error("createBusiness failed", error);
      toast.error("Unable to create business account.");
    } finally {
      setIsSubmitting(false);
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
          errorText={errors.businessName}
          onChange={() => clearFieldError("businessName")}
        />
        <CustomInput
          id="businessAddress"
          type="text"
          placeholder="Business address (optional)"
        />
        <CustomInput
          id="ownerName"
          type="text"
          placeholder="Owner full name"
          errorText={errors.ownerName}
          onChange={() => clearFieldError("ownerName")}
        />
        <CustomInput
          id="ownerEmail"
          type="email"
          placeholder="Owner email"
          errorText={errors.ownerEmail}
          onChange={() => clearFieldError("ownerEmail")}
        />
        <div className="md:col-span-2">
          <CustomInput
            id="ownerPassword"
            type="password"
            placeholder="Create owner password"
            errorText={errors.ownerPassword}
            onChange={() => clearFieldError("ownerPassword")}
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="ownerPasswordConfirm"
            type="password"
            placeholder="Confirm owner password"
            errorText={errors.ownerPasswordConfirm}
            onChange={() => clearFieldError("ownerPasswordConfirm")}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
        >
          {isSubmitting ? "Creating Business..." : "Create Business Account"}
        </button>
      </form>
    </div>
  );
};

export default BusinessRegistrationForm;
