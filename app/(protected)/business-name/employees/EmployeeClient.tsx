"use client";

import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { updateUserApproval } from "@/api/client/user.api";
import { User } from "@/types/user";
import EmployeesTable from "./EmployeesTable";

type EmployeeClientProps = {
  initialUserData: User[];
  currentUserRole?: User["role"];
};

const EmployeeClient = ({
  initialUserData,
  currentUserRole,
}: EmployeeClientProps) => {
  const [users, setUsers] = useState<User[]>(initialUserData);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  const handleToggleApproval = useCallback(
    async (userId: string, approved: boolean) => {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });

      try {
        const updated = await updateUserApproval(userId, approved);
        setUsers((prev) =>
          prev.map((user) => (user.id === userId ? updated : user))
        );
        toast.success(
          approved ? "Employee approved." : "Employee unapproved."
        );
      } catch (error) {
        console.error(error);
        toast.error("Unable to update approval status.");
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    },
    []
  );

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <h2 className="text-xl font-semibold text-brand">Employees</h2>
      <p className="mt-2 text-sm text-contrast/80">
        Manage your team and remove access when needed.
      </p>
      <EmployeesTable
        users={users}
        updatingIds={updatingIds}
        currentUserRole={currentUserRole}
        onToggleApproval={handleToggleApproval}
      />
    </section>
  );
};

export default EmployeeClient;
