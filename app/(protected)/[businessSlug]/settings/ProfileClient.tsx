"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import { updateUserProfile } from "@/api/client/user.api";
import { requestPasswordReset } from "@/api/client/passwordReset.api";
import { useSession } from "@/lib/auth/useSession";

type ProfileClientProps = {
  userId: string;
  initialName: string;
  initialEmail: string;
  roleLabel: string;
  planTypeLabel?: string;
  embedded?: boolean;
};

const ProfileClient = ({
  userId,
  initialName,
  initialEmail,
  roleLabel,
  planTypeLabel = "No active plan",
  embedded = false,
}: ProfileClientProps) => {
  const { refresh } = useSession();
  const [originalName, setOriginalName] = useState(initialName);
  const [originalEmail, setOriginalEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSendReset = async () => {
    if (isSendingReset || isSaving) return;
    const targetEmail = email.trim() || originalEmail.trim();
    if (!targetEmail) {
      toast.error("Email is required to reset password.");
      return;
    }

    try {
      setIsSendingReset(true);
      await requestPasswordReset({ email: targetEmail });
      toast.success("Reset password email sent.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to send reset password email.");
    } finally {
      setIsSendingReset(false);
    }
  };

  const containerClassName = embedded
    ? ""
    : "rounded-xl border border-accent-3 bg-accent-1 p-6";
  const displayName = name.trim() || "Unnamed user";
  const displayEmail = email.trim() || "No email";
  const avatarInitials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    const nextErrors: Partial<Record<string, string>> = {};
    if (!name.trim()) {
      nextErrors.name = "Name is required.";
    }
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateUserProfile(userId, {
        name: name.trim(),
        email: email.trim(),
      });
      const nextName = updated.name ?? name.trim();
      const nextEmail = updated.email ?? email.trim();
      setName(nextName);
      setEmail(nextEmail);
      setOriginalName(nextName);
      setOriginalEmail(nextEmail);
      setErrors({});
      toast.success("Profile updated.");
      refresh();
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className={containerClassName}>
      <div>
        <div>
          <h2 className="text-xl font-semibold text-brand">Profile</h2>
          <p className="mt-2 text-sm text-contrast/80">
            View your account details.
          </p>
        </div>
      </div>

      {!isEditing ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-accent-3 bg-primary/35">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent-3 bg-accent-2 text-sm font-semibold text-contrast">
                {avatarInitials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-contrast">
                  {displayName}
                </p>
                <p className="truncate text-sm text-contrast/65">
                  {displayEmail}
                </p>
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setIsEditing(true);
                setErrors({});
              }}
            >
              Edit profile
            </Button>
          </div>

          <div className="border-t border-accent-3">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <p className="text-sm text-contrast/70">Name</p>
              <p className="text-sm font-medium text-contrast">{displayName}</p>
            </div>
            <div className="border-t border-accent-3 flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <p className="text-sm text-contrast/70">Email account</p>
              <p className="text-sm font-medium text-contrast">{displayEmail}</p>
            </div>
            <div className="border-t border-accent-3 flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <p className="text-sm text-contrast/70">Role</p>
              <p className="text-sm font-medium text-contrast">{roleLabel}</p>
            </div>
            <div className="border-t border-accent-3 flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
              <p className="text-sm text-contrast/70">Plan type</p>
              <p className="text-sm font-medium text-contrast">
                {planTypeLabel}
              </p>
            </div>
          </div>

          <div className="border-t border-accent-3 p-4 sm:p-5">
            <div className="flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="neutral"
                onClick={handleSendReset}
                disabled={isSendingReset}
              >
                {isSendingReset ? "Sending..." : "Reset password"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <form
          className="mt-6 grid gap-4 rounded-2xl border border-accent-3 bg-primary/35 p-4 sm:p-5 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <CustomInput
            id="profileName"
            type="name"
            placeholder="Full name"
            value={name}
            errorText={errors.name}
            onChange={(event) => {
              setName(event.target.value);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: undefined }));
              }
            }}
          />
          <CustomInput
            id="profileEmail"
            type="email"
            placeholder="Email address"
            value={email}
            errorText={errors.email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: undefined }));
              }
            }}
          />
          <div className="md:col-span-2 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="neutral"
              onClick={handleSendReset}
              disabled={isSaving || isSendingReset}
            >
              {isSendingReset ? "Sending..." : "Reset password"}
            </Button>
            <Button
              type="button"
              variant="neutral"
              onClick={() => {
                setIsEditing(false);
                setName(originalName);
                setEmail(originalEmail);
                setErrors({});
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
};

export default ProfileClient;
