"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getSubscriptionStatusAction } from "@/lib/subscription/actions";

const subscriptionAllowlist = ["/subscription"];

const isSubscriptionPath = (pathname: string) =>
  subscriptionAllowlist.some((path) => pathname.endsWith(path));

const isSubscriptionActive = (status?: string | null) =>
  status === "active" || status === "trialing" || status === "trial";

const RequireSubscription = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (isSubscriptionPath(pathname)) {
      setChecking(false);
      return;
    }
    getSubscriptionStatusAction()
      .then((data) => {
        if (!isMounted) return;
        if (!isSubscriptionActive(data?.status)) {
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

export default RequireSubscription;
