"use client";

import React from "react";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";

type InviteEmployeeModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  email: string;
  onEmailChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const InviteEmployeeModal = ({
  isOpen,
  isSubmitting,
  email,
  onEmailChange,
  onClose,
  onSubmit,
}: InviteEmployeeModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={() => {
        if (!isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        className="w-full max-w-md rounded-xl border border-accent-3 bg-primary p-6 text-contrast shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-brand">Invite employee</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-contrast/70 hover:text-contrast"
            aria-label="Close invite modal"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-contrast/80">
          Send an email invite with a registration link.
        </p>
        <form className="mt-4 grid gap-4" onSubmit={onSubmit}>
          <CustomInput
            id="employeeInviteEmail"
            type="email"
            placeholder="Employee email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="neutral"
              onClick={onClose}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? "Sending invite..." : "Send invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteEmployeeModal;
