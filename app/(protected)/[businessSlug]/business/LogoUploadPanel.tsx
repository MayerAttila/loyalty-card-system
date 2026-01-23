"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  deleteBusinessLogo,
  uploadBusinessLogo,
} from "@/api/client/business.api";

type LogoUploadPanelProps = {
  businessId: string;
  businessName: string;
  hasLogo?: boolean;
};

const LogoUploadPanel = ({
  businessId,
  businessName,
  hasLogo,
}: LogoUploadPanelProps) => {
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoVersion, setLogoVersion] = useState(0);
  const [logoStatus, setLogoStatus] = useState<"unknown" | "available" | "missing">(
    hasLogo ? "available" : "missing"
  );
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const logoSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/logo?v=${logoVersion}`
      : "";

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
      await uploadBusinessLogo(businessId, file);
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

  const handleLogoDelete = async () => {
    try {
      await deleteBusinessLogo(businessId);
      setLogoVersion((prev) => prev + 1);
      setLogoStatus("missing");
      toast.success("Logo deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete logo.");
    }
  };

  return (
    <div className="rounded-lg border border-accent-3 bg-primary p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-contrast">Business logo</h3>
          <p className="text-xs text-contrast/70">
            PNG, JPG, WEBP, or SVG up to 3MB.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
          <button
            type="button"
            onClick={handleLogoDelete}
            disabled={logoStatus !== "available" || logoUploading}
            className="inline-flex items-center justify-center rounded-lg border border-accent-3 px-4 py-2 text-xs font-semibold text-contrast/80 disabled:opacity-60"
          >
            Delete logo
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4">
        {logoStatus === "available" && logoSrc ? (
          <img
            src={logoSrc}
            alt={`${businessName} logo`}
            onLoad={() => setLogoStatus("available")}
            onError={() => setLogoStatus("missing")}
            className="h-16 w-16 object-contain bg-transparent"
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
  );
};

export default LogoUploadPanel;
