import { getSession } from "@/api/server/auth.api";
import { getCustomersByBusinessId } from "@/api/server/customer.api";
import { RequireRole } from "@/lib/auth/RequireRole";
import CustomerInviteCard from "../business/CustomerInviteCard";
import CustomersClient from "./CustomersClient";

const CustomersPage = async () => {
  const session = await getSession();
  const businessId = session?.user?.businessId;
  const customers = businessId
    ? await getCustomersByBusinessId(businessId)
    : [];

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <div className="space-y-6">
        {businessId ? <CustomerInviteCard businessId={businessId} /> : null}
        <CustomersClient customers={customers} />
      </div>
    </RequireRole>
  );
};

export default CustomersPage;
