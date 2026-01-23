"use client";

import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import {
  deleteBusinessLogo,
  uploadBusinessLogo,
} from "@/api/client/business.api";
import ImageUploadTile from "./ImageUploadTile";

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
  const logoInputRef = useRef<HTMLInputElement | null>(null);
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
    <div className="flex items-center gap-3">
      {logoStatus === "available" && logoSrc ? (
        <div className="relative h-16 w-16 rounded-lg border border-accent-3 bg-transparent">
          <img
            src={logoSrc}
            alt={`${businessName} logo`}
            onLoad={() => setLogoStatus("available")}
            onError={() => setLogoStatus("missing")}
            className="h-full w-full object-contain"
          />
          <button
            type="button"
            onClick={handleLogoDelete}
            disabled={logoUploading}
            className="absolute -right-2 -top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-contrast shadow-sm ring-1 ring-accent-3 transition hover:-translate-y-0.5 hover:scale-110 hover:bg-brand focus-visible:-translate-y-0.5 focus-visible:scale-110 focus-visible:bg-brand focus-visible:outline-none disabled:opacity-60"
            aria-label="Delete logo"
          >
            {logoUploading ? "..." : <FiTrash2 size={12} aria-hidden="true" />}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1">
          <ImageUploadTile
            label="Upload logo"
            onClick={() => logoInputRef.current?.click()}
            disabled={logoUploading}
          />
          <span className="text-[10px] font-semibold text-contrast/60">
            Upload logo
          </span>
        </div>
      )}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        onChange={handleLogoChange}
        disabled={logoUploading}
        className="hidden"
      />
    </div>
  );
};

export default LogoUploadPanel;
