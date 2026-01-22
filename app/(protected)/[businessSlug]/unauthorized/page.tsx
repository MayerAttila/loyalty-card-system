import Link from "next/link";

const UnauthorizedPage = ({ params }: { params: { businessSlug: string } }) => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-2xl rounded-2xl border border-accent-3 bg-accent-1 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-contrast/60">
          Access Restricted
        </p>
        <div className="mt-6 flex justify-center">
          <img
            src="/unauthorized-white.png"
            alt=""
            className="h-40 w-auto dark:hidden"
          />
          <img
            src="/unauthorized-dark.png"
            alt=""
            className="hidden h-40 w-auto dark:block"
          />
        </div>
        <h1 className="mt-3 text-3xl font-semibold text-brand">
          You don&apos;t have access to this page
        </h1>
        <p className="mt-4 text-base text-contrast/80">
          Contact an administrator or the business owner if you think this is a
          mistake.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href={`/${params.businessSlug}/profile`}
            className="inline-flex items-center justify-center rounded-lg border border-accent-3 bg-primary px-5 py-2.5 text-sm font-semibold text-contrast transition hover:border-accent-4 hover:bg-accent-2"
          >
            Back to profile
          </Link>
        </div>
      </div>
    </main>
  );
};

export default UnauthorizedPage;
