"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoyaleLogo from "@/components/LoyaleLogo";

const menuLinks = [
  { id: "features", label: "Features" },
  { id: "demo", label: "Card Demos" },
  { id: "how-it-works", label: "How It Works" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

const MainHeader = ({
  logoColor = "var(--color-primary)",
}: {
  logoColor?: string;
}) => {
  const pathname = usePathname();

  const handleMenuClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (pathname !== "/") return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();

    const targetY = target.getBoundingClientRect().top + window.scrollY - 12;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: targetY, behavior: "auto" });
    } else {
      // Native smooth scroll works better with GSAP ScrollTrigger sections
      // than a custom rAF tween when passing pinned/scrubbed areas.
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }

    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <div className="bg-brand">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-primary">
        <Link
          className="inline-flex items-center"
          href="/"
          aria-label="Loyale Home"
        >
          <LoyaleLogo
            color={logoColor}
            className="h-12 w-20 md:h-14 md:w-24"
            label="Loyale"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
          {menuLinks.map((item) => (
            <Link
              key={item.id}
              href={pathname === "/" ? `#${item.id}` : `/#${item.id}`}
              className="text-primary/85 transition hover:text-primary"
              onClick={(event) => handleMenuClick(event, item.id)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-sm font-semibold md:gap-4">
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
