"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getBillingStatus } from "@/api/client/billing.api";

const billingAllowlist = ["/subscription"];

const isBillingPath = (pathname: string) =>
  billingAllowlist.some((path) => pathname.endsWith(path));

const isBillingActive = (status?: string | null) =>
  status === "active" || status === "trialing" || status === "trial";

const RequireBilling = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (isBillingPath(pathname)) {
      setChecking(false);
      return;
    }
    getBillingStatus()
      .then((data) => {
        if (!isMounted) return;
        if (!isBillingActive(data?.status)) {
          const parts = pathname.split("/").filter(Boolean);
          const businessSlug = parts[0];
          router.replace(`/${businessSlug}/subscription`);
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setChecking(false);
      });
    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (checking) return null;

  return <>{children}</>;
};

export default RequireBilling;
