import { RequireRole } from "@/lib/auth/RequireRole";
import CardEditorClient from "./CardEditorClient";

const CardsPage = () => {
  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <h2 className="text-xl font-semibold text-brand">Cards</h2>
        <p className="mt-2 text-sm text-contrast/80">
          Create and manage loyalty card templates, rewards, and stamp rules.
        </p>
        <CardEditorClient />
      </section>
    </RequireRole>
  );
};

export default CardsPage;
