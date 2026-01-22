"use client";

import React from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

type ApproveButtonProps = {
  approved: boolean;
  onClick?: () => void;
  disabled?: boolean;
};

const ApproveButton = ({
  approved,
  onClick,
  disabled = false,
}: ApproveButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={approved ? "Unapprove employee" : "Approve employee"}
      title={approved ? "Unapprove" : "Approve"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
        approved
          ? "border-brand/40 bg-brand/10 text-brand hover:bg-brand/20"
          : "border-contrast/40 bg-contrast/5 text-contrast hover:bg-contrast/10"
      }`}
    >
      {approved ? (
        <FaXmark className="text-xs" />
      ) : (
        <FaCheck className="text-xs" />
      )}
    </button>
  );
};

export default ApproveButton;
