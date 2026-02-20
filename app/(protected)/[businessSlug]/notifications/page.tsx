import { RequireRole } from "@/lib/auth/RequireRole";

const NotificationsPage = () => {
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

        <section className="rounded-2xl border border-accent-3 bg-accent-1 p-6">
          <h2 className="text-xl font-semibold text-brand">Coming soon</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Notification scheduling UI will be added here. This page is ready
            for the next implementation step.
          </p>
        </section>
      </section>
    </RequireRole>
  );
};

export default NotificationsPage;
