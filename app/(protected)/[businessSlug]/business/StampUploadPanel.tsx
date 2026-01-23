"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import StampImageTile from "./StampImageTile";
import StampUploadTile from "./StampUploadTile";
import {
  deleteBusinessStampImage,
  getBusinessStamps,
  uploadBusinessStampOff,
  uploadBusinessStampOn,
} from "@/api/client/business.api";
import { BusinessStampImage } from "@/types/stampImage";

type StampUploadPanelProps = {
  businessId: string;
};

const StampUploadPanel = ({ businessId }: StampUploadPanelProps) => {
  const [stampOnUploading, setStampOnUploading] = useState(false);
  const [stampOffUploading, setStampOffUploading] = useState(false);
  const [stampOnImages, setStampOnImages] = useState<BusinessStampImage[]>([]);
  const [stampOffImages, setStampOffImages] = useState<BusinessStampImage[]>(
    [],
  );
  const [stampsLoading, setStampsLoading] = useState(true);
  const [deletingStampIds, setDeletingStampIds] = useState<string[]>([]);
  const stampOnInputRef = useRef<HTMLInputElement | null>(null);
  const stampOffInputRef = useRef<HTMLInputElement | null>(null);

  const loadStamps = useCallback(async () => {
    try {
      setStampsLoading(true);
      const data = await getBusinessStamps(businessId);
      setStampOnImages(data.stampOn);
      setStampOffImages(data.stampOff);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load stamp images.");
    } finally {
      setStampsLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    loadStamps();
  }, [loadStamps]);

  const handleStampUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    kind: "on" | "off",
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const hasInvalid = files.some((file) => !file.type.startsWith("image/"));
    if (hasInvalid) {
      toast.error("Please select image files only.");
      event.target.value = "";
      return;
    }

    if (kind === "on") {
      setStampOnUploading(true);
    } else {
      setStampOffUploading(true);
    }

    const toastId = toast.loading("Uploading stamp images...");
    try {
      let uploadedCount = 0;
      for (const file of files) {
        if (kind === "on") {
          await uploadBusinessStampOn(businessId, file);
        } else {
          await uploadBusinessStampOff(businessId, file);
        }
        uploadedCount += 1;
      }
      await loadStamps();
      toast.update(toastId, {
        render:
          uploadedCount === 1
            ? "Stamp image uploaded."
            : `${uploadedCount} stamp images uploaded.`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.error(error);
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ??
        (error instanceof Error ? error.message : "Unable to upload stamp.");
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      if (kind === "on") {
        setStampOnUploading(false);
      } else {
        setStampOffUploading(false);
      }
      event.target.value = "";
    }
  };

  const handleDeleteStamp = async (imageId: string) => {
    setDeletingStampIds((prev) => [...prev, imageId]);
    try {
      await deleteBusinessStampImage(businessId, imageId);
      await loadStamps();
      toast.success("Stamp image deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete stamp image.");
    } finally {
      setDeletingStampIds((prev) => prev.filter((id) => id !== imageId));
    }
  };

  return (
    <div className="rounded-lg border border-accent-3 bg-primary p-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-contrast">Stamp images</h3>
        <p className="text-xs text-contrast/70">
          Upload stamp images. PNG, JPG, WEBP, or SVG up to 3MB.
        </p>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-accent-3 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-contrast">
              Stamp on
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              multiple
              onChange={(event) => handleStampUpload(event, "on")}
              disabled={stampOnUploading}
              className="hidden"
              ref={stampOnInputRef}
            />
          </div>
          <div className="mt-3 space-y-3">
            {stampsLoading ? (
              <div className="text-xs text-contrast/60">Loading...</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {stampOnImages.map((image) => (
                  <StampImageTile
                    key={image.id}
                    image={image}
                    onDelete={handleDeleteStamp}
                    deleting={deletingStampIds.includes(image.id)}
                  />
                ))}
                <StampUploadTile
                  label="Upload stamp on"
                  onClick={() => stampOnInputRef.current?.click()}
                  disabled={stampOnUploading}
                />
              </div>
            )}
          </div>
        </div>
        <div className="rounded-lg border border-accent-3 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-contrast">
              Stamp off
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              multiple
              onChange={(event) => handleStampUpload(event, "off")}
              disabled={stampOffUploading}
              className="hidden"
              ref={stampOffInputRef}
            />
          </div>
          <div className="mt-3 space-y-3">
            {stampsLoading ? (
              <div className="text-xs text-contrast/60">Loading...</div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {stampOffImages.map((image) => (
                  <StampImageTile
                    key={image.id}
                    image={image}
                    onDelete={handleDeleteStamp}
                    deleting={deletingStampIds.includes(image.id)}
                  />
                ))}
                <StampUploadTile
                  label="Upload stamp off"
                  onClick={() => stampOffInputRef.current?.click()}
                  disabled={stampOffUploading}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StampUploadPanel;
