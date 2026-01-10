"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/api/client/auth.api";

const navItems = [
  { href: "/business-name/business", label: "Business" },
  { href: "/business-name/cards", label: "Cards" },
  { href: "/business-name/employees", label: "Employees" },
  { href: "/business-name/customers", label: "Customers" },
  { href: "/business-name/stamping-logs", label: "Logs" },
  { href: "/business-name/stamping", label: "Stamping" },
];

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="border-b border-accent-3 bg-accent-1">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
        <div className="flex flex-1 items-center gap-3">
          <span className="text-sm uppercase tracking-wide text-contrast/70">
            Admin
          </span>
          <h1 className="text-lg font-semibold text-brand">
            Loyalty Dashboard
          </h1>
        </div>
        <Link
          className="rounded-lg border border-accent-4 px-3 py-1 text-sm font-semibold text-contrast"
          href="/"
        >
          Home
        </Link>
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
          className="rounded-lg bg-brand px-3 py-1 text-sm font-semibold text-primary"
        >
          Sign out
        </button>
      </div>
      <nav className="border-t border-accent-3">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-6 py-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              className="rounded-full border border-accent-4 bg-primary px-4 py-1 text-sm font-medium text-contrast"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
