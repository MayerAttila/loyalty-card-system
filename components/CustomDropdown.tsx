"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type CustomDropdownOption = {
  value: string;
  label: string;
  metaLabel?: string;
};

type CustomDropdownProps = {
  value: string;
  options: CustomDropdownOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  buttonClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
};

const CustomDropdown = ({
  value,
  options,
  onChange,
  ariaLabel,
  buttonClassName = "",
  menuClassName = "",
  optionClassName = "",
}: CustomDropdownProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-8 min-w-[150px] items-center justify-between gap-2 rounded-md border bg-primary/70 px-2 text-xs font-medium text-contrast outline-none transition-colors ${
          open ? "border-brand" : "border-accent-3 hover:border-brand/60"
        } ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span className="truncate">
          {selectedOption?.label ?? value}
        </span>
        <span
          className={`text-[10px] text-contrast/70 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        >
          v
        </span>
      </button>

      {open ? (
        <div
          className={`absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-accent-3 bg-accent-1 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.7)] ${menuClassName}`}
        >
          <ul
            role="listbox"
            aria-label={ariaLabel}
            className="max-h-64 overflow-y-auto py-1"
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li key={option.value} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-brand/10 text-brand"
                        : "text-contrast hover:bg-primary/60"
                    } ${optionClassName}`}
                  >
                    <span>{option.label}</span>
                    {option.metaLabel ? (
                      <span className="text-[10px] text-contrast/55">
                        {option.metaLabel}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default CustomDropdown;

