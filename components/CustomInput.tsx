"use client";

import React, { forwardRef, useMemo, useState } from "react";
import {
  MdAlternateEmail,
  MdLanguage,
  MdLock,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdSearch,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { BsShop } from "react-icons/bs";

type CustomInputType =
  | "text"
  | "email"
  | "password"
  | "name"
  | "tel"
  | "business"
  | "address"
  | "website"
  | "search";

type CustomInputProps = {
  id: string;
  label?: string;
  placeholder?: string;
  type?: CustomInputType;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  errorText?: string;
  autoComplete?: string;
  className?: string;
};

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      id,
      label,
      placeholder,
      type = "text",
      name,
      value,
      onChange,
      required,
      disabled,
      helperText,
      errorText,
      autoComplete,
      className,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const config = useMemo(() => {
      switch (type) {
        case "email":
          return {
            icon: MdAlternateEmail,
            inputType: "email",
            inputMode: "email" as const,
            autoCompleteValue: "email",
          };
        case "password":
          return {
            icon: MdLock,
            inputType: showPassword ? "text" : "password",
            inputMode: "text" as const,
            autoCompleteValue: "current-password",
          };
        case "name":
          return {
            icon: MdPerson,
            inputType: "text",
            inputMode: "text" as const,
            autoCompleteValue: "name",
          };
        case "tel":
          return {
            icon: MdPhone,
            inputType: "tel",
            inputMode: "tel" as const,
            autoCompleteValue: "tel",
          };
        case "website":
          return {
            icon: MdLanguage,
            inputType: "url",
            inputMode: "url" as const,
            autoCompleteValue: "url",
          };
        case "business":
          return {
            icon: BsShop,
            inputType: "text",
            inputMode: "text" as const,
            autoCompleteValue: "organization",
          };
        case "address":
          return {
            icon: MdLocationOn,
            inputType: "text",
            inputMode: "text" as const,
            autoCompleteValue: "street-address",
          };
        case "search":
          return {
            icon: MdSearch,
            inputType: "search",
            inputMode: "search" as const,
            autoCompleteValue: "off",
          };
        default:
          return {
            icon: undefined,
            inputType: "text",
            inputMode: "text" as const,
            autoCompleteValue: "off",
          };
      }
    }, [showPassword, type]);

    const Icon = config.icon;
    const hasError = Boolean(errorText);
    const helperId = helperText ? `${id}-helper` : undefined;
    const errorId = errorText ? `${id}-error` : undefined;
    const describedBy =
      [helperId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={`block ${className ?? ""}`}>
        {label ? (
          <label
            htmlFor={id}
            className="mb-2 block text-xs font-semibold text-contrast/70"
          >
            {label}
          </label>
        ) : null}
        <div className="flex items-center gap-3 rounded-lg border border-accent-3 bg-primary px-4 py-3 text-contrast focus-within:border-brand">
          {Icon ? <Icon className="text-lg text-contrast/70" /> : null}
          <input
            ref={ref}
            id={id}
            name={name ?? id}
            type={config.inputType}
            inputMode={config.inputMode}
            autoComplete={autoComplete ?? config.autoCompleteValue}
            value={value}
            onChange={onChange}
            placeholder={placeholder ?? ""}
            required={required}
            disabled={disabled}
            aria-label={placeholder ?? id}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className="w-full bg-transparent text-sm text-contrast outline-none placeholder:text-contrast/50"
          />
          {type === "password" ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="rounded-full p-1 text-contrast/70 hover:text-contrast"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <MdVisibilityOff className="text-lg" />
              ) : (
                <MdVisibility className="text-lg" />
              )}
            </button>
          ) : null}
        </div>
        {helperText ? (
          <span id={helperId} className="mt-2 block text-xs text-contrast/70">
            {helperText}
          </span>
        ) : null}
        {hasError ? (
          <span id={errorId} className="mt-2 block text-xs text-brand">
            {errorText}
          </span>
        ) : null}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
