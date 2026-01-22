import { getSession } from "@/api/server/auth.api";
import ProfileClient from "./ProfileClient";

const ProfilePage = async () => {
  const session = await getSession();

  if (!session?.user?.id) {
    return <p>Missing profile data.</p>;
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
