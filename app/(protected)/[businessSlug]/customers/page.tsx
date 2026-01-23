import { getSession } from "@/api/server/auth.api";
import { RequireRole } from "@/lib/auth/RequireRole";
import CustomerInviteCard from "../business/CustomerInviteCard";

const CustomersPage = async () => {
  const session = await getSession();
  const businessId = session?.user?.businessId;

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <div className="space-y-6">
        <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
          <h2 className="text-xl font-semibold text-brand">Customers</h2>
          <p className="mt-2 text-sm text-contrast/80">
            View customer profiles, loyalty progress, and reward eligibility.
          </p>
        </section>
        {businessId ? <CustomerInviteCard businessId={businessId} /> : null}
      </div>
    </RequireRole>
  );
};

export default CustomersPage;
