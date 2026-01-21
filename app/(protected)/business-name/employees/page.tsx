import { RequireRole } from "@/lib/auth/RequireRole";
import { getUsersByBusinessId } from "@/api/server/user.api";
import EmployeeClient from "./EmployeeClient";
import { getSession } from "@/api/server/auth.api";

const EmployeesPage = async () => {
  const session = await getSession();

  if (!session?.user?.businessId) return <p>Missing business ID</p>;

  const businessId = session.user.businessId;
  const initialUserData = await getUsersByBusinessId(businessId);

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <EmployeeClient
        initialUserData={initialUserData}
        currentUserRole={session.user.role}
        businessId={businessId}
      />
    </RequireRole>
  );
};

export default EmployeesPage;
