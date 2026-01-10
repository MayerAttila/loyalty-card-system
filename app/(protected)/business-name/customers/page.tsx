import { RequireRole } from "@/lib/auth/RequireRole";

const CustomersPage = () => {
  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <h2 className="text-xl font-semibold text-brand">Customers</h2>
        <p className="mt-2 text-sm text-contrast/80">
          View customer profiles, loyalty progress, and reward eligibility.
        </p>
      </section>
    </RequireRole>
  );
};

export default CustomersPage;
