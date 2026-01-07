"use client";

import CustomInput from "@/components/CustomInput";
import { toast } from "react-toastify";
import { CreateEmployeePayload } from "@/api/client/employee.api";
import { createEmployee } from "@/api/client/employee.api";

const EmployeeRegistrationForm = () => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);

    const payload: CreateEmployeePayload = {
      name: String(formData.get("employeeName") ?? ""),
      email: String(formData.get("employeeEmail") ?? ""),
      password: String(formData.get("employeePassword") ?? ""),
      businessId: String(formData.get("businessId") ?? ""),
    };

    try {
      await createEmployee(payload);
      form.reset();
      toast.success("Employee account created!");
    } catch (error) {
      console.error("createEmployee failed", error);
      toast.error("Unable to create employee account.");
    }
  };

  return (
    <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <h2 className="text-lg font-semibold">Register as Employee</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Join an existing business and start managing customer rewards.
      </p>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <CustomInput id="employeeName" type="name" placeholder="Full name" />
        <CustomInput id="employeeEmail" type="email" placeholder="Work email" />
        <div className="md:col-span-2">
          <CustomInput id="businessId" type="text" placeholder="Business ID" />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="employeePassword"
            type="password"
            placeholder="Create password"
          />
        </div>
        <div className="md:col-span-2">
          <CustomInput
            id="employeePasswordConfirm"
            type="password"
            placeholder="Confirm password"
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
  );
};

export default EmployeeRegistrationForm;
