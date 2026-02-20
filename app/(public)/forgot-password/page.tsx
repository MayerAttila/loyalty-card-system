"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import { requestPasswordReset } from "@/api/client/passwordReset.api";

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Email is required.");
      toast.error("Email is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const result = await requestPasswordReset({ email: normalizedEmail });
      setSubmitted(true);
      toast.success(result.message || "Reset link sent successfully.");
    } catch (requestError) {
      console.error("requestPasswordReset failed", requestError);
      const maybeMessage =
        typeof requestError === "object" &&
        requestError !== null &&
        "response" in requestError &&
        (requestError as { response?: { data?: { message?: string } } }).response
          ?.data?.message;
      const message =
        typeof maybeMessage === "string" && maybeMessage.trim()
          ? maybeMessage
          : "Unable to send reset email.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-contrast">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-10 text-center">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Password Reset
          </p>
          <h1 className="text-3xl font-semibold text-brand">Forgot password</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-contrast/80">
            Enter your email and we will send you a reset link.
          </p>
        </header>

        <div className="glass-card mx-auto w-full max-w-xl p-6">
          <h2 className="text-lg font-semibold">Request reset link</h2>
          <p className="mt-2 text-sm text-contrast/80">
            You can use this flow only for email/password accounts.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <CustomInput
              id="email"
              type="email"
              placeholder="Email address"
              variant="glassy"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError(null);
              }}
              errorText={error ?? undefined}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </form>
          {submitted ? (
            <p className="mt-4 text-sm text-contrast/80">
              Reset link sent successfully. Check your inbox.
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-contrast/70">Remembered your password?</span>
            <Link
              className="font-semibold text-brand hover:text-brand/80"
              href="/login"
            >
              Back to login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPasswordPage;
