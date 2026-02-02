import { RequireRole } from "@/lib/auth/RequireRole";
import SubscriptionClient from "./SubscriptionClient";

const SubscriptionPage = () => {
  return (
    <RequireRole allow={["OWNER"]}>
      <SubscriptionClient />
    </RequireRole>
  );
};

export default SubscriptionPage;
