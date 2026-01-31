import { getSession } from "@/api/server/auth.api";
import { getCustomersByBusinessId } from "@/api/server/customer.api";
import { RequireRole } from "@/lib/auth/RequireRole";
import CustomerInviteCard from "../business/CustomerInviteCard";
import CustomersClient from "./CustomersClient";
import EmptyState from "@/components/EmptyState";
import HelpCard from "@/components/HelpCard";

const CustomersPage = async () => {
  const session = await getSession();
  const businessId = session?.user?.businessId;
  if (!businessId) {
    return (
      <EmptyState
        title="No business found"
        description="We couldn't find a business linked to this account."
        actionLabel="Go to login"
        actionHref="/login"
      />
    );
  }
  const customers = businessId
    ? await getCustomersByBusinessId(businessId)
    : [];

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <div className="space-y-6">
        {customers.length === 0 ? (
          <HelpCard
            title="No customers yet"
            description="Share your invite link below to register your first customers."
          />
        ) : null}
        {businessId ? <CustomerInviteCard businessId={businessId} /> : null}
        <CustomersClient customers={customers} />
      </div>
    </RequireRole>
  );
};

export default CustomersPage;
