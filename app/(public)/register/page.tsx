"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import BusinessRegistrationForm from "./BusinessRegistrationForm";
import EmployeeRegistrationForm from "./EmployeeRegistrationForm";
import FormSwitch from "@/components/FormSwitch";

const registerOptions = [
  { key: "business", label: "Business" },
  { key: "employee", label: "Employee" },
];

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "employee" ? "employee" : "business";
  const [activeKey, setActiveKey] = useState<"business" | "employee">(
    initialRole
  );

  return (
    <main className="min-h-screen bg-primary text-contrast">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Get started
          </p>
          <h1 className="text-3xl font-semibold text-brand">
            Choose your registration
          </h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            Pick the option that fits your role. Businesses can create loyalty
            programs, while employees can enroll to start serving customers.
          </p>
        </header>

        <div className="mb-8 flex justify-center">
          <FormSwitch
            items={registerOptions}
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key as "business" | "employee")}
          />
        </div>

        {activeKey === "business" ? (
          <BusinessRegistrationForm />
        ) : (
          <EmployeeRegistrationForm />
        )}
      </section>
    </main>
  );
};

export default RegisterPage;
