"use client";

import React, { useEffect, useState } from "react";
import ActiveButton from "@/components/ActiveButton";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";
import Button from "@/components/Button";
import LoyaltyCard from "./LoyaltyCard";
import { CardTemplate } from "@/types/cardTemplate";

type SavedTemplatesProps = {
  initialTemplates?: CardTemplate[];
  businessId?: string;
  initialHasLogo?: boolean;
  deletingIds?: Set<string>;
  activatingIds?: Set<string>;
  onEdit?: (template: CardTemplate) => void;
  onCreate?: () => void;
  onDelete?: (template: CardTemplate) => void;
  onToggleActive?: (template: CardTemplate, nextActive: boolean) => void;
};

const CardTemplatesPanel = ({
  initialTemplates = [],
  businessId,
  initialHasLogo,
  deletingIds,
  activatingIds,
  onEdit,
  onCreate,
  onDelete,
  onToggleActive,
}: SavedTemplatesProps) => {
  const templates = initialTemplates;
  const [logoAvailable, setLogoAvailable] = useState(Boolean(initialHasLogo));
  const [logoVersion] = useState(0);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const logoSrc =
    apiBaseUrl && businessId
      ? `${apiBaseUrl}/business/id/${businessId}/logo?v=${logoVersion}`
      : "";

  useEffect(() => {
    if (!logoSrc) {
      setLogoAvailable(false);
      return;
    }
    let isActive = true;
    const img = new Image();
    img.onload = () => {
      if (isActive) setLogoAvailable(true);
    };
    img.onerror = () => {
      if (isActive) setLogoAvailable(false);
    };
    img.src = logoSrc;
    return () => {
      isActive = false;
    };
  }, [logoSrc]);

  return (
    <section className="rounded-xl border border-accent-3 bg-accent-1 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-brand">Saved Templates</h2>
          <p className="mt-1 text-sm text-contrast/80">
            Reuse or update your existing loyalty card designs.
          </p>
        </div>
        {onCreate ? (
          <Button
            type="button"
            onClick={onCreate}
            disabled={!businessId}
            size="sm"
          >
            New template
          </Button>
        ) : null}
      </div>

      <div className="mt-5">
        {!businessId ? (
          <p className="text-sm text-contrast/70">
            Select a business to view templates.
          </p>
        ) : templates.length === 0 ? (
          <p className="text-sm text-contrast/70">
            No templates saved yet.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="rounded-xl border border-accent-3 bg-primary/40 p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-contrast">
                        {template.title}
                      </p>
                      {template.isActive ? (
                        <span className="rounded-full bg-brand/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                          Active
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs text-contrast/70">
                      {template.maxPoints} stamps
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onToggleActive ? (
                      <ActiveButton
                        isActive={template.isActive}
                        onActivate={() => onToggleActive(template, true)}
                        onDeactivate={() => onToggleActive(template, false)}
                        disabled={
                          activatingIds?.has(template.id) ||
                          deletingIds?.has(template.id)
                        }
                        title={
                          activatingIds?.has(template.id)
                            ? "Updating..."
                            : undefined
                        }
                      />
                    ) : null}
                    {onEdit ? (
                      <EditButton onClick={() => onEdit(template)} />
                    ) : null}
                    {onDelete ? (
                      <DeleteButton
                        onConfirm={() => onDelete(template)}
                        disabled={deletingIds?.has(template.id)}
                        ariaLabel={`Delete ${template.title}`}
                      />
                    ) : null}
                  </div>
                </div>
                <LoyaltyCard
                  businessName={template.title}
                  ownerName="Preview"
                  maxPoints={template.maxPoints}
                  filledPoints={Math.min(3, template.maxPoints)}
                  rewardsCollected={0}
                  cardColor={template.cardColor}
                  accentColor={template.accentColor}
                  textColor={template.textColor}
                  logoSrc={logoAvailable ? logoSrc : undefined}
                  useLogo={logoAvailable}
                  className="max-w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CardTemplatesPanel;
