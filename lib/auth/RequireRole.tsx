"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/useSession";

type Role = "OWNER" | "ADMIN" | "STAFF";

export function RequireRole({
  allow,
  children,
}: {
  allow: Role[];
  children: React.ReactNode;
}) {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    if (session.user.approved === false) {
      router.replace("/pending-approval");
      return;
    }

    const role = session.user.role;
    if (!role || !allow.includes(role)) {
      router.replace("/business-name/unauthorized");
    }
  }, [loading, session, router, allow]);

  if (loading) return null;
  if (!session?.user) return null;

  const role = session.user.role;
  if (!role || !allow.includes(role)) return null;

  return <>{children}</>;
}
