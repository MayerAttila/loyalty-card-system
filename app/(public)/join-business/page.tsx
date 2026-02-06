import Link from "next/link";
import { Suspense } from "react";
import EmployeeRegistrationForm from "../register/EmployeeRegistrationForm";

const JoinBusinessPage = () => {
  return (
    <main className="min-h-screen bg-primary text-contrast">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Employee registration
          </p>
          <h1 className="text-3xl font-semibold text-brand">
            Join a business team
          </h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            Use the invitation link from your manager to register your employee
            account.
          </p>
        </header>

        <Suspense fallback={<div className="text-contrast/70">Loading...</div>}>
          <EmployeeRegistrationForm />
        </Suspense>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-contrast/70">Already have an account?</span>
          <Link
            className="font-semibold text-brand hover:text-brand/80"
            href="/login"
          >
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
};

export default JoinBusinessPage;
