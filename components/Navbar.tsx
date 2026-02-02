"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "@/api/client/auth.api";
import ThemeSwitch from "@/components/ThemeSwitch";
import {
  FiBriefcase,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiLayers,
  FiList,
  FiLogOut,
  FiUser,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

type Role = "OWNER" | "ADMIN" | "STAFF";

const buildNavItems = (
  basePath: string,
): Array<{
  href: string;
  label: string;
  icon: typeof FiBriefcase;
  allow?: Role[];
}> => [
  {
    href: `${basePath}/business`,
    label: "Business",
    icon: FiBriefcase,
    allow: ["ADMIN", "OWNER"],
  },
  {
    href: `${basePath}/cards`,
    label: "Cards",
    icon: FiCreditCard,
    allow: ["ADMIN", "OWNER"],
  },
  {
    href: `${basePath}/employees`,
    label: "Employees",
    icon: FiUsers,
    allow: ["ADMIN", "OWNER"],
  },
  {
    href: `${basePath}/customers`,
    label: "Customers",
    icon: FiUserCheck,
    allow: ["ADMIN", "OWNER"],
  },
  {
    href: `${basePath}/stamping-logs`,
    label: "Logs",
    icon: FiList,
    allow: ["ADMIN", "OWNER"],
  },
  {
    href: `${basePath}/subscription`,
    label: "Subscription",
    icon: FiLayers,
    allow: ["ADMIN", "OWNER"],
  },
  { href: `${basePath}/profile`, label: "Profile", icon: FiUser },
  { href: `${basePath}/stamping`, label: "Stamping", icon: FiCheckSquare },
];

export default function Navbar({
  currentUserRole,
  businessName,
  businessId,
  businessHasLogo,
  userName,
  userRole,
  basePath = "/business-name",
}: {
  currentUserRole?: Role;
  businessName?: string;
  businessId?: string;
  businessHasLogo?: boolean;
  userName?: string | null;
  userRole?: Role;
  basePath?: string;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const allowedNavItems = buildNavItems(basePath).filter((item) => {
    if (!item.allow) return true;
    if (!currentUserRole) return false;
    return item.allow.includes(currentUserRole);
  });
  const displayBusinessName = businessName?.trim() || "Business";
  const displayUserName = userName?.trim() || "User";
  const displayUserRole = userRole ?? currentUserRole;
  const businessInitials = displayBusinessName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const logoSrc =
    apiBaseUrl && businessId && businessHasLogo !== false
      ? `${apiBaseUrl}/business/id/${businessId}/logo`
      : "";
  useEffect(() => {
    setLogoError(false);
  }, [logoSrc]);

  return (
    <aside
      className={`flex min-h-screen flex-col border-r border-accent-3 bg-accent-1 transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-5">
        <div
          className={`flex min-w-0 items-center gap-3 overflow-hidden transition-all ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl ${
              logoSrc && !logoError
                ? "bg-transparent"
                : "border border-accent-3 bg-accent-2"
            }`}
          >
            {logoSrc && !logoError ? (
              <img
                src={logoSrc}
                alt={`${displayBusinessName} logo`}
                className="h-full w-full object-contain"
                onError={() => {
                  setLogoError(true);
                }}
              />
            ) : (
              <span className="text-xs font-semibold text-contrast/80">
                {businessInitials || "BN"}
              </span>
            )}
          </div>
          <div className="min-w-0 flex flex-col justify-center">
            <p className="truncate text-xs text-contrast/70">
              {displayUserName}
              {displayUserRole ? ` • ${displayUserRole}` : ""}
            </p>
            <h1 className="truncate whitespace-nowrap text-base font-semibold text-brand">
              {displayBusinessName}
            </h1>
          </div>
        </div>
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-lg border border-accent-4 p-2 text-contrast transition hover:bg-accent-2"
        >
          {collapsed ? (
            <FiChevronRight className="h-4 w-4" />
          ) : (
            <FiChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {allowedNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={`flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-sm font-medium text-contrast transition hover:border-accent-4 hover:bg-accent-2 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <Icon className="h-5 w-5 shrink-0 text-contrast" />
              {!collapsed && (
                <span className="whitespace-nowrap">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-accent-3 px-3 py-4">
        <ThemeSwitch
          showLabel={!collapsed}
          className={`flex w-full items-center gap-3 rounded-xl border border-accent-4 px-3 py-2 text-sm font-semibold text-contrast transition hover:bg-accent-2 ${
            collapsed ? "justify-center" : ""
          }`}
          iconClassName="h-5 w-5 shrink-0"
          labelClassName="whitespace-nowrap"
        />
        <button
          type="button"
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
          title="Sign out"
          aria-label="Sign out"
          className={`flex w-full items-center gap-3 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-primary transition hover:brightness-110 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <FiLogOut className="h-5 w-5 shrink-0 text-primary" />
          {!collapsed && <span className="whitespace-nowrap">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
