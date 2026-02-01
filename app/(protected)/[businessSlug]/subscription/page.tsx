import { RequireRole } from "@/lib/auth/RequireRole";
import BillingClient from "./BillingClient";

const BillingPage = () => {
  return (
    <RequireRole allow={["OWNER"]}>
      <BillingClient />
    </RequireRole>
  );
};

export default BillingPage;
