"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

type ThemeSwitchProps = {
  label?: string;
  showLabel?: boolean;
  className?: string;
  labelClassName?: string;
  iconClassName?: string;
};

export default function ThemeSwitch({
  label = "Theme",
  showLabel = true,
  className = "",
  labelClassName = "",
  iconClassName = "",
}: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const Icon = isDark ? FiSun : FiMoon;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={className}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {mounted && <Icon className={iconClassName} />}
      {showLabel && <span className={labelClassName}>{label}</span>}
    </button>
  );
}
