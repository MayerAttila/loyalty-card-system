import Link from "next/link";

const BusinessRegisterPage = () => {
  return (
    <main className="min-h-screen bg-primary text-contrast">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Registration
          </p>
          <h1 className="text-3xl font-semibold text-brand">
            Business Registration
          </h1>
          <p className="mt-4 text-base text-contrast/80">
            Create your business profile, define loyalty rules, and invite your
            team to manage customer rewards.
          </p>
        </header>

        <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
          <p className="text-sm text-contrast/80">
            Form fields will go here. Tell us about your business, locations,
            and how your loyalty program should work.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary">
              Continue
            </button>
            <Link
              className="rounded-lg border border-accent-4 px-4 py-2 text-sm font-semibold text-contrast"
              href="/"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BusinessRegisterPage;
