"use client";

import React from "react";
import { FaPen, FaTrash } from "react-icons/fa6";

type IconButtonVariant = "delete" | "edit";

type IconButtonProps = {
  variant: IconButtonVariant;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  className?: string;
};

const VARIANT_STYLES: Record<
  IconButtonVariant,
  { classes: string; icon: React.ReactNode; label: string }
> = {
  delete: {
    classes:
      "border-red-400/40 bg-red-500/10 text-red-200 hover:bg-red-500/20",
    icon: <FaTrash className="text-sm" />,
    label: "Delete",
  },
  edit: {
    classes:
      "border-brand/40 bg-brand/10 text-brand hover:bg-brand/20",
    icon: <FaPen className="text-sm" />,
    label: "Edit",
  },
};

const IconButton = ({
  variant,
  onClick,
  disabled = false,
  title,
  ariaLabel,
  className = "",
}: IconButtonProps) => {
  const { classes, icon, label } = VARIANT_STYLES[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title ?? label}
      aria-label={ariaLabel ?? label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${classes} ${className}`}
    >
      {icon}
    </button>
  );
};

export default IconButton;
