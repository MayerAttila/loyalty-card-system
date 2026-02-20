import ResetPasswordForm from "./ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams?:
    | {
        token?: string | string[];
      }
    | Promise<{
        token?: string | string[];
      }>;
};

const pickToken = (value: string | string[] | undefined) => {
  if (!value) return "";
  if (Array.isArray(value)) return (value[0] ?? "").trim();
  return value.trim();
};

const ResetPasswordPage = async ({ searchParams }: ResetPasswordPageProps) => {
  const resolvedSearchParams = (await Promise.resolve(searchParams)) ?? {};
  const token = pickToken(resolvedSearchParams.token);

  return (
    <main className="min-h-screen bg-transparent text-contrast">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-wide text-contrast/70">
            Password Reset
          </p>
          <h1 className="text-3xl font-semibold text-brand">Set new password</h1>
          <p className="mt-4 max-w-2xl text-base text-contrast/80">
            Choose a new password for your account.
          </p>
        </header>

        <ResetPasswordForm token={token} />
      </section>
    </main>
  );
};

export default ResetPasswordPage;
