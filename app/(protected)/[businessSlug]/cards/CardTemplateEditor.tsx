"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  createCardTemplate,
  updateCardTemplate,
} from "@/api/client/cardTemplate.api";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import { useSession } from "@/lib/auth/useSession";
import LoyaltyCard from "./LoyaltyCard";
import LogoUploadPanel from "@/components/LogoUploadPanel";
import StampPanel from "@/components/StampPanel";
import { CardTemplate } from "@/types/cardTemplate";

type CardTemplateEditorProps = {
  initialBusinessName?: string;
  initialMaxPoints?: number;
  initialFilledPoints?: number;
  initialCardColor?: string;
  initialAccentColor?: string;
  initialTextColor?: string;
  businessId?: string;
  selectedTemplate?: CardTemplate;
  onTemplateSaved?: (template: CardTemplate) => void;
  onCancel?: () => void;
};

const CardTemplateEditor = ({
  initialBusinessName = "Coffee Club",
  initialMaxPoints = 10,
  initialFilledPoints = 3,
  initialCardColor = "#121826",
  initialAccentColor = "#f59e0b",
  initialTextColor = "#f8fafc",
  businessId: businessIdProp,
  selectedTemplate,
  onTemplateSaved,
  onCancel,
}: CardTemplateEditorProps) => {
  const { session } = useSession();
  const businessId = businessIdProp ?? session?.user?.businessId;
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [maxPoints, setMaxPoints] = useState(initialMaxPoints);
  const [filledPoints, setFilledPoints] = useState(initialFilledPoints);
  const rewardsCollected = 1;
  const [cardColor, setCardColor] = useState(initialCardColor);
  const [accentColor, setAccentColor] = useState(initialAccentColor);
  const [textColor, setTextColor] = useState(initialTextColor);
  const [templateTitle, setTemplateTitle] = useState(
    selectedTemplate?.title ?? `${initialBusinessName} Card`,
  );
  const [saving, setSaving] = useState(false);
  const [useBusinessStamps, setUseBusinessStamps] = useState(true);
  const [logoAvailable, setLogoAvailable] = useState(false);
  const [logoVersion, setLogoVersion] = useState(0);
  const [stampOnAvailable, setStampOnAvailable] = useState(false);
  const [stampOffAvailable, setStampOffAvailable] = useState(false);
  const [stampOnImages, setStampOnImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [stampOffImages, setStampOffImages] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedStampOnId, setSelectedStampOnId] = useState<string | null>(
    selectedTemplate?.stampOnImageId ?? null,
  );
  const [selectedStampOffId, setSelectedStampOffId] = useState<string | null>(
    selectedTemplate?.stampOffImageId ?? null,
  );

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const logoSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/logo?v=${logoVersion}`
      : "";
  const stampOnSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/stamp-on`
      : "";
  const stampOffSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/stamp-off`
      : "";
  const selectedStampOnUrl =
    stampOnImages.find((image) => image.id === selectedStampOnId)?.url ?? "";
  const selectedStampOffUrl =
    stampOffImages.find((image) => image.id === selectedStampOffId)?.url ?? "";

  React.useEffect(() => {
    if (!selectedTemplate) return;
    setTemplateTitle(selectedTemplate.title);
    setMaxPoints(selectedTemplate.maxPoints);
    setFilledPoints(Math.min(3, selectedTemplate.maxPoints));
    setCardColor(selectedTemplate.cardColor);
    setAccentColor(selectedTemplate.accentColor);
    setTextColor(selectedTemplate.textColor);
    setUseBusinessStamps(selectedTemplate.useStampImages ?? true);
    setSelectedStampOnId(selectedTemplate.stampOnImageId ?? null);
    setSelectedStampOffId(selectedTemplate.stampOffImageId ?? null);
  }, [selectedTemplate]);

  React.useEffect(() => {
    let isActive = true;

    const checkImage = (
      url: string,
      setAvailable: (value: boolean) => void,
    ) => {
      if (!url) {
        setAvailable(false);
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (isActive) setAvailable(true);
      };
      img.onerror = () => {
        if (isActive) setAvailable(false);
      };
      img.src = url;
    };

    checkImage(logoSrc, setLogoAvailable);
    checkImage(stampOnSrc, setStampOnAvailable);
    checkImage(stampOffSrc, setStampOffAvailable);

    return () => {
      isActive = false;
    };
  }, [logoSrc, stampOffSrc, stampOnSrc]);

  React.useEffect(() => {
    if (!stampOnAvailable || !stampOffAvailable) {
      setUseBusinessStamps(false);
    }
  }, [stampOffAvailable, stampOnAvailable]);

  const sanitized = useMemo(() => {
    const safeMax = Math.max(4, Math.min(16, maxPoints || 4));
    const safeFilled = Math.min(Math.max(0, filledPoints || 0), safeMax);
    const safeRewards = Math.max(0, rewardsCollected || 0);

    return {
      businessName: businessName.trim() || "Business Name",
      ownerName: "Card holder",
      maxPoints: safeMax,
      filledPoints: safeFilled,
      rewardsCollected: safeRewards,
      cardColor,
      accentColor,
      textColor,
    };
  }, [
    accentColor,
    businessName,
    cardColor,
    filledPoints,
    maxPoints,
    rewardsCollected,
    textColor,
  ]);

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="rounded-xl border border-accent-3 bg-primary/40 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-contrast/70">
          Card Details
        </h3>
        <div className="mt-4 space-y-4">
          <div className="grid items-start gap-4 grid-cols-1 sm:grid-cols-11">
            <div className="sm:col-span-1">
              {businessId ? (
                <LogoUploadPanel
                  businessId={businessId}
                  businessName={businessName || "Business"}
                  hasLogo={logoAvailable}
                  onLogoChange={() => setLogoVersion((prev) => prev + 1)}
                />
              ) : (
                <div />
              )}
            </div>

            <div className="sm:col-span-5">
              <CustomInput
                id="cardTemplateTitle"
                label="Template name"
                placeholder="Template name"
                value={templateTitle}
                onChange={(event) => setTemplateTitle(event.target.value)}
              />
            </div>

            <div className="sm:col-span-5">
              <CustomInput
                id="cardBusinessName"
                label="Business name"
                placeholder="Business name"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
              />
            </div>
          </div>

          {businessId ? (
            <StampPanel
              businessId={businessId}
              selectable
              selectedStampOnId={selectedStampOnId}
              selectedStampOffId={selectedStampOffId}
              onSelect={(kind, image) => {
                if (kind === "on") {
                  setSelectedStampOnId((prev) =>
                    prev === image.id ? null : image.id,
                  );
                } else {
                  setSelectedStampOffId((prev) =>
                    prev === image.id ? null : image.id,
                  );
                }
              }}
              onStampsLoaded={(stampOn, stampOff) => {
                setStampOnImages(stampOn);
                setStampOffImages(stampOff);
              }}
              showToggle
              useStampImages={useBusinessStamps}
              onToggleUseStampImages={setUseBusinessStamps}
            />
          ) : (
            <p className="mt-3 text-xs text-contrast/60">
              Select a business to manage stamps.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-contrast/70">
              Max stamps
              <input
                type="number"
                min={4}
                max={16}
                value={maxPoints}
                onChange={(event) => setMaxPoints(Number(event.target.value))}
                className="mt-2 w-full rounded-lg border border-accent-3 bg-primary px-4 py-3 text-sm text-contrast outline-none"
              />
            </label>
            <label className="block text-xs text-contrast/70">
              Stamps filled
              <input
                type="number"
                min={0}
                max={maxPoints}
                value={filledPoints}
                onChange={(event) =>
                  setFilledPoints(Number(event.target.value))
                }
                className="mt-2 w-full rounded-lg border border-accent-3 bg-primary px-4 py-3 text-sm text-contrast outline-none"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-xs text-contrast/70">
              Card color
              <input
                type="color"
                value={cardColor}
                onChange={(event) => setCardColor(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer rounded-lg border border-accent-3 bg-primary p-1"
              />
            </label>
            <label className="block text-xs text-contrast/70">
              Accent color
              <input
                type="color"
                value={accentColor}
                onChange={(event) => setAccentColor(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer rounded-lg border border-accent-3 bg-primary p-1"
              />
            </label>
            <label className="block text-xs text-contrast/70">
              Text color
              <input
                type="color"
                value={textColor}
                onChange={(event) => setTextColor(event.target.value)}
                className="mt-2 h-12 w-full cursor-pointer rounded-lg border border-accent-3 bg-primary p-1"
              />
            </label>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {onCancel ? (
            <Button variant="neutral" onClick={onCancel}>
              Cancel
            </Button>
          ) : null}
          <Button
            type="button"
            disabled={saving || !templateTitle.trim() || !businessId}
            onClick={async () => {
              if (!businessId) {
                toast.error("No business selected.");
                return;
              }
              if (!templateTitle.trim()) {
                toast.error("Template name is required.");
                return;
              }
              setSaving(true);
              try {
                const payload = {
                  title: templateTitle.trim(),
                  maxPoints: sanitized.maxPoints,
                  cardColor: sanitized.cardColor,
                  accentColor: sanitized.accentColor,
                  textColor: sanitized.textColor,
                  useStampImages: useBusinessStamps,
                  stampOnImageId: selectedStampOnId,
                  stampOffImageId: selectedStampOffId,
                };

                const saved = selectedTemplate?.id
                  ? await updateCardTemplate(selectedTemplate.id, payload)
                  : await createCardTemplate({
                      ...payload,
                      businessId,
                    });

                window.dispatchEvent(new CustomEvent("card-template-saved"));
                onTemplateSaved?.(saved);
                toast.success(
                  selectedTemplate?.id
                    ? "Card template updated."
                    : "Card template saved.",
                );
              } catch (error) {
                console.error(error);
                toast.error("Unable to save card template.");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving
              ? "Saving..."
              : selectedTemplate?.id
                ? "Update template"
                : "Save template"}
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center rounded-xl border border-accent-3 bg-primary/30 p-5">
        <LoyaltyCard
          businessName={sanitized.businessName}
          ownerName={sanitized.ownerName}
          maxPoints={sanitized.maxPoints}
          filledPoints={sanitized.filledPoints}
          rewardsCollected={sanitized.rewardsCollected}
          cardColor={sanitized.cardColor}
          accentColor={sanitized.accentColor}
          textColor={sanitized.textColor}
          logoSrc={logoAvailable ? logoSrc : undefined}
          useLogo={logoAvailable}
          filledStampSrc={
            useBusinessStamps && stampOnAvailable && stampOffAvailable
              ? selectedStampOnUrl
              : undefined
          }
          emptyStampSrc={
            useBusinessStamps && stampOnAvailable && stampOffAvailable
              ? selectedStampOffUrl
              : undefined
          }
          useStampImages={useBusinessStamps}
        />
      </div>
    </div>
  );
};

export default CardTemplateEditor;
