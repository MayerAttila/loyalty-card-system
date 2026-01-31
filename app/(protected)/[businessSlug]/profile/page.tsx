import { getSession } from "@/api/server/auth.api";
import ProfileClient from "./ProfileClient";
import EmptyState from "@/components/EmptyState";

const ProfilePage = async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return (
      <EmptyState
        title="Profile unavailable"
        description="We couldn't load your profile details."
        actionLabel="Go to login"
        actionHref="/login"
      />
    );
  }

  return (
    <ProfileClient
      userId={session.user.id}
      initialName={session.user.name ?? ""}
      initialEmail={session.user.email ?? ""}
      roleLabel={session.user.role ?? "Unknown"}
    />
  );
};

export default ProfilePage;
