"use client";

import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createCardTemplate, updateCardTemplate } from "@/api/client/cardTemplate.api";
import CustomInput from "@/components/CustomInput";
import Button from "@/components/Button";
import { useSession } from "@/lib/auth/useSession";
import LoyaltyCard from "./LoyaltyCard";
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
    selectedTemplate?.title ?? `${initialBusinessName} Card`
  );
  const [saving, setSaving] = useState(false);
  const [useBusinessLogo, setUseBusinessLogo] = useState(true);
  const [useBusinessStamps, setUseBusinessStamps] = useState(true);
  const [filledStampKind, setFilledStampKind] = useState<"on" | "off">("on");
  const [emptyStampKind, setEmptyStampKind] = useState<"on" | "off">("off");
  const [logoAvailable, setLogoAvailable] = useState(false);
  const [stampOnAvailable, setStampOnAvailable] = useState(false);
  const [stampOffAvailable, setStampOffAvailable] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const logoSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/logo`
      : "";
  const stampOnSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/stamp-on`
      : "";
  const stampOffSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/stamp-off`
      : "";
  const filledStampSrc = filledStampKind === "on" ? stampOnSrc : stampOffSrc;
  const emptyStampSrc = emptyStampKind === "on" ? stampOnSrc : stampOffSrc;

  React.useEffect(() => {
    if (!selectedTemplate) return;
    setTemplateTitle(selectedTemplate.title);
    setMaxPoints(selectedTemplate.maxPoints);
    setFilledPoints(Math.min(3, selectedTemplate.maxPoints));
    setCardColor(selectedTemplate.cardColor);
    setAccentColor(selectedTemplate.accentColor);
    setTextColor(selectedTemplate.textColor);
  }, [selectedTemplate]);

  React.useEffect(() => {
    let isActive = true;

    const checkImage = (url: string, setAvailable: (value: boolean) => void) => {
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
    if (!logoAvailable) {
      setUseBusinessLogo(false);
    }
    if (!stampOnAvailable || !stampOffAvailable) {
      setUseBusinessStamps(false);
    }
  }, [logoAvailable, stampOffAvailable, stampOnAvailable]);

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
          <CustomInput
            id="cardTemplateTitle"
            placeholder="Template name"
            value={templateTitle}
            onChange={(event) => setTemplateTitle(event.target.value)}
          />
          <CustomInput
            id="cardBusinessName"
            placeholder="Business name"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
          />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-accent-3 bg-primary p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-contrast/70">
                Logo
              </h4>
              <div className="mt-3 rounded-lg border border-accent-3 bg-primary/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-contrast">
                      Business logo
                    </p>
                    <p className="text-[11px] text-contrast/70">
                      {logoAvailable ? "Uploaded" : "No logo uploaded"}
                    </p>
                  </div>
                  <div className="flex rounded-lg border border-accent-3 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setUseBusinessLogo(true)}
                      disabled={!logoAvailable}
                      className={`px-3 py-1 ${
                        useBusinessLogo && logoAvailable
                          ? "bg-brand text-primary"
                          : "text-contrast/70"
                      }`}
                    >
                      Use
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseBusinessLogo(false)}
                      className={`px-3 py-1 ${
                        !useBusinessLogo
                          ? "bg-brand text-primary"
                          : "text-contrast/70"
                      }`}
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex h-16 items-center justify-center">
                  {logoAvailable && logoSrc ? (
                    <img
                      src={logoSrc}
                      alt="Selected logo"
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    <span className="text-[11px] text-contrast/50">No logo</span>
                  )}
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-accent-3 bg-primary p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-contrast/70">
                Stamps
              </h4>
              <div className="mt-3 rounded-lg border border-accent-3 bg-primary/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-contrast">
                      Stamp images
                    </p>
                    <p className="text-[11px] text-contrast/70">
                      {stampOnAvailable && stampOffAvailable
                        ? "Stamp on/off set"
                        : "Upload stamp on/off"}
                    </p>
                  </div>
                  <div className="flex rounded-lg border border-accent-3 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setUseBusinessStamps(true)}
                      disabled={!stampOnAvailable || !stampOffAvailable}
                      className={`px-3 py-1 ${
                        useBusinessStamps && stampOnAvailable && stampOffAvailable
                          ? "bg-brand text-primary"
                          : "text-contrast/70"
                      }`}
                    >
                      Use
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseBusinessStamps(false)}
                      className={`px-3 py-1 ${
                        !useBusinessStamps
                          ? "bg-brand text-primary"
                          : "text-contrast/70"
                      }`}
                    >
                      None
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-accent-3">
                    {stampOnAvailable && stampOnSrc ? (
                      <img
                        src={stampOnSrc}
                        alt="Stamp on"
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span className="text-[11px] text-contrast/50">On</span>
                    )}
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-accent-3">
                    {stampOffAvailable && stampOffSrc ? (
                      <img
                        src={stampOffSrc}
                        alt="Stamp off"
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <span className="text-[11px] text-contrast/50">Off</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-[11px] text-contrast/70">
                    Filled stamp
                    <select
                      className="mt-2 w-full rounded-lg border border-accent-3 bg-primary px-3 py-2 text-xs text-contrast outline-none"
                      value={filledStampKind}
                      onChange={(event) =>
                        setFilledStampKind(
                          event.target.value === "off" ? "off" : "on"
                        )
                      }
                      disabled={!useBusinessStamps || !stampOnAvailable || !stampOffAvailable}
                    >
                      <option value="on">Stamp on</option>
                      <option value="off">Stamp off</option>
                    </select>
                  </label>
                  <label className="block text-[11px] text-contrast/70">
                    Empty stamp
                    <select
                      className="mt-2 w-full rounded-lg border border-accent-3 bg-primary px-3 py-2 text-xs text-contrast outline-none"
                      value={emptyStampKind}
                      onChange={(event) =>
                        setEmptyStampKind(
                          event.target.value === "off" ? "off" : "on"
                        )
                      }
                      disabled={!useBusinessStamps || !stampOnAvailable || !stampOffAvailable}
                    >
                      <option value="off">Stamp off</option>
                      <option value="on">Stamp on</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs text-contrast/70">
              Max stamps
              <input
                type="number"
                min={4}
                max={16}
                value={maxPoints}
                onChange={(event) =>
                  setMaxPoints(Number(event.target.value))
                }
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
                    : "Card template saved."
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
          logoSrc={useBusinessLogo && logoAvailable ? logoSrc : undefined}
          useLogo={useBusinessLogo}
          filledStampSrc={
            useBusinessStamps && stampOnAvailable && stampOffAvailable
              ? filledStampSrc
              : undefined
          }
          emptyStampSrc={
            useBusinessStamps && stampOnAvailable && stampOffAvailable
              ? emptyStampSrc
              : undefined
          }
          useStampImages={useBusinessStamps}
        />
      </div>
    </div>
  );
};

export default CardTemplateEditor;
