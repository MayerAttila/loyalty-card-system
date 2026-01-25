import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { toBusinessSlug } from "@/lib/slug";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CookieItem = { name: string; value: string };

async function getSessionFromBE() {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore
    .getAll()
    .map((c: CookieItem) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_URL}/auth/session`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromBE();

  if (!session?.user) redirect("/login");
  if (session.user.approved === false) redirect("/pending-approval");
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
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
