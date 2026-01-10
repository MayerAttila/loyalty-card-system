import { RequireRole } from "@/lib/auth/RequireRole";

const BusinessPage = () => {
  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <h2 className="text-xl font-semibold text-brand">Business</h2>
        <p className="mt-2 text-sm text-contrast/80">
          Review business details, locations, contacts, and operating settings.
        </p>
      </section>
    </RequireRole>
  );
};

export default BusinessPage;
