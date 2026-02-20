"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import { confirmPasswordReset } from "@/api/client/passwordReset.api";

const getPasswordRuleError = (password: string) => {
  const failures: string[] = [];
  if (password.length < 8) {
    failures.push("be at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    failures.push("include at least one uppercase letter");
  }
  if (!/\d/.test(password)) {
    failures.push("include at least one number");
  }
  if (!failures.length) return null;
  if (failures.length === 1) {
    return `Password must ${failures[0]}.`;
  }
  if (failures.length === 2) {
    return `Password must ${failures[0]} and ${failures[1]}.`;
  }
  return `Password must ${failures[0]}, ${failures[1]}, and ${failures[2]}.`;
};

type ResetPasswordFormProps = {
  token: string;
};

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const clearFieldError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!token) {
      toast.error("Reset token is missing.");
      return;
    }

    const nextErrors: Partial<Record<string, string>> = {};
    if (!newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else {
      const passwordRuleError = getPasswordRuleError(newPassword);
      if (passwordRuleError) {
        nextErrors.newPassword = passwordRuleError;
      }
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error(Object.values(nextErrors)[0] ?? "Please fix the form fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await confirmPasswordReset({ token, newPassword });
      toast.success("Password updated. You can log in now.");
      router.push("/login");
    } catch (requestError) {
      console.error("confirmPasswordReset failed", requestError);
      const maybeMessage =
        typeof requestError === "object" &&
        requestError !== null &&
        "response" in requestError &&
        (requestError as { response?: { data?: { message?: string } } }).response
          ?.data?.message;
      const message =
        typeof maybeMessage === "string" && maybeMessage.trim()
          ? maybeMessage
          : "Unable to reset password.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card max-w-xl p-6">
      <h2 className="text-lg font-semibold">Create new password</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Password must be at least 8 characters and include one uppercase letter
        and one number.
      </p>

      {!token ? (
        <p className="mt-6 text-sm text-brand">
          Reset token is missing or invalid. Request a new reset link.
        </p>
      ) : (
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <CustomInput
            id="newPassword"
            type="password"
            placeholder="New password"
            variant="glassy"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
              clearFieldError("newPassword");
            }}
            errorText={errors.newPassword}
          />
          <CustomInput
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            variant="glassy"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              clearFieldError("confirmPassword");
            }}
            errorText={errors.confirmPassword}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update password"}
          </Button>
        </form>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="text-contrast/70">Back to account access?</span>
        <Link className="font-semibold text-brand hover:text-brand/80" href="/login">
          Log in
        </Link>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
