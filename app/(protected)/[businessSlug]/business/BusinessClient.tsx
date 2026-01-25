"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updateBusiness } from "@/api/client/business.api";
import { Business } from "@/types/business";
import Button from "@/components/Button";
import LogoUploadPanel from "./LogoUploadPanel";
import LocationSelectorPanel from "./LocationSelectorPanel";
import StampUploadPanel from "./StampUploadPanel";

type BusinessClientProps = {
  initialBusiness: Business;
};

const BusinessClient = ({ initialBusiness }: BusinessClientProps) => {
  const [name, setName] = useState(initialBusiness.name ?? "");
  const [location, setLocation] = useState({
    locationPlaceId: initialBusiness.locationPlaceId ?? null,
    locationAddress: initialBusiness.locationAddress ?? null,
    locationLat: initialBusiness.locationLat ?? null,
    locationLng: initialBusiness.locationLng ?? null,
  });
  const [saving, setSaving] = useState(false);

  const hasChanges = useMemo(() => {
    return (
      name.trim() !== (initialBusiness.name ?? "").trim() ||
      location.locationPlaceId !== (initialBusiness.locationPlaceId ?? null) ||
      location.locationAddress !== (initialBusiness.locationAddress ?? null) ||
      location.locationLat !== (initialBusiness.locationLat ?? null) ||
      location.locationLng !== (initialBusiness.locationLng ?? null)
    );
  }, [
    initialBusiness.locationAddress,
    initialBusiness.locationLat,
    initialBusiness.locationLng,
    initialBusiness.locationPlaceId,
    initialBusiness.name,
    location.locationAddress,
    location.locationLat,
    location.locationLng,
    location.locationPlaceId,
    name,
  ]);

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
        locationPlaceId: location.locationPlaceId,
        locationAddress: location.locationAddress,
        locationLat: location.locationLat,
        locationLng: location.locationLng,
      });
      setName(updated.name ?? "");
      setLocation({
        locationPlaceId: updated.locationPlaceId ?? null,
        locationAddress: updated.locationAddress ?? null,
        locationLat: updated.locationLat ?? null,
        locationLng: updated.locationLng ?? null,
      });
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
              businessName={name || "Business"}
              hasLogo={initialBusiness.hasLogo}
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-contrast/60">
                Business profile
              </p>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id="businessName"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Business name"
                  disabled={saving}
                  className="h-10 w-full rounded-lg border border-accent-3 bg-primary px-4 text-sm font-semibold text-brand outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <p className="mt-2 text-sm text-contrast/80">
                Keep your name current so customers recognize you.
              </p>
            </div>
          </div>
          <Button type="submit" disabled={!hasChanges || saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </section>
      <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
        <LocationSelectorPanel
          location={location}
          onChange={setLocation}
          disabled={saving}
        />
      </section>
      <StampUploadPanel businessId={initialBusiness.id} />
    </form>
  );
};

export default BusinessClient;
