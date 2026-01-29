import { RequireRole } from "@/lib/auth/RequireRole";
import StampingLogsClient from "./StampingLogsClient";

const StampingLogsPage = () => {
  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <h2 className="text-xl font-semibold text-brand">Logs</h2>
        <p className="mt-2 text-sm text-contrast/80">
          Review redemption history, stamp activity, and system events.
        </p>
        <StampingLogsClient />
      </section>
    </RequireRole>
  );
};

export default StampingLogsPage;
