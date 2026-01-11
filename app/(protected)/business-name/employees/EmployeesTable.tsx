"use client";

import React from "react";
import { User } from "@/types/user";
import DataTable, { DataTableColumn } from "@/components/DataTable";
import IconButton from "@/components/IconButton";

const columns: DataTableColumn<User>[] = [
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
    key: "role",
    label: "Role",
    sortable: true,
    width: 140,
  },
  {
    key: "approved",
    label: "Approved",
    sortable: true,
    width: 140,
    render: (_, row) => (row.approved ? "Yes" : "No"),
    sortValue: (row) => (row.approved ? 1 : 0),
  },
  {
    key: "actions",
    label: "Actions",
    width: 140,
    align: "right",
    render: () => (
      <div className="flex justify-end gap-2">
        <IconButton variant="edit" />
        <IconButton variant="delete" />
      </div>
    ),
  },
];

type EmployeesTableProps = {
  users: User[];
};

const EmployeesTable = ({ users }: EmployeesTableProps) => {
  return (
    <DataTable
      data={users}
      columns={columns}
      storageKey="employees-table"
      emptyMessage="No employees found."
    />
  );
};

export default EmployeesTable;
