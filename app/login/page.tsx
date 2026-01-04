import Link from "next/link";

const LoginPage = () => {
  return (
    <main className="min-h-screen bg-primary text-contrast">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="mb-8">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Welcome Back
          </p>
          <h1 className="text-3xl font-semibold text-brand">Log In</h1>
          <p className="mt-4 text-base text-contrast/80">
            Access your business dashboard or continue serving customers.
          </p>
        </header>

        <section className="rounded-xl border border-accent-3 bg-accent-2 p-6">
          <p className="text-sm text-contrast/80">
            Login form fields will go here. This will support business owners
            and employees.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary"
              href="/admin"
            >
              Log In
            </Link>
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

export default LoginPage;
