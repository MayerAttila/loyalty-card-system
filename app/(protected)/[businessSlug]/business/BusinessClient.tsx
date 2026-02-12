"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { updateBusiness } from "@/api/client/business.api";
import { Business } from "@/types/business";
import Button from "@/components/Button";
import CustomInput from "@/components/CustomInput";
import HelpCard from "@/components/HelpCard";
import LogoUploadPanel from "@/components/LogoUploadPanel";
import LocationSelectorPanel from "./LocationSelectorPanel";
import StampPanel from "@/components/StampPanel";

type BusinessClientProps = {
  initialBusiness: Business;
};

const BusinessClient = ({ initialBusiness }: BusinessClientProps) => {
  const [name, setName] = useState(initialBusiness.name ?? "");
  const [website, setWebsite] = useState(initialBusiness.website ?? "");
  const [location, setLocation] = useState({
    locationPlaceId: initialBusiness.locationPlaceId ?? null,
    locationAddress: initialBusiness.locationAddress ?? null,
    locationLat: initialBusiness.locationLat ?? null,
    locationLng: initialBusiness.locationLng ?? null,
  });
  const [saving, setSaving] = useState(false);
  const needsLogo = !initialBusiness.hasLogo;
  const needsLocation =
    initialBusiness.locationLat === null || initialBusiness.locationLng === null;

  const hasChanges = useMemo(() => {
    return (
      name.trim() !== (initialBusiness.name ?? "").trim() ||
      website.trim() !== (initialBusiness.website ?? "").trim() ||
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
    initialBusiness.website,
    location.locationAddress,
    location.locationLat,
    location.locationLng,
    location.locationPlaceId,
    name,
    website,
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
        website: website.trim() || null,
        locationPlaceId: location.locationPlaceId,
        locationAddress: location.locationAddress,
        locationLat: location.locationLat,
        locationLng: location.locationLng,
      });
      setName(updated.name ?? "");
      setWebsite(updated.website ?? "");
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
      {needsLogo || needsLocation ? (
        <HelpCard
          title="Quick setup tips"
          description="Finish these items so your loyalty cards are fully branded and ready for Wallet usage."
        >
          <ul className="list-disc space-y-1 pl-5 text-sm text-contrast/80">
            {needsLogo ? <li>Upload a logo to brand your customer cards.</li> : null}
            {needsLocation ? (
              <li>
                Add your business location so Wallet cards can show directions.
              </li>
            ) : null}
          </ul>
        </HelpCard>
      ) : null}
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
                <CustomInput
                  id="businessName"
                  type="business"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Business name"
                  disabled={saving}
                  className="w-full"
                />
                <CustomInput
                  id="businessWebsite"
                  type="website"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="https://yourbusiness.com"
                  disabled={saving}
                  className="w-full"
                />
              </div>
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
      <StampPanel businessId={initialBusiness.id} />
    </form>
  );
};

export default BusinessClient;
