import { RequireRole } from "@/lib/auth/RequireRole";

const EmployeesPage = () => {
  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <h2 className="text-xl font-semibold text-brand">Employees</h2>
        <p className="mt-2 text-sm text-contrast/80">
          Manage employee access, roles, and onboarding invitations.
        </p>
      </section>
    </RequireRole>
  );
};

export default EmployeesPage;
