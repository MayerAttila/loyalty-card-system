import { getSession } from "@/api/server/auth.api";
import EmptyState from "@/components/EmptyState";
import SettingsClient from "./SettingsClient";

const SettingsPage = async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return (
      <EmptyState
        title="Settings unavailable"
        description="We couldn't load your account settings."
        actionLabel="Go to login"
        actionHref="/login"
      />
    );
  }

  const roleLabel = session.user.role ?? "Unknown";
  const isOwner = session.user.role === "OWNER";

  return (
    <SettingsClient
      userId={session.user.id}
      initialName={session.user.name ?? ""}
      initialEmail={session.user.email ?? ""}
      roleLabel={roleLabel}
      isOwner={isOwner}
    />
  );
};

export default SettingsPage;
