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
import WalletCardPreview from "./WalletCardPreview";
import LogoUploadPanel from "@/components/LogoUploadPanel";
import StampPanel from "@/components/StampPanel";
import { CardTemplate } from "@/types/cardTemplate";

type CardTemplateEditorProps = {
  initialBusinessName?: string;
  initialMaxPoints?: number;
  initialFilledPoints?: number;
  initialCardColor?: string;
  initialHasLogo?: boolean;
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
  initialHasLogo = false,
  businessId: businessIdProp,
  selectedTemplate,
  onTemplateSaved,
  onCancel,
}: CardTemplateEditorProps) => {
  const { session } = useSession();
  const businessId = businessIdProp ?? session?.user?.businessId;
  const [businessName] = useState(initialBusinessName);
  const [text1, setText1] = useState(
    selectedTemplate?.text1 ?? initialBusinessName
  );
  const [text2, setText2] = useState(selectedTemplate?.text2 ?? "Stamps");
  const [maxPoints, setMaxPoints] = useState(initialMaxPoints);
  const [filledPoints, setFilledPoints] = useState(initialFilledPoints);
  const rewardsCollected = 1;
  const [cardColor, setCardColor] = useState(initialCardColor);
  const [templateName, setTemplateName] = useState(
    selectedTemplate?.template ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [useBusinessStamps, setUseBusinessStamps] = useState(true);
  const [logoAvailable, setLogoAvailable] = useState(initialHasLogo);
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
    setTemplateName(selectedTemplate.template);
    setText1(selectedTemplate.text1 ?? "");
    setText2(selectedTemplate.text2 ?? "");
    setMaxPoints(selectedTemplate.maxPoints);
    setFilledPoints(Math.min(3, selectedTemplate.maxPoints));
    setCardColor(selectedTemplate.cardColor);
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
      text1: text1.trim(),
      text2: text2.trim(),
      maxPoints: safeMax,
      filledPoints: safeFilled,
      rewardsCollected: safeRewards,
      cardColor,
    };
  }, [
    businessName,
    text1,
    text2,
    templateName,
    cardColor,
    filledPoints,
    maxPoints,
    rewardsCollected,
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

            <div className="sm:col-span-10">
              <div className="grid gap-4 sm:grid-cols-3">
                <CustomInput
                  id="cardTemplateTitle"
                  label="Template name"
                  placeholder="Template name"
                  value={templateName}
                  errorText={errors.templateName}
                  onChange={(event) => {
                    setTemplateName(event.target.value);
                    if (errors.templateName) {
                      setErrors((prev) => ({ ...prev, templateName: undefined }));
                    }
                  }}
                />
                <CustomInput
                  id="cardIssuerName"
                  label="Text 1"
                  placeholder="Text 1"
                  value={text1}
                  errorText={errors.text1}
                  onChange={(event) => {
                    setText1(event.target.value);
                    if (errors.text1) {
                      setErrors((prev) => ({ ...prev, text1: undefined }));
                    }
                  }}
                />
                <CustomInput
                  id="cardProgramName"
                  label="Text 2"
                  placeholder="Text 2"
                  value={text2}
                  errorText={errors.text2}
                  onChange={(event) => {
                    setText2(event.target.value);
                    if (errors.text2) {
                      setErrors((prev) => ({ ...prev, text2: undefined }));
                    }
                  }}
                />
              </div>
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
            disabled={saving || !businessId}
            onClick={async () => {
              if (!businessId) {
                toast.error("No business selected.");
                return;
              }
              const nextErrors: Partial<Record<string, string>> = {};
              if (!templateName.trim()) {
                nextErrors.templateName = "Template name is required.";
              }
              if (!text1.trim()) {
                nextErrors.text1 = "Text 1 is required.";
              }
              if (!text2.trim()) {
                nextErrors.text2 = "Text 2 is required.";
              }
              if (Object.keys(nextErrors).length > 0) {
                setErrors(nextErrors);
                toast.error("Please fill in the required fields.");
                return;
              }
              setSaving(true);
              try {
                const payload = {
                  template: templateName.trim(),
                  text1: text1.trim() || null,
                  text2: text2.trim() || null,
                  maxPoints: sanitized.maxPoints,
                  cardColor: sanitized.cardColor,
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
                setErrors({});
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
          <WalletCardPreview
            text1={sanitized.text1}
            text2={sanitized.text2}
            maxPoints={sanitized.maxPoints}
            filledPoints={sanitized.filledPoints}
            rewardsCollected={sanitized.rewardsCollected}
            cardColor={sanitized.cardColor}
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
