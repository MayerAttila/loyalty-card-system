import Link from "next/link";

const FinalCta = () => {
  return (
    <section className="mt-16">
      <div className="rounded-2xl border border-accent-3 bg-accent-1 p-8 text-center">
        <h2 className="text-2xl font-semibold text-contrast">
          Ready to launch your loyalty program?
        </h2>
        <p className="mt-2 text-sm text-contrast/80">
          Start your free trial and issue your first card today.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            className="rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-primary"
            href="/register"
          >
            Register
          </Link>
          <Link
            className="rounded-lg border border-accent-4 px-5 py-3 text-sm font-semibold text-contrast"
            href="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
