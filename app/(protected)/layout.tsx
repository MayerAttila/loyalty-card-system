import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

  return (
    <div className="min-h-screen bg-primary text-contrast">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
