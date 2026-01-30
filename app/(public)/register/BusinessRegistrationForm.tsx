"use client";

import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { createBusiness } from "@/api/client/business.api";
import { CreateBusinessPayload } from "@/api/client/business.api";
import { createUser } from "@/api/client/user.api";
import { useState } from "react";
import { getSession, signIn } from "@/api/client/auth.api";
import { useRouter } from "next/navigation";
import { toBusinessSlug } from "@/lib/slug";

const BusinessRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const router = useRouter();

  const resolveAppRedirect = (url?: string | null) => {
    if (!url || typeof window === "undefined") {
      return null;
    }
    try {
      const parsed = new URL(url, window.location.origin);
      if (parsed.origin !== window.location.origin) {
        return null;
      }
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
      return null;
    }
  };

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
        approved: true,
      });
      setErrors({});
      form.reset();
      toast.success("Business account created! Signing you in...");
      try {
        const result = await signIn({
          email: ownerEmail,
          password: ownerPassword,
        });
        let redirectTo = resolveAppRedirect(result?.url) ?? "/";
        const businessSlugFromForm = toBusinessSlug(businessName);
        if (businessSlugFromForm) {
          redirectTo = `/${businessSlugFromForm}`;
        } else {
          try {
            const session = await getSession();
            const businessSlug = toBusinessSlug(session?.user?.businessName);
            if (businessSlug) {
              redirectTo = `/${businessSlug}`;
            }
          } catch (sessionError) {
            console.error("session lookup failed", sessionError);
          }
        }
        router.push(redirectTo);
      } catch (error) {
        console.error("auto sign-in failed", error);
        toast.info("Account created. Please log in from the login page.");
      }
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
          type="business"
          placeholder="Business name"
          errorText={errors.businessName}
          onChange={() => clearFieldError("businessName")}
        />
        <CustomInput
          id="businessAddress"
          type="address"
          placeholder="Business address (optional)"
        />
        <CustomInput
          id="ownerName"
          type="name"
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
        <Button type="submit" disabled={isSubmitting} className="md:col-span-2">
          {isSubmitting ? "Creating Business..." : "Create Business Account"}
        </Button>
      </form>
    </div>
  );
};

export default BusinessRegistrationForm;
