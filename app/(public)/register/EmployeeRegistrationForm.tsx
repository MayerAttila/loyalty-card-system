"use client";

import CustomInput from "@/components/CustomInput";
import { toast } from "react-toastify";
import { CreateUserPayload, createUser } from "@/api/client/user.api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/api/client/auth.api";

const EmployeeRegistrationForm = () => {
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
    const employeePassword = String(formData.get("employeePassword") ?? "");
    const employeePasswordConfirm = String(
      formData.get("employeePasswordConfirm") ?? ""
    );

    const nextErrors: Partial<Record<string, string>> = {};
    const employeeName = String(formData.get("employeeName") ?? "").trim();
    const employeeEmail = String(formData.get("employeeEmail") ?? "").trim();
    const businessId = String(formData.get("businessId") ?? "").trim();

    if (!employeeName) {
      nextErrors.employeeName = "Full name is required.";
    }
    if (!employeeEmail) {
      nextErrors.employeeEmail = "Work email is required.";
    }
    if (!businessId) {
      nextErrors.businessId = "Business ID is required.";
    }
    if (!employeePassword) {
      nextErrors.employeePassword = "Password is required.";
    }
    if (!employeePasswordConfirm) {
      nextErrors.employeePasswordConfirm = "Confirm the password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fill in the required fields.");
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
      if (user?.approved) {
        toast.success("Employee account created! Signing you in...");
        try {
          const result = await signIn({
          email: employeeEmail,
          password: employeePassword,
        });
        const redirectTo = resolveAppRedirect(result?.url) ?? "/admin";
        router.push(redirectTo);
          return;
        } catch (error) {
          console.error("auto sign-in failed", error);
          toast.info("Account created. Please log in from the login page.");
          router.push("/login");
          return;
        }
      }

      toast.success("Employee account created!");
      router.push("/pending-approval");
    } catch (error) {
      console.error("createUser failed", error);
      toast.error("Unable to create employee account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <h2 className="text-lg font-semibold">Register as Employee</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Join an existing business and start managing customer rewards.
      </p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <CustomInput
          id="employeeName"
          type="name"
          placeholder="Full name"
          errorText={errors.employeeName}
          onChange={() => clearFieldError("employeeName")}
        />
        <CustomInput
          id="employeeEmail"
          type="email"
          placeholder="Work email"
          errorText={errors.employeeEmail}
          onChange={() => clearFieldError("employeeEmail")}
        />
        <div className="md:col-span-2">
          <CustomInput
            id="businessId"
            type="text"
            placeholder="Business ID"
            errorText={errors.businessId}
            onChange={() => clearFieldError("businessId")}
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="employeePassword"
            type="password"
            placeholder="Create password"
            errorText={errors.employeePassword}
            onChange={() => clearFieldError("employeePassword")}
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="employeePasswordConfirm"
            type="password"
            placeholder="Confirm password"
            errorText={errors.employeePasswordConfirm}
            onChange={() => clearFieldError("employeePasswordConfirm")}
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="md:col-span-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
        >
          {isSubmitting ? "Creating Employee..." : "Create Employee Account"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegistrationForm;
