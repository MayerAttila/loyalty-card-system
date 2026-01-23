"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updateBusiness } from "@/api/client/business.api";
import CustomInput from "@/components/CustomInput";
import { Business } from "@/types/business";
import LogoUploadPanel from "./LogoUploadPanel";
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
      <LogoUploadPanel
        businessId={initialBusiness.id}
        businessName={initialBusiness.name ?? "Business"}
        hasLogo={initialBusiness.hasLogo}
      />
      <StampUploadPanel businessId={initialBusiness.id} />
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
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!hasChanges || saving}
          className="rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-primary disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
};

export default BusinessClient;
