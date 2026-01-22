import { getBusinessById } from "@/api/server/business.api";
import { getSession } from "@/api/server/auth.api";
import { RequireRole } from "@/lib/auth/RequireRole";
import BusinessClient from "./BusinessClient";

const BusinessPage = async () => {
  const session = await getSession();

  if (!session?.user?.businessId) return <p>Missing business ID</p>;

  const business = await getBusinessById(session.user.businessId);
  if (!business) return <p>Business not found</p>;

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <BusinessClient initialBusiness={business} />
    </RequireRole>
  );
};

export default BusinessPage;
