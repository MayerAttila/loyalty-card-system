"use client";

import React from "react";
import { User } from "@/types/user";
import DataTable, { DataTableColumn } from "@/components/DataTable";
import IconButton from "@/components/IconButton";
import ApproveButton from "./ApproveButton";

type EmployeesTableProps = {
  users: User[];
  updatingIds: Set<string>;
  currentUserRole?: User["role"];
  onToggleApproval: (userId: string, approved: boolean) => void;
};

const EmployeesTable = ({
  users,
  updatingIds,
  currentUserRole,
  onToggleApproval,
}: EmployeesTableProps) => {
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
      width: 200,
      render: (_, row) => (
        <div className="flex items-center justify-between gap-3">
          <span className="text-contrast/80">
            {row.approved ? "Yes" : "No"}
          </span>
          <ApproveButton
            approved={row.approved}
            disabled={
              updatingIds.has(row.id) ||
              (currentUserRole === "ADMIN" && row.role !== "STAFF")
            }
            onClick={() => onToggleApproval(row.id, !row.approved)}
          />
        </div>
      ),
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
