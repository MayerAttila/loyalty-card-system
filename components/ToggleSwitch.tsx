"use client";

import React from "react";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

const ToggleSwitch = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onChange(!checked);
      }}
      className={`inline-flex items-center gap-2 text-xs font-semibold text-contrast/80 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full border border-accent-3 transition-colors duration-200 ${
          checked ? "bg-brand/80" : "bg-accent-2"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 translate-x-0 rounded-full bg-primary shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-1"
          }`}
        />
      </span>
      {label ? <span>{label}</span> : null}
    </button>
  );
};

export default ToggleSwitch;
