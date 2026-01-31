import { getBusinessById } from "@/api/server/business.api";
import { getSession } from "@/api/server/auth.api";
import { RequireRole } from "@/lib/auth/RequireRole";
import BusinessClient from "./BusinessClient";
import EmptyState from "@/components/EmptyState";

const BusinessPage = async () => {
  const session = await getSession();

  if (!session?.user?.businessId) {
    return (
      <EmptyState
        title="No business found"
        description="We couldn't find a business linked to this account."
        actionLabel="Go to login"
        actionHref="/login"
      />
    );
  }

  const business = await getBusinessById(session.user.businessId);
  if (!business) {
    return (
      <EmptyState
        title="Business not found"
        description="The business linked to this account no longer exists."
        actionLabel="Back to home"
        actionHref="/"
      />
    );
  }

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <BusinessClient initialBusiness={business} />
    </RequireRole>
  );
};

export default BusinessPage;
