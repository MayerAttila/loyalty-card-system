"use client";

import React, { useEffect, useMemo, useState } from "react";
import CustomersTable from "./CustomersTable";
import SearchBar from "@/components/SearchBar";
import { Customer } from "@/types/customer";
import { getCustomersByBusinessId as getCustomersByBusinessIdClient } from "@/api/client/customer.api";

type CustomersClientProps = {
  customers: Customer[];
  businessId: string;
};

const INITIAL_TABLE_LOAD_COUNT = 20;

const CustomersClient = ({ customers, businessId }: CustomersClientProps) => {
  const [allCustomers, setAllCustomers] = useState<Customer[]>(customers);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAccessor, setSearchAccessor] = useState<string | null>(null);

  useEffect(() => {
    if (customers.length < INITIAL_TABLE_LOAD_COUNT) return;

    let cancelled = false;

    void (async () => {
      try {
        const fullCustomers = await getCustomersByBusinessIdClient(businessId);
        if (cancelled) return;
        setAllCustomers((prev) =>
          fullCustomers.length > prev.length ? fullCustomers : prev
        );
      } catch (error) {
        console.error("background customers hydrate failed", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [businessId, customers.length]);

  const dedupedCustomers = useMemo(() => {
    const map = new Map<string, Customer>();
    allCustomers.forEach((customer) => {
      map.set(customer.id, customer);
    });
    return Array.from(map.values());
  }, [allCustomers]);

  const searchData = useMemo(
    () =>
      dedupedCustomers.map((customer) => ({
        name: customer.name,
        email: customer.email,
      })),
    [dedupedCustomers]
  );

  const normalizeStr = (value: unknown) =>
    String(value ?? "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return dedupedCustomers;
    const q = normalizeStr(searchQuery);
    const searchIn = (value: unknown) => normalizeStr(value).includes(q);
    const fields = (customer: Customer) => ({
      name: customer.name,
      email: customer.email,
    });

    return dedupedCustomers.filter((customer) => {
      const data = fields(customer);
      if (searchAccessor && searchAccessor in data) {
        return searchIn(data[searchAccessor as keyof typeof data]);
      }
      return Object.values(data).some(searchIn);
    });
  }, [dedupedCustomers, searchQuery, searchAccessor]);

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">Customers</h2>
          <p className="mt-2 text-sm text-contrast/80">
            View customer profiles, loyalty progress, and reward eligibility.
          </p>
        </div>
        <div className="w-full md:max-w-sm">
          <SearchBar
            data={searchData}
            searchKeys={["name", "email"]}
            placeholder="Search customers"
            onSearchChange={({ query, accessor }) => {
              setSearchQuery(query);
              setSearchAccessor(accessor);
            }}
          />
        </div>
      </div>
      <div className="mt-4">
        <CustomersTable customers={filteredCustomers} />
      </div>
    </section>
  );
};

export default CustomersClient;
