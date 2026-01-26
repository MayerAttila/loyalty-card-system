"use client";

import React, { useMemo } from "react";
import CustomersTable from "./CustomersTable";
import { Customer } from "@/types/customer";

type CustomersClientProps = {
  customers: Customer[];
};

const CustomersClient = ({ customers }: CustomersClientProps) => {
  const dedupedCustomers = useMemo(() => {
    const map = new Map<string, Customer>();
    customers.forEach((customer) => {
      map.set(customer.id, customer);
    });
    return Array.from(map.values());
  }, [customers]);

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div>
        <h2 className="text-xl font-semibold text-brand">Customers</h2>
        <p className="mt-2 text-sm text-contrast/80">
          View customer profiles, loyalty progress, and reward eligibility.
        </p>
      </div>
      <CustomersTable customers={dedupedCustomers} />
    </section>
  );
};

export default CustomersClient;
