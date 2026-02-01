import CheckoutClient from "./CheckoutClient";
import { RequireRole } from "@/lib/auth/RequireRole";

const CheckoutPage = () => {
  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <CheckoutClient />
    </RequireRole>
  );
};

export default CheckoutPage;
