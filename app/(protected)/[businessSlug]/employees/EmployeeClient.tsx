"use client";

import React, { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import SearchBar from "@/components/SearchBar";
import {
  deleteUser,
  sendEmployeeInvite,
  updateUserApproval,
  updateUserRole,
} from "@/api/client/user.api";
import { User } from "@/types/user";
import EmployeesTable from "./EmployeesTable";
import InviteEmployeeModal from "./InviteEmployeeModal";

type EmployeeClientProps = {
  initialUserData: User[];
  currentUserRole?: User["role"];
  businessId: string;
};

const EmployeeClient = ({
  initialUserData,
  currentUserRole,
  businessId,
}: EmployeeClientProps) => {
  const [users, setUsers] = useState<User[]>(initialUserData);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchAccessor, setSearchAccessor] = useState<string | null>(null);

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

  const handleRoleUpdate = useCallback(async (userId: string, role: User["role"]) => {
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });

    try {
      const updated = await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? updated : user))
      );
      toast.success("Role updated.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update role.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  }, []);

  const handleDelete = useCallback(async (userId: string) => {
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.add(userId);
      return next;
    });

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("Employee deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete employee.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  }, []);

  const handleInviteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isInviting) {
      return;
    }

    const trimmedEmail = inviteEmail.trim();
    if (!trimmedEmail) {
      toast.error("Enter an email address.");
      return;
    }

    try {
      setIsInviting(true);
      await sendEmployeeInvite({ email: trimmedEmail, businessId });
      toast.success("Invite sent.");
      setInviteEmail("");
      setIsInviteOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Unable to send invite.");
    } finally {
      setIsInviting(false);
    }
  };

  const searchData = useMemo(
    () =>
      users.map((user) => ({
        name: user.name,
        email: user.email,
        role: user.role,
      })),
    [users]
  );

  const normalizeStr = (value: unknown) =>
    String(value ?? "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const q = normalizeStr(searchQuery);
    const searchIn = (value: unknown) => normalizeStr(value).includes(q);
    const fields = (user: User) => ({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return users.filter((user) => {
      const data = fields(user);
      if (searchAccessor && searchAccessor in data) {
        return searchIn(data[searchAccessor as keyof typeof data]);
      }
      return Object.values(data).some(searchIn);
    });
  }, [searchQuery, searchAccessor, users]);

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">Employees</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Manage your team and remove access when needed.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <SearchBar
              data={searchData}
              searchKeys={["name", "email", "role"]}
              placeholder="Search employees"
              onSearchChange={({ query, accessor }) => {
                setSearchQuery(query);
                setSearchAccessor(accessor);
              }}
            />
          </div>
          <Button type="button" onClick={() => setIsInviteOpen(true)}>
            Invite employee
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <EmployeesTable
          users={filteredUsers}
          updatingIds={updatingIds}
          currentUserRole={currentUserRole}
          onToggleApproval={handleToggleApproval}
          onUpdateRole={handleRoleUpdate}
          onDelete={handleDelete}
        />
      </div>
      <InviteEmployeeModal
        isOpen={isInviteOpen}
        isSubmitting={isInviting}
        email={inviteEmail}
        onEmailChange={setInviteEmail}
        onClose={() => {
          if (!isInviting) {
            setIsInviteOpen(false);
          }
        }}
        onSubmit={handleInviteSubmit}
      />
    </section>
  );
};

export default EmployeeClient;
