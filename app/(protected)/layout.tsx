import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";
import { toBusinessSlug } from "@/lib/slug";
import RequireSubscription from "@/lib/subscription/RequireSubscription";
import { getSession } from "@/api/server/auth.api";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) redirect("/login");
  const businessSlug = toBusinessSlug(session.user.businessName);
  const basePath = businessSlug ? `/${businessSlug}` : "/business-name";

  return (
    <div className="flex min-h-screen bg-primary text-contrast">
      <Navbar
        currentUserRole={session.user.role}
        businessName={session.user.businessName}
        businessId={session.user.businessId}
        businessHasLogo={session.user.businessHasLogo}
        userName={session.user.name}
        userRole={session.user.role}
        basePath={basePath}
      />
      <main className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <RequireSubscription>{children}</RequireSubscription>
        </div>
      </main>
    </div>
  );
}
