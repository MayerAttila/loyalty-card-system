"use client";

import Link from "next/link";
import LoyaleLogo from "@/components/LoyaleLogo";
import ThemeSwitch from "@/components/ThemeSwitch";

const MainHeader = ({
  logoColor = "var(--color-primary)",
}: {
  logoColor?: string;
}) => {
  return (
    <div className="bg-brand">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-primary">
        <Link
          className="inline-flex items-center"
          href="/"
          aria-label="Loyale Home"
        >
          <LoyaleLogo
            color={logoColor}
            className="h-16 w-28 md:h-20 md:w-36"
            label="Loyale"
          />
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <ThemeSwitch
            showLabel={false}
            className="rounded-lg border border-primary/40 p-2 text-primary/90 transition hover:bg-primary/10"
            iconClassName="h-4 w-4"
          />
          <Link className="text-primary/80 hover:text-primary" href="/register">
            Register
          </Link>
          <Link
            className="rounded-lg bg-primary px-3 py-1.5 text-brand hover:bg-primary/90"
            href="/login"
          >
            Log In
          </Link>
        </div>
      </header>
    </div>
  );
};

export default MainHeader;
