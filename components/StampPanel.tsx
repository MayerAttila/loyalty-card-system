"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import ImageTile from "@/components/ImageTile";
import ImageUploadTile from "@/components/ImageUploadTile";
import {
  deleteBusinessStampImage,
  getBusinessStamps,
  uploadBusinessStampOff,
  uploadBusinessStampOn,
} from "@/api/client/business.api";
import { BusinessStampImage } from "@/types/stampImage";

type StampPanelProps = {
  businessId: string;
  selectable?: boolean;
  selectedStampOnId?: string | null;
  selectedStampOffId?: string | null;
  onSelect?: (kind: "on" | "off", image: BusinessStampImage) => void;
  onStampsLoaded?: (
    stampOn: BusinessStampImage[],
    stampOff: BusinessStampImage[]
  ) => void;
  showToggle?: boolean;
  useStampImages?: boolean;
  onToggleUseStampImages?: (next: boolean) => void;
};

const StampPanel = ({
  businessId,
  selectable = false,
  selectedStampOnId,
  selectedStampOffId,
  onSelect,
  onStampsLoaded,
  showToggle = false,
  useStampImages = true,
  onToggleUseStampImages,
}: StampPanelProps) => {
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
      onStampsLoaded?.(data.stampOn, data.stampOff);
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
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-contrast">Stamp images</h3>
        {showToggle ? (
          <button
            type="button"
            role="switch"
            aria-checked={useStampImages}
            onClick={() => {
              if (!onToggleUseStampImages) return;
              onToggleUseStampImages(!useStampImages);
            }}
            disabled={!onToggleUseStampImages}
            className="inline-flex items-center gap-2 text-xs font-semibold text-contrast/80 disabled:opacity-60"
          >
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full border border-accent-3 transition-colors duration-200 ${
                useStampImages ? "bg-brand/80" : "bg-accent-2"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 translate-x-0 rounded-full bg-primary shadow-sm transition-transform duration-200 ${
                  useStampImages ? "translate-x-4" : "translate-x-1"
                }`}
              />
            </span>
            <span>{useStampImages ? "On" : "Off"}</span>
          </button>
        ) : null}
      </div>
      {!showToggle || useStampImages ? (
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
                    <ImageTile
                      key={image.id}
                      image={image}
                      onDelete={handleDeleteStamp}
                      deleting={deletingStampIds.includes(image.id)}
                      selectable={selectable}
                      selected={selectable && image.id === selectedStampOnId}
                      onSelect={() => onSelect?.("on", image)}
                    />
                  ))}
                  <ImageUploadTile
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
                    <ImageTile
                      key={image.id}
                      image={image}
                      onDelete={handleDeleteStamp}
                      deleting={deletingStampIds.includes(image.id)}
                      selectable={selectable}
                      selected={selectable && image.id === selectedStampOffId}
                      onSelect={() => onSelect?.("off", image)}
                    />
                  ))}
                  <ImageUploadTile
                    label="Upload stamp off"
                    onClick={() => stampOffInputRef.current?.click()}
                    disabled={stampOffUploading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StampPanel;
