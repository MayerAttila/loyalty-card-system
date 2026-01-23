"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updateBusiness } from "@/api/client/business.api";
import CustomInput from "@/components/CustomInput";
import { Business } from "@/types/business";
import LogoUploadPanel from "./LogoUploadPanel";
import LocationSelectorPanel from "./LocationSelectorPanel";
import StampUploadPanel from "./StampUploadPanel";

type BusinessClientProps = {
  initialBusiness: Business;
};

const BusinessClient = ({ initialBusiness }: BusinessClientProps) => {
  const [name, setName] = useState(initialBusiness.name ?? "");
  const [address, setAddress] = useState(initialBusiness.address ?? "");
  const [saving, setSaving] = useState(false);

  const hasChanges = useMemo(() => {
    return (
      name.trim() !== (initialBusiness.name ?? "").trim() ||
      address.trim() !== (initialBusiness.address ?? "").trim()
    );
  }, [address, initialBusiness.address, initialBusiness.name, name]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Business name is required.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateBusiness(initialBusiness.id, {
        name: name.trim(),
        address: address.trim() || undefined,
      });
      setName(updated.name ?? "");
      setAddress(updated.address ?? "");
      toast.success("Business updated.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to update business.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <LogoUploadPanel
              businessId={initialBusiness.id}
              businessName={initialBusiness.name ?? "Business"}
              hasLogo={initialBusiness.hasLogo}
            />
            <div>
            <p className="text-xs uppercase tracking-wide text-contrast/60">
              Business profile
            </p>
            <h2 className="text-xl font-semibold text-brand">
              {initialBusiness.name ?? "Business"}
            </h2>
            <p className="mt-2 text-sm text-contrast/80">
              Keep your name and address current so customers recognize you.
            </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={!hasChanges || saving}
            className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CustomInput
            id="businessName"
            placeholder="Business name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={saving}
          />
          <CustomInput
            id="businessAddress"
            placeholder="Address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            disabled={saving}
          />
          <div className="md:col-span-2">
            <LocationSelectorPanel />
          </div>
        </div>
      </section>
      <StampUploadPanel businessId={initialBusiness.id} />
    </form>
  );
};

export default BusinessClient;
