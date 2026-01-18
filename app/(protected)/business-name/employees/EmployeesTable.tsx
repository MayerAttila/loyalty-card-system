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
  onUpdateRole: (userId: string, role: User["role"]) => void;
};

const EmployeesTable = ({
  users,
  updatingIds,
  currentUserRole,
  onToggleApproval,
  onUpdateRole,
}: EmployeesTableProps) => {
  const roleRank: Record<string, number> = {
    OWNER: 0,
    ADMIN: 1,
    STAFF: 2,
  };
  const roleLabels: Record<User["role"], string> = {
    OWNER: "Owner",
    ADMIN: "Admin",
    STAFF: "Staff",
  };
  const canEditRole = (row: User) => {
    if (!currentUserRole) return false;
    if (currentUserRole === "OWNER") return true;
    if (currentUserRole === "ADMIN") return row.role !== "OWNER";
    return false;
  };
  const roleOptions =
    currentUserRole === "OWNER"
      ? (["OWNER", "ADMIN", "STAFF"] as const)
      : (["ADMIN", "STAFF"] as const);
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
      sortValue: (row) => roleRank[row.role] ?? 99,
      render: (_, row) => {
        if (!canEditRole(row)) {
          return <span className="text-contrast/80">{roleLabels[row.role]}</span>;
        }

        return (
          <select
            className="rounded-lg border border-accent-3 bg-accent-1 px-2 py-1 text-xs text-contrast"
            value={row.role}
            disabled={updatingIds.has(row.id)}
            onChange={(event) => {
              const nextRole = event.target.value as User["role"];
              if (nextRole === row.role) return;
              onUpdateRole(row.id, nextRole);
            }}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role]}
              </option>
            ))}
          </select>
        );
      },
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
          {row.role !== "OWNER" &&
            (currentUserRole !== "ADMIN" || row.role === "STAFF") && (
            <ApproveButton
              approved={row.approved}
              disabled={updatingIds.has(row.id)}
              onClick={() => onToggleApproval(row.id, !row.approved)}
            />
          )}
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
      defaultSortKey="role"
      defaultSortDirection="asc"
      respectStoredSort={false}
      storageKey="employees-table"
      emptyMessage="No employees found."
    />
  );
};

export default EmployeesTable;
