import { RequireRole } from "@/lib/auth/RequireRole";
import { getUsersByBusinessId } from "@/api/server/user.api";
import EmployeeClient from "./EmployeeClient";
import { getSession } from "@/api/server/auth.api";
import EmptyState from "@/components/EmptyState";
import HelpCard from "@/components/HelpCard";

const EmployeesPage = async () => {
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

  const businessId = session.user.businessId;
  const initialUserData = await getUsersByBusinessId(businessId);
  const hasTeamMembers = initialUserData.some((user) => user.role !== "OWNER");

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <div className="space-y-6">
        {!hasTeamMembers ? (
          <HelpCard
            title="Invite your first employee"
            description="Add team members so they can help with stamping and customer management."
          />
        ) : null}
        <EmployeeClient
          initialUserData={initialUserData}
          currentUserRole={session.user.role}
          businessId={businessId}
        />
      </div>
    </RequireRole>
  );
};

export default EmployeesPage;
