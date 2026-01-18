import { RequireRole } from "@/lib/auth/RequireRole";
import LoyaltyCard from "./LoyaltyCard";

const CardsPage = () => {
  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <h2 className="text-xl font-semibold text-brand">Cards</h2>
        <p className="mt-2 text-sm text-contrast/80">
          Create and manage loyalty card templates, rewards, and stamp rules.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <LoyaltyCard
            businessName="Coffee Club"
            ownerName="Alex Morgan"
            maxPoints={10}
            filledPoints={3}
            rewardsCollected={1}
          />
          <LoyaltyCard
            businessName="Lunch Passport"
            ownerName="Jordan Lee"
            maxPoints={8}
            filledPoints={0}
            rewardsCollected={0}
          />
        </div>
      </section>
    </RequireRole>
  );
};

export default CardsPage;
