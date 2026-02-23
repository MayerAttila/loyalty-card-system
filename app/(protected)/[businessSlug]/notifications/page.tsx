import { RequireRole } from "@/lib/auth/RequireRole";
import EmptyState from "@/components/EmptyState";
import { getSession } from "@/api/server/auth.api";
import NotificationsWorkspace from "./NotificationsWorkspace";

const NotificationsPage = async () => {
  const session = await getSession();
  const businessId = session?.user?.businessId;

  if (!businessId) {
    return (
      <EmptyState
        title="No business found"
        description="We couldn't find a business linked to this account."
        actionLabel="Go to login"
        actionHref="/login"
      />
    );
  }

  return (
    <RequireRole allow={["OWNER", "ADMIN"]}>
      <section className="space-y-6">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-contrast/60">
            Messaging
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-brand">
            Notifications
          </h1>
          <p className="mt-2 text-sm text-contrast/80">
            Schedule updates and promotional messages to loyalty cards.
          </p>
        </header>

        <NotificationsWorkspace businessId={businessId} />
      </section>
    </RequireRole>
  );
};

export default NotificationsPage;
