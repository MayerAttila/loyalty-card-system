"use client";

import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";

type ActiveButtonProps = {
  isActive: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
  disabled?: boolean;
  title?: string;
  ariaLabel?: string;
  className?: string;
};

const ActiveButton = ({
  isActive,
  onActivate,
  onDeactivate,
  disabled = false,
  title,
  ariaLabel,
  className = "",
}: ActiveButtonProps) => {
  const label = isActive ? "Deactivate" : "Activate";
  const styles = isActive
    ? "border-brand/50 bg-brand/15 text-brand hover:bg-brand/25"
    : "border-contrast/40 bg-contrast/5 text-contrast/80 hover:bg-contrast/10";
  const triggerClasses = `inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-transform duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${styles} ${className}`;

  return (
    <button
      type="button"
      onClick={() => {
        if (disabled) return;
        if (isActive) {
          onDeactivate?.();
        } else {
          onActivate?.();
        }
      }}
      disabled={disabled}
      title={title ?? label}
      aria-label={ariaLabel ?? label}
      className={triggerClasses}
    >
      {isActive ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
    </button>
  );
};

export default ActiveButton;
