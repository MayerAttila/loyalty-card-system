"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import { updateUserProfile } from "@/api/client/user.api";
import { useSession } from "@/lib/auth/useSession";

type ProfileClientProps = {
  userId: string;
  initialName: string;
  initialEmail: string;
  roleLabel: string;
};

const ProfileClient = ({
  userId,
  initialName,
  initialEmail,
  roleLabel,
}: ProfileClientProps) => {
  const { refresh } = useSession();
  const [originalName, setOriginalName] = useState(initialName);
  const [originalEmail, setOriginalEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isEditing, setIsEditing] = useState(false);

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
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand">Profile</h2>
          <p className="mt-2 text-sm text-contrast/80">
            View your account details.
          </p>
        </div>
        <div className="inline-flex items-center rounded-full border border-accent-3 bg-primary/70 px-3 py-1 text-xs font-semibold text-contrast">
          {roleLabel}
        </div>
      </div>

      {!isEditing ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-contrast/60">
              Name
            </p>
            <p className="mt-2 text-base font-semibold text-contrast">
              {name}
            </p>
          </div>
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-contrast/60">
              Email
            </p>
            <p className="mt-2 text-base text-contrast">{email}</p>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setErrors({});
              }}
            >
              Edit profile
            </Button>
          </div>
        </div>
      ) : (
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
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
