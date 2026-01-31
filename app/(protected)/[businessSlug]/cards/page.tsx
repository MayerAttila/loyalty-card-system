import { RequireRole } from "@/lib/auth/RequireRole";
import { getSession } from "@/api/server/auth.api";
import { getCardTemplatesByBusinessId } from "@/api/server/cardTemplate.api";
import CardsClient from "./CardsClient";
import EmptyState from "@/components/EmptyState";

const CardsPage = async () => {
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
  const templates = businessId
    ? await getCardTemplatesByBusinessId(businessId)
    : [];

  return (
    <RequireRole allow={["ADMIN", "OWNER"]}>
      <CardsClient
        initialTemplates={templates}
        businessId={businessId}
        initialBusinessName={session?.user?.businessName}
        initialHasLogo={session?.user?.businessHasLogo}
      />
    </RequireRole>
  );
};

export default CardsPage;
