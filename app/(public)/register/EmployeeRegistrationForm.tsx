"use client";

import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import { toast } from "react-toastify";
import { CreateUserPayload, createUser } from "@/api/client/user.api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { getSession, signIn } from "@/api/client/auth.api";
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

const EmployeeRegistrationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const searchParams = useSearchParams();
  const businessId = (searchParams.get("businessId") ?? "").trim();
  const isInviteRegistration = searchParams.get("invite") === "1";
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
    const employeePassword = String(formData.get("employeePassword") ?? "");
    const employeePasswordConfirm = String(
      formData.get("employeePasswordConfirm") ?? ""
    );

    const nextErrors: Partial<Record<string, string>> = {};
    const employeeName = String(formData.get("employeeName") ?? "").trim();
    const employeeEmail = String(formData.get("employeeEmail") ?? "").trim();
    if (!employeeName) {
      nextErrors.employeeName = "Full name is required.";
    }
    if (!employeeEmail) {
      nextErrors.employeeEmail = "Work email is required.";
    }
    if (!businessId) {
      nextErrors.businessId =
        "Business ID is missing. Please use the invite link.";
    }
    if (!employeePassword) {
      nextErrors.employeePassword = "Password is required.";
    } else {
      const passwordRuleError = getPasswordRuleError(employeePassword);
      if (passwordRuleError) {
        nextErrors.employeePassword = passwordRuleError;
      }
    }
    if (!employeePasswordConfirm) {
      nextErrors.employeePasswordConfirm = "Confirm the password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      const firstError = Object.values(nextErrors)[0];
      toast.error(firstError ?? "Please fix the highlighted fields.");
      return;
    }

    if (employeePassword !== employeePasswordConfirm) {
      setErrors({
        employeePasswordConfirm: "Passwords do not match.",
      });
      toast.error("Employee passwords do not match.");
      return;
    }

    const payload: CreateUserPayload = {
      name: employeeName,
      email: employeeEmail,
      password: employeePassword,
      businessId,
    };

    try {
      setIsSubmitting(true);
      const user = await createUser(payload);
      setErrors({});
      form.reset();
      {
        toast.success("Employee account created! Signing you in...");
        try {
          const result = await signIn({
            email: employeeEmail,
            password: employeePassword,
          });
          let redirectTo = resolveAppRedirect(result?.url) ?? "/";
          try {
            const session = await getSession();
            const businessSlug = toBusinessSlug(session?.user?.businessName);
            if (businessSlug) {
              redirectTo = `/${businessSlug}`;
            }
          } catch (sessionError) {
            console.error("session lookup failed", sessionError);
          }
          router.push(redirectTo);
          return;
        } catch (error) {
          console.error("auto sign-in failed", error);
          toast.info("Account created. Please log in from the login page.");
          router.push("/login");
          return;
        }
      }
    } catch (error) {
      console.error("createUser failed", error);
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
          : "Unable to create employee account.";
      if (message.toLowerCase().includes("password")) {
        setErrors((prev) => ({
          ...prev,
          employeePassword: message,
        }));
      }
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-lg font-semibold">Register as Employee</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Join an existing business and start managing customer rewards.
      </p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <CustomInput
          id="employeeName"
          type="name"
          placeholder="Full name"
          variant="glassy"
          errorText={errors.employeeName}
          onChange={() => clearFieldError("employeeName")}
        />
        <CustomInput
          id="employeeEmail"
          type="email"
          placeholder="Work email"
          variant="glassy"
          errorText={errors.employeeEmail}
          onChange={() => clearFieldError("employeeEmail")}
        />
        {errors.businessId ? (
          <div className="md:col-span-2 rounded-lg border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
            {errors.businessId}
          </div>
        ) : null}
        <div className="md:col-span-2">
          <CustomInput
            id="employeePassword"
            type="password"
            placeholder="Create password"
            variant="glassy"
            helperText={PASSWORD_REQUIREMENTS_TEXT}
            errorText={errors.employeePassword}
            onChange={() => clearFieldError("employeePassword")}
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="employeePasswordConfirm"
            type="password"
            placeholder="Confirm password"
            variant="glassy"
            errorText={errors.employeePasswordConfirm}
            onChange={() => clearFieldError("employeePasswordConfirm")}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="md:col-span-2">
          {isSubmitting ? "Creating Employee..." : "Create Employee Account"}
        </Button>
      </form>
    </div>
  );
};

export default EmployeeRegistrationForm;
