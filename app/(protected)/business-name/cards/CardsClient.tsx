"use client";

import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import CardTemplatesPanel from "./CardTemplatesPanel";
import CardTemplateEditor from "./CardTemplateEditor";
import { CardTemplate } from "@/types/cardTemplate";
import { deleteCardTemplate } from "@/api/client/cardTemplate.api";

type CardsClientProps = {
  initialTemplates: CardTemplate[];
  businessId?: string;
  initialBusinessName?: string;
};

const CardsClient = ({
  initialTemplates,
  businessId,
  initialBusinessName,
}: CardsClientProps) => {
  const [templates, setTemplates] = useState<CardTemplate[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>();
  const [isCreating, setIsCreating] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleTemplateSaved = (template: CardTemplate) => {
    setTemplates((current) => {
      const existingIndex = current.findIndex((item) => item.id === template.id);
      if (existingIndex === -1) {
        return [template, ...current];
      }
      const next = [...current];
      next[existingIndex] = template;
      return next;
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
      await deleteCardTemplate(template.id);
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

  return (
    <div className="space-y-6">
      <CardTemplatesPanel
        initialTemplates={templates}
        businessId={businessId}
        deletingIds={deletingIds}
        onEdit={(template) => {
          setSelectedTemplate(template);
          setIsCreating(false);
        }}
        onCreate={() => {
          setSelectedTemplate(undefined);
          setIsCreating(true);
        }}
        onDelete={handleDelete}
      />
      {selectedTemplate || isCreating ? (
        <CardTemplateEditor
          key={selectedTemplate?.id ?? "new-template"}
          initialBusinessName={initialBusinessName}
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
