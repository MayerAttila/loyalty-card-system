"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth/useSession";
import { toBusinessSlug } from "@/lib/slug";

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
  const params = useParams<{ businessSlug?: string }>();
  const sessionBusinessSlug = toBusinessSlug(session?.user?.businessName);
  const basePath = params?.businessSlug
    ? `/${params.businessSlug}`
    : sessionBusinessSlug
    ? `/${sessionBusinessSlug}`
    : "/business-name";

  useEffect(() => {
    if (loading) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    const role = session.user.role;
    if (!role || !allow.includes(role)) {
      router.replace(`${basePath}/unauthorized`);
    }
  }, [allow, basePath, loading, router, session]);

  if (loading) return null;
  if (!session?.user) return null;

  const role = session.user.role;
  if (!role || !allow.includes(role)) return null;

  return <>{children}</>;
}
