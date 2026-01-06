import Link from "next/link";
import CustomInput from "@/components/CustomInput";

const page = () => {
  return (
    <main className="min-h-screen bg-primary text-contrast">
      <div>
        <CustomInput id="text" type="search" placeholder="text" />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Welcome to
          </p>
          <h1 className="text-3xl font-semibold text-brand">Brand Name</h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            A loyalty card platform where businesses can register and manage
            reward programs, and employees can enroll to track visits and unlock
            rewards. Build stronger customer relationships with a simple, modern
            digital card.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-accent-3 bg-accent-1 p-6">
            <h2 className="text-lg font-semibold">Register</h2>
            <p className="mt-2 text-sm text-contrast/80">
              Choose whether you are registering a business or joining as an
              employee.
            </p>
            <Link
              className="mt-4 block w-full rounded-lg bg-brand px-4 py-2 text-center text-sm font-semibold text-primary"
              href="/register"
            >
              Choose Registration
            </Link>
          </div>

          <div className="rounded-xl border border-accent-3 bg-accent-2 p-6">
            <h2 className="text-lg font-semibold">Already have an account?</h2>
            <p className="mt-2 text-sm text-contrast/80">
              Sign in to manage your business or continue serving customers.
            </p>
            <Link
              className="mt-4 block w-full rounded-lg border border-accent-4 px-4 py-2 text-center text-sm font-semibold text-contrast"
              href="/login"
            >
              Log In
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
