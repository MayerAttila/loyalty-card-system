"use client";

import React from "react";
import DataTable, { DataTableColumn } from "@/components/DataTable";
import { Customer } from "@/types/customer";

type CustomersTableProps = {
  customers: Customer[];
};

const CustomersTable = ({ customers }: CustomersTableProps) => {
  const columns: DataTableColumn<Customer>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      width: 200,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
      width: 280,
      render: (value) => (
        <span className="text-contrast/80">{String(value ?? "")}</span>
      ),
    },
    {
      key: "stamps",
      label: "Stamps",
      sortable: false,
      width: 140,
      render: (_, row) => {
        const stamps = row.cardSummary;
        if (!stamps || !stamps.maxPoints) {
          return <span className="text-contrast/60">-</span>;
        }
        return (
          <span className="text-contrast/80">
            {stamps.stampCount}/{stamps.maxPoints}
          </span>
        );
      },
    },
    {
      key: "rewards",
      label: "Rewards",
      sortable: false,
      width: 140,
      render: (_, row) => (
        <span className="text-contrast/80">
          {row.cardSummary ? row.cardSummary.rewardsEarned : 0}
        </span>
      ),
    },
    {
      key: "lastActivity",
      label: "Last activity",
      sortable: false,
      width: 180,
      render: (_, row) => {
        const lastActivity = row.cardSummary?.lastActivity;
        if (!lastActivity) return <span className="text-contrast/60">-</span>;
        const date = new Date(lastActivity);
        return (
          <span className="text-contrast/70">
            {Number.isNaN(date.getTime())
              ? lastActivity
              : date.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      key: "wallet",
      label: "Wallet",
      sortable: false,
      width: 120,
      render: (_, row) => (
        <span className="text-contrast/80">
          {row.cardSummary?.hasWallet ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      sortable: true,
      width: 180,
      render: (value) => {
        if (!value) return "-";
        const date = new Date(String(value));
        return (
          <span className="text-contrast/70">
            {Number.isNaN(date.getTime())
              ? String(value)
              : date.toLocaleDateString()}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      data={customers}
      columns={columns}
      defaultSortKey="createdAt"
      defaultSortDirection="desc"
      respectStoredSort={false}
      storageKey="customers-table"
      emptyMessage="No customers found."
    />
  );
};

export default CustomersTable;
