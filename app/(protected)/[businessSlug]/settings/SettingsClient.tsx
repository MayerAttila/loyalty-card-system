"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import ThemeSwitch from "@/components/ThemeSwitch";
import { changeUserPassword, updateUserProfile } from "@/api/client/user.api";
import { useSession } from "@/lib/auth/useSession";
import SubscriptionClient from "./SubscriptionClient";

type SettingsClientProps = {
  userId: string;
  initialName: string;
  initialEmail: string;
  roleLabel: string;
  isOwner: boolean;
};

const getPasswordRuleError = (password: string) => {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }
  return null;
};

const getApiMessage = (error: unknown, fallback: string) => {
  const message = (error as { response?: { data?: { message?: unknown } } })
    ?.response?.data?.message;
  return typeof message === "string" && message.trim() ? message : fallback;
};

const SettingsClient = ({
  userId,
  initialName,
  initialEmail,
  roleLabel,
  isOwner,
}: SettingsClientProps) => {
  const { refresh } = useSession();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState<
    Partial<Record<"name" | "email", string>>
  >({});

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<
      Record<"currentPassword" | "newPassword" | "confirmPassword", string>
    >
  >({});

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSavingProfile) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const nextErrors: Partial<Record<"name" | "email", string>> = {};

    if (!trimmedName) {
      nextErrors.name = "Name is required.";
    }
    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setProfileErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setIsSavingProfile(true);
      await updateUserProfile(userId, {
        name: trimmedName,
        email: trimmedEmail,
      });
      setProfileErrors({});
      refresh();
      toast.success("Profile updated.");
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, "Unable to update profile."));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (isSavingPassword) return;

    const nextErrors: Partial<
      Record<"currentPassword" | "newPassword" | "confirmPassword", string>
    > = {};

    if (!currentPassword) {
      nextErrors.currentPassword = "Current password is required.";
    }
    if (!newPassword) {
      nextErrors.newPassword = "New password is required.";
    } else {
      const passwordRuleError = getPasswordRuleError(newPassword);
      if (passwordRuleError) {
        nextErrors.newPassword = passwordRuleError;
      }
    }
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors);
      toast.error("Please fix the password form.");
      return;
    }

    try {
      setIsSavingPassword(true);
      await changeUserPassword(userId, {
        currentPassword,
        newPassword,
      });
      setPasswordErrors({});
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated.");
    } catch (error) {
      console.error(error);
      toast.error(getApiMessage(error, "Unable to update password."));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-contrast/60">
            Account
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-brand">Settings</h1>
          <p className="mt-2 text-sm text-contrast/80">
            Update your profile, password, and subscription in one place.
          </p>
        </div>
        <ThemeSwitch
          showLabel={false}
          className="inline-flex items-center rounded-xl border border-accent-4 px-3 py-2 text-contrast transition hover:bg-accent-2"
          iconClassName="h-4 w-4"
        />
      </header>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-accent-3 bg-accent-1 p-6">
          <h2 className="text-xl font-semibold text-brand">Profile</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Manage your account details.
          </p>

          <form className="mt-5 grid gap-4" onSubmit={handleSaveProfile}>
            <CustomInput
              id="settingsProfileName"
              type="name"
              placeholder="Full name"
              value={name}
              errorText={profileErrors.name}
              onChange={(event) => {
                setName(event.target.value);
                if (profileErrors.name) {
                  setProfileErrors((prev) => ({ ...prev, name: undefined }));
                }
              }}
            />
            <CustomInput
              id="settingsProfileEmail"
              type="email"
              placeholder="Email address"
              value={email}
              errorText={profileErrors.email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (profileErrors.email) {
                  setProfileErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
            />

            <div className="rounded-xl border border-accent-3 bg-primary/35 px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-contrast/70">Role</p>
                <p className="text-sm font-semibold text-contrast">
                  {roleLabel}
                </p>
              </div>
            </div>

            <p className="text-xs text-contrast/65">
              Keep these details accurate. They are used for account identity
              and permissions.
            </p>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? "Saving..." : "Save profile changes"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-accent-3 bg-accent-1 p-6">
          <h2 className="text-xl font-semibold text-brand">Security</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Change password directly here. No reset email needed.
          </p>

          <form className="mt-5 grid gap-4" onSubmit={handleChangePassword}>
            <CustomInput
              id="settingsCurrentPassword"
              type="password"
              placeholder="Current password"
              value={currentPassword}
              errorText={passwordErrors.currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                if (passwordErrors.currentPassword) {
                  setPasswordErrors((prev) => ({
                    ...prev,
                    currentPassword: undefined,
                  }));
                }
              }}
            />
            <CustomInput
              id="settingsNewPassword"
              type="password"
              placeholder="New password"
              value={newPassword}
              errorText={passwordErrors.newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                if (passwordErrors.newPassword) {
                  setPasswordErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                  }));
                }
              }}
            />
            <CustomInput
              id="settingsConfirmPassword"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              errorText={passwordErrors.confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (passwordErrors.confirmPassword) {
                  setPasswordErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }
              }}
            />
            <p className="text-xs text-contrast/65">
              Password must be at least 8 characters and include one uppercase
              letter and one number.
            </p>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? "Updating..." : "Update password"}
              </Button>
            </div>
          </form>
        </section>
      </div>

      {isOwner ? (
        <section className="rounded-2xl border border-accent-3 bg-accent-1 p-6">
          <SubscriptionClient embedded />
        </section>
      ) : (
        <section className="rounded-2xl border border-accent-3 bg-accent-1 p-6">
          <h2 className="text-xl font-semibold text-brand">Subscription</h2>
          <p className="mt-2 text-sm text-contrast/80">
            Only the business owner can manage subscription settings.
          </p>
        </section>
      )}
    </section>
  );
};

export default SettingsClient;
