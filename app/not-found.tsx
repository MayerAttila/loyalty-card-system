import Link from "next/link";
import { getSession } from "@/api/server/auth.api";
import { toBusinessSlug } from "@/lib/slug";

const NotFoundPage = async () => {
  const session = await getSession();
  const businessSlug = toBusinessSlug(session?.user?.businessName);
  const backHref = businessSlug ? `/${businessSlug}/profile` : "/";
  const backLabel = businessSlug ? "Back to profile" : "Back to home";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12 text-center">
      <div className="w-full max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-contrast/60">
          Page Not Found
        </p>
        <div className="mt-6 flex justify-center">
          <img
            src="/page-not-found.png"
            alt="Page not found illustration"
            className="h-64 w-auto md:h-72 lg:h-80"
          />
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-brand">
          We can&apos;t find the page you&apos;re looking for
        </h1>
        <p className="mt-4 text-base text-contrast/80">
          The link may be outdated or the page may have moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href={backHref}
            className="inline-flex items-center justify-center rounded-lg border border-accent-3 bg-primary px-5 py-2.5 text-sm font-semibold text-contrast transition hover:border-accent-4 hover:bg-accent-2"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPage;
