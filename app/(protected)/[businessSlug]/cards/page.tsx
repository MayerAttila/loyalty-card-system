import { RequireRole } from "@/lib/auth/RequireRole";
import { getSession } from "@/api/server/auth.api";
import { getCardTemplatesByBusinessId } from "@/api/server/cardTemplate.api";
import CardsClient from "./CardsClient";

const CardsPage = async () => {
  const session = await getSession();
  const businessId = session?.user?.businessId;
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
