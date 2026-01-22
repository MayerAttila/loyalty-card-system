"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import { getSession, signIn, signInPayload } from "@/api/client/auth.api";
import { useRouter } from "next/navigation";
import { toBusinessSlug } from "@/lib/slug";

const LoginPage = () => {
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

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const nextErrors: Partial<Record<string, string>> = {};
    if (!email) {
      nextErrors.email = "Email is required.";
    }
    if (!password) {
      nextErrors.password = "Password is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please enter your login details.");
      return;
    }

    const payload: signInPayload = {
      email: email,
      password: password,
    };

    try {
      const result = await signIn(payload);
      toast.success("Welcome back!");
      form.reset();
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
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password.");
      return;
    }
  };

  return (
    <main className="min-h-screen bg-primary text-contrast">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Welcome Back
          </p>
          <h1 className="text-3xl font-semibold text-brand">Log in</h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            Sign in to manage loyalty programs, track visits, and keep customers
            engaged.
          </p>
        </header>

        <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
          <h2 className="text-lg font-semibold">Access your account</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Use your email and password to continue.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <CustomInput
              id="email"
              type="email"
              placeholder="Email address"
              errorText={errors.email}
              onChange={() => clearFieldError("email")}
            />
            <CustomInput
              id="password"
              type="password"
              placeholder="Password"
              errorText={errors.password}
              onChange={() => clearFieldError("password")}
            />
            <button
              type="submit"
              className="rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
            >
              Log in
            </button>
          </form>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-contrast/70">New here?</span>
            <Link
              className="font-semibold text-brand hover:text-brand/80"
              href="/register"
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
