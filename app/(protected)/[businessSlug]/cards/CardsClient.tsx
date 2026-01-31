"use client";

import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import CardTemplatesPanel from "./CardTemplatesPanel";
import CardTemplateEditor from "./CardTemplateEditor";
import { CardTemplate } from "@/types/cardTemplate";
import {
  deleteCardTemplate,
  updateCardTemplate,
} from "@/api/client/cardTemplate.api";
import Button from "@/components/Button";
import ActiveButton from "@/components/ActiveButton";

type CardsClientProps = {
  initialTemplates: CardTemplate[];
  businessId?: string;
  initialBusinessName?: string;
  initialHasLogo?: boolean;
};

const CardsClient = ({
  initialTemplates,
  businessId,
  initialBusinessName,
  initialHasLogo,
}: CardsClientProps) => {
  const [templates, setTemplates] = useState<CardTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>();
  const [isCreating, setIsCreating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [activatingIds, setActivatingIds] = useState<Set<string>>(new Set());
  const hasTemplates = templates.length > 0;
  const hasActiveTemplate = templates.some((template) => template.isActive);

  const startCreate = () => {
    setSelectedTemplate(undefined);
    setIsCreating(true);
  };

  const handleTemplateSaved = (template: CardTemplate) => {
    setTemplates((current) => {
      const existingIndex = current.findIndex((item) => item.id === template.id);
      const next =
        existingIndex === -1
          ? [template, ...current]
          : current.map((item) =>
              item.id === template.id ? template : item
            );
      if (!template.isActive) {
        return next;
      }
      return next.map((item) => ({
        ...item,
        isActive: item.id === template.id,
      }));
    });
    setSelectedTemplate(undefined);
    setIsCreating(false);
  };

  const handleDelete = useCallback(async (template: CardTemplate) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.add(template.id);
      return next;
    });

    try {
      await deleteCardTemplate(template.id, true);
      setTemplates((prev) => prev.filter((item) => item.id !== template.id));
      if (selectedTemplate?.id === template.id) {
        setSelectedTemplate(undefined);
        setIsCreating(false);
      }
      toast.success("Template deleted.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete template.");
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(template.id);
        return next;
      });
    }
  }, [selectedTemplate?.id]);

  const handleToggleActive = useCallback(
    async (template: CardTemplate, nextActive: boolean) => {
      if (template.isActive === nextActive) return;
      setActivatingIds((prev) => {
        const next = new Set(prev);
        next.add(template.id);
        return next;
      });

      try {
        const updated = await updateCardTemplate(template.id, {
          isActive: nextActive,
        });
        setTemplates((prev) => {
          if (nextActive) {
            return prev.map((item) => ({
              ...item,
              isActive: item.id === updated.id,
            }));
          }
          return prev.map((item) =>
            item.id === updated.id ? { ...item, isActive: false } : item
          );
        });
        if (selectedTemplate?.id === updated.id) {
          setSelectedTemplate({ ...selectedTemplate, isActive: updated.isActive });
        }
        toast.success(
          nextActive ? "Active template updated." : "Template deactivated."
        );
      } catch (error) {
        console.error(error);
        toast.error(
          nextActive ? "Unable to activate template." : "Unable to deactivate template."
        );
      } finally {
        setActivatingIds((prev) => {
          const next = new Set(prev);
          next.delete(template.id);
          return next;
        });
      }
    },
    [selectedTemplate]
  );

  return (
    <div className="space-y-6">
      {!hasTemplates ? (
        <section className="rounded-xl border border-accent-3 bg-primary/60 p-5">
          <h3 className="text-lg font-semibold text-brand">
            Create your first loyalty card
          </h3>
          <p className="mt-2 text-sm text-contrast/80">
            Upload a logo and stamps in the Business tab, then create a template
            here to start issuing cards.
          </p>
          <div className="mt-4">
            <Button type="button" onClick={startCreate}>
              Create template
            </Button>
          </div>
        </section>
      ) : (
        <>
          {!hasActiveTemplate ? (
            <section className="rounded-xl border border-accent-3 bg-primary/60 p-5">
              <h3 className="text-lg font-semibold text-brand">
                No active template yet
              </h3>
              <p className="mt-2 text-sm text-contrast/80">
                Activate one of your templates so new customers receive a card
                automatically.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-contrast/70">
                <ActiveButton
                  isActive={false}
                  onActivate={() => undefined}
                  disabled
                  title="Activate template"
                />
                <span>Use this toggle to set an active template.</span>
              </div>
            </section>
          ) : null}
          <CardTemplatesPanel
            initialTemplates={templates}
            businessId={businessId}
            businessName={initialBusinessName}
            initialHasLogo={initialHasLogo}
            deletingIds={deletingIds}
            activatingIds={activatingIds}
            onEdit={(template) => {
              setSelectedTemplate(template);
              setIsCreating(false);
            }}
            onCreate={startCreate}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </>
      )}
      {selectedTemplate || isCreating ? (
        <CardTemplateEditor
          key={selectedTemplate?.id ?? "new-template"}
          initialBusinessName={initialBusinessName}
          initialHasLogo={initialHasLogo}
          businessId={businessId}
          selectedTemplate={selectedTemplate}
          onTemplateSaved={handleTemplateSaved}
          onCancel={() => {
            setSelectedTemplate(undefined);
            setIsCreating(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default CardsClient;
