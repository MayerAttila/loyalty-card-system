"use client";

import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <main className="min-h-screen bg-primary text-contrast">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-20">
        <div>
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Account Pending
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-brand">
            Waiting for approval
          </h1>
        </div>
        <p className="text-base text-contrast/80">
          Your employee account has been created and is waiting for the business
          owner to approve it. You will be able to log in as soon as the account
          is approved.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            className="rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
            href="/"
          >
            Back to Home
          </Link>
          <Link
            className="rounded-lg border border-accent-3 px-4 py-3 text-sm font-semibold"
            href="/login"
          >
            Go to Login
          </Link>
        </div>
      </section>
    </main>
  );
}
