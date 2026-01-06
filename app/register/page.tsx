"use client";

import { useState } from "react";
import CustomInput from "@/components/CustomInput";
import FormSwitch from "@/components/FormSwitch";

const registerOptions = [
  { key: "business", label: "Business" },
  { key: "employee", label: "Employee" },
];

const RegisterPage = () => {
  const [activeKey, setActiveKey] = useState<"business" | "employee">(
    "business"
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

        <div className="mb-8 flex justify-center md:justify-start">
          <FormSwitch
            items={registerOptions}
            activeKey={activeKey}
            onChange={(key) => setActiveKey(key as "business" | "employee")}
          />
        </div>

        {activeKey === "business" ? (
          <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
            <h2 className="text-lg font-semibold">Register a Business</h2>
            <p className="mt-2 text-sm text-contrast/80">
              Set up your business profile, rewards, and team access.
            </p>
            <form className="mt-6 grid gap-4 md:grid-cols-2">
              <CustomInput
                id="businessName"
                type="text"
                placeholder="Business name"
              />
              <CustomInput
                id="ownerName"
                type="name"
                placeholder="Owner name"
              />
              <CustomInput
                id="businessEmail"
                type="email"
                placeholder="Business email"
              />
              <CustomInput
                id="businessPhone"
                type="tel"
                placeholder="Business phone"
              />
              <div className="md:col-span-2">
                <CustomInput
                  id="businessPassword"
                  type="password"
                  placeholder="Create password"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
              >
                Create Business Account
              </button>
            </form>
          </div>
        ) : (
          <div className="rounded-xl border border-accent-3 bg-accent-2 p-6">
            <h2 className="text-lg font-semibold">Register as Employee</h2>
            <p className="mt-2 text-sm text-contrast/80">
              Join an existing business and start managing customer rewards.
            </p>
            <form className="mt-6 grid gap-4 md:grid-cols-2">
              <CustomInput
                id="employeeName"
                type="name"
                placeholder="Full name"
              />
              <CustomInput
                id="employeeEmail"
                type="email"
                placeholder="Work email"
              />
              <CustomInput
                id="employeePhone"
                type="tel"
                placeholder="Phone number"
              />
              <CustomInput
                id="businessCode"
                type="text"
                placeholder="Business code"
              />
              <div className="md:col-span-2">
                <CustomInput
                  id="employeePassword"
                  type="password"
                  placeholder="Create password"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary"
              >
                Create Employee Account
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
};

export default RegisterPage;
