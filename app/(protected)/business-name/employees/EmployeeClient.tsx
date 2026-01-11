"use client";

import React from "react";
import { User } from "@/types/user";
import EmployeesTable from "./EmployeesTable";

type EmployeeClientProps = {
  initialUserData: User[];
};

const EmployeeClient = ({ initialUserData }: EmployeeClientProps) => {
  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <h2 className="text-xl font-semibold text-brand">Employees</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Manage your team and remove access when needed.
      </p>
      <EmployeesTable users={initialUserData} />
    </section>
  );
};

export default EmployeeClient;
