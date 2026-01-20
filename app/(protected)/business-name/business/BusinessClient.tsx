"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  updateBusiness,
  uploadBusinessLogo,
  uploadBusinessStampOff,
  uploadBusinessStampOn,
} from "@/api/client/business.api";
import CustomInput from "@/components/CustomInput";
import { Business } from "@/types/business";
import CustomerInviteCard from "./CustomerInviteCard";

type BusinessClientProps = {
  initialBusiness: Business;
};

const BusinessClient = ({ initialBusiness }: BusinessClientProps) => {
  const [name, setName] = useState(initialBusiness.name ?? "");
  const [address, setAddress] = useState(initialBusiness.address ?? "");
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoVersion, setLogoVersion] = useState(0);
  const [logoStatus, setLogoStatus] = useState<"unknown" | "available" | "missing">(
    "unknown"
  );
  const [stampOnUploading, setStampOnUploading] = useState(false);
  const [stampOffUploading, setStampOffUploading] = useState(false);
  const [stampOnVersion, setStampOnVersion] = useState(0);
  const [stampOffVersion, setStampOffVersion] = useState(0);
  const [stampOnStatus, setStampOnStatus] = useState<
    "unknown" | "available" | "missing"
  >("unknown");
  const [stampOffStatus, setStampOffStatus] = useState<
    "unknown" | "available" | "missing"
  >("unknown");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const logoSrc =
    apiBaseUrl && initialBusiness.id
      ? `${apiBaseUrl}/business/id/${initialBusiness.id}/logo?v=${logoVersion}`
      : "";
  const stampOnSrc =
    apiBaseUrl && initialBusiness.id
      ? `${apiBaseUrl}/business/id/${initialBusiness.id}/stamp-on?v=${stampOnVersion}`
      : "";
  const stampOffSrc =
    apiBaseUrl && initialBusiness.id
      ? `${apiBaseUrl}/business/id/${initialBusiness.id}/stamp-off?v=${stampOffVersion}`
      : "";

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

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    setLogoUploading(true);
    try {
      await uploadBusinessLogo(initialBusiness.id, file);
      setLogoVersion((prev) => prev + 1);
      setLogoStatus("available");
      toast.success("Logo updated.");
    } catch (error) {
      console.error(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (error instanceof Error ? error.message : "Unable to upload logo.");
      toast.error(message);
    } finally {
      setLogoUploading(false);
      event.target.value = "";
    }
  };

  const handleStampUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    kind: "on" | "off"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (kind === "on") {
      setStampOnUploading(true);
    } else {
      setStampOffUploading(true);
    }

    try {
      if (kind === "on") {
        await uploadBusinessStampOn(initialBusiness.id, file);
        setStampOnVersion((prev) => prev + 1);
        setStampOnStatus("available");
      } else {
        await uploadBusinessStampOff(initialBusiness.id, file);
        setStampOffVersion((prev) => prev + 1);
        setStampOffStatus("available");
      }
      toast.success("Stamp image updated.");
    } catch (error) {
      console.error(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (error instanceof Error ? error.message : "Unable to upload stamp.");
      toast.error(message);
    } finally {
      if (kind === "on") {
        setStampOnUploading(false);
      } else {
        setStampOffUploading(false);
      }
      event.target.value = "";
    }
  };

  return (
    <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
      <CustomerInviteCard businessId={initialBusiness.id} />
      <div className="rounded-lg border border-accent-3 bg-primary p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-contrast">Business logo</h3>
            <p className="text-xs text-contrast/70">
              PNG, JPG, WEBP, or SVG up to 3MB.
            </p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-primary">
            {logoUploading ? "Uploading..." : "Upload logo"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoChange}
              disabled={logoUploading}
              className="hidden"
            />
          </label>
        </div>
        <div className="mt-4 flex items-center gap-4">
          {logoStatus !== "missing" && logoSrc ? (
            <img
              src={logoSrc}
              alt={`${initialBusiness.name} logo`}
              onLoad={() => setLogoStatus("available")}
              onError={() => setLogoStatus("missing")}
              className="h-16 w-16 object-contain bg-transparent"
              crossOrigin="use-credentials"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-accent-3 bg-contrast/5 text-[10px] text-contrast/60">
              No logo
            </div>
          )}
          <span className="text-xs text-contrast/70">
            Upload a square image for best results.
          </span>
        </div>
      </div>
      <div className="rounded-lg border border-accent-3 bg-primary p-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-contrast">Stamp images</h3>
          <p className="text-xs text-contrast/70">
            Upload on/off stamp images. PNG, JPG, WEBP, or SVG up to 3MB.
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-accent-3 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-contrast">
                Stamp on
              </span>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-brand px-3 py-2 text-[11px] font-semibold text-primary">
                {stampOnUploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(event) => handleStampUpload(event, "on")}
                  disabled={stampOnUploading}
                  className="hidden"
                />
              </label>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {stampOnStatus !== "missing" && stampOnSrc ? (
                <img
                  src={stampOnSrc}
                  alt="Stamp on"
                  onLoad={() => setStampOnStatus("available")}
                  onError={() => setStampOnStatus("missing")}
                  className="h-16 w-16 rounded-lg border border-accent-3 object-contain bg-white"
                  crossOrigin="use-credentials"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-accent-3 bg-contrast/5 text-[10px] text-contrast/60">
                  No stamp
                </div>
              )}
              <span className="text-xs text-contrast/70">
                Used for filled stamps.
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-accent-3 p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-contrast">
                Stamp off
              </span>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-brand px-3 py-2 text-[11px] font-semibold text-primary">
                {stampOffUploading ? "Uploading..." : "Upload"}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(event) => handleStampUpload(event, "off")}
                  disabled={stampOffUploading}
                  className="hidden"
                />
              </label>
            </div>
            <div className="mt-3 flex items-center gap-3">
              {stampOffStatus !== "missing" && stampOffSrc ? (
                <img
                  src={stampOffSrc}
                  alt="Stamp off"
                  onLoad={() => setStampOffStatus("available")}
                  onError={() => setStampOffStatus("missing")}
                  className="h-16 w-16 rounded-lg border border-accent-3 object-contain bg-white"
                  crossOrigin="use-credentials"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-accent-3 bg-contrast/5 text-[10px] text-contrast/60">
                  No stamp
                </div>
              )}
              <span className="text-xs text-contrast/70">
                Used for empty stamps.
              </span>
            </div>
          </div>
        </div>
      </div>
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
