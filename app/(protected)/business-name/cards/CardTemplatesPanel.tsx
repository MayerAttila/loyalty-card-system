"use client";

import React from "react";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";
import LoyaltyCard from "./LoyaltyCard";
import { CardTemplate } from "@/types/cardTemplate";

type SavedTemplatesProps = {
  initialTemplates?: CardTemplate[];
  businessId?: string;
  deletingIds?: Set<string>;
  onEdit?: (template: CardTemplate) => void;
  onCreate?: () => void;
  onDelete?: (template: CardTemplate) => void;
};

const CardTemplatesPanel = ({
  initialTemplates = [],
  businessId,
  deletingIds,
  onEdit,
  onCreate,
  onDelete,
}: SavedTemplatesProps) => {
  const templates = initialTemplates;

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
          <button
            type="button"
            onClick={onCreate}
            disabled={!businessId}
            className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-primary disabled:opacity-60"
          >
            New template
          </button>
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
                    <p className="text-sm font-semibold text-contrast">
                      {template.title}
                    </p>
                    <p className="text-xs text-contrast/70">
                      {template.maxPoints} stamps
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
