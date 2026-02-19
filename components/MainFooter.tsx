"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LoyaleLogo from "@/components/LoyaleLogo";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "Demo Cards", href: "/#demo" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const accountLinks = [
  { label: "Create Account", href: "/register" },
  { label: "Sign In", href: "/login" },
  { label: "Pricing", href: "/#pricing" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const getSectionIdFromHref = (href: string) =>
  href.startsWith("/#") ? href.slice(2) : null;

const MainFooter = () => {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    if (pathname !== "/") return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();

    const targetY = target.getBoundingClientRect().top + window.scrollY - 12;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? "auto"
      : "smooth";

    window.scrollTo({ top: targetY, behavior });
    window.history.replaceState(null, "", `/#${id}`);
  };

  return (
    <footer className="-mt-px bg-brand text-primary">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-0">
        <div className="grid gap-10 pb-4 pt-0 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Loyale Home"
            >
              <LoyaleLogo
                color="var(--color-primary)"
                className="h-14 w-24 md:h-16 md:w-28"
                label="Loyale"
              />
            </Link>
            <p className="max-w-sm text-sm leading-6 text-primary/80">
              Build modern loyalty programs your customers can add to Apple
              Wallet and Google Wallet in seconds.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/70">
              Product
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-primary/85">
              {productLinks.map((link) => {
                const sectionId = getSectionIdFromHref(link.href);
                return (
                  <li key={link.label}>
                    <Link
                      className="transition hover:text-primary"
                      href={pathname === "/" && sectionId ? `#${sectionId}` : link.href}
                      onClick={
                        sectionId
                          ? (event) => handleSectionClick(event, sectionId)
                          : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/70">
              Account
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-primary/85">
              {accountLinks.map((link) => {
                const sectionId = getSectionIdFromHref(link.href);
                return (
                  <li key={link.label}>
                    <Link
                      className="transition hover:text-primary"
                      href={pathname === "/" && sectionId ? `#${sectionId}` : link.href}
                      onClick={
                        sectionId
                          ? (event) => handleSectionClick(event, sectionId)
                          : undefined
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/70">
              Support
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-primary/85">
              <li>
                <a
                  className="transition hover:text-primary"
                  href="mailto:support@loyale.online"
                >
                  support@loyale.online
                </a>
              </li>
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    className="transition hover:text-primary"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 text-xs text-primary/65">
                Built by{" "}
                <a
                  className="transition-colors hover:text-primary"
                  href="https://github.com/MayerAttila"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Attila Mayer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-primary/30 pt-4 text-xs text-primary/70 md:flex-row md:items-center md:justify-between">
          <span>&copy; {currentYear} Loyale. All rights reserved.</span>
          <span>Apple Wallet and Google Wallet ready.</span>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
