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

const PASSWORD_REQUIREMENTS_TEXT =
  "Password must be at least 8 characters and include one uppercase letter and one number.";
const getPasswordRuleError = (password: string) => {
  const failures: string[] = [];
  if (password.length < 8) {
    failures.push("be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    failures.push("include one uppercase letter");
  }
  if (!/\d/.test(password)) {
    failures.push("include one number");
  }
  if (!failures.length) return null;
  if (failures.length === 1) return `Password must ${failures[0]}.`;
  if (failures.length === 2) {
    return `Password must ${failures[0]} and ${failures[1]}.`;
  }
  return `Password must ${failures[0]}, ${failures[1]}, and ${failures[2]}.`;
};

type BusinessRegistrationFormProps = {
  onRegistered?: (businessSlug: string | null) => void;
};

const BusinessRegistrationForm = ({
  onRegistered,
}: BusinessRegistrationFormProps) => {
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
      formData.get("ownerPasswordConfirm") ?? "",
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
    } else {
      const passwordRuleError = getPasswordRuleError(ownerPassword);
      if (passwordRuleError) {
        nextErrors.ownerPassword = passwordRuleError;
      }
    }
    if (!ownerPasswordConfirm) {
      nextErrors.ownerPasswordConfirm = "Confirm the owner password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstError = Object.values(nextErrors)[0];
      toast.error(firstError ?? "Please fix the highlighted fields.");
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
      toast.success("Business account created! Signing you in...");
      try {
        const result = await signIn({
          email: ownerEmail,
          password: ownerPassword,
        });
        let redirectTo = resolveAppRedirect(result?.url) ?? "/";
        const businessSlugFromForm = toBusinessSlug(businessName);
        if (onRegistered) {
          onRegistered(businessSlugFromForm);
          return;
        }
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
      const maybeMessage =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;
      const message =
        typeof maybeMessage === "string" && maybeMessage.trim()
          ? maybeMessage
          : "Unable to create business account.";
      if (message.toLowerCase().includes("password")) {
        setErrors((prev) => ({
          ...prev,
          ownerPassword: message,
        }));
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold">Register a Business</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Set up your business profile, rewards, and team access.
      </p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <CustomInput
          id="businessName"
          type="business"
          placeholder="Business name"
          variant="glassy"
          errorText={errors.businessName}
          onChange={() => clearFieldError("businessName")}
        />
        <CustomInput
          id="ownerName"
          type="name"
          placeholder="Owner full name"
          variant="glassy"
          errorText={errors.ownerName}
          onChange={() => clearFieldError("ownerName")}
        />
        <CustomInput
          id="ownerEmail"
          type="email"
          placeholder="Owner email"
          variant="glassy"
          errorText={errors.ownerEmail}
          onChange={() => clearFieldError("ownerEmail")}
          className="md:col-span-2"
        />
        <div className="md:col-span-2">
          <CustomInput
            id="ownerPassword"
            type="password"
            placeholder="Create owner password"
            variant="glassy"
            errorText={errors.ownerPassword}
            onChange={() => clearFieldError("ownerPassword")}
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="ownerPasswordConfirm"
            type="password"
            placeholder="Confirm owner password"
            variant="glassy"
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
