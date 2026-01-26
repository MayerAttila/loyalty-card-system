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
    setSelectedTemplate(template);
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
      <CardTemplatesPanel
        initialTemplates={templates}
        businessId={businessId}
        initialHasLogo={initialHasLogo}
        deletingIds={deletingIds}
        activatingIds={activatingIds}
        onEdit={(template) => {
          setSelectedTemplate(template);
          setIsCreating(false);
        }}
        onCreate={() => {
          setSelectedTemplate(undefined);
          setIsCreating(true);
        }}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />
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
