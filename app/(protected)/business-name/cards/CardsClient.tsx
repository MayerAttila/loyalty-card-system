"use client";

import React, { useState } from "react";
import CardTemplatesPanel from "./CardTemplatesPanel";
import CardTemplateEditor from "./CardTemplateEditor";
import { CardTemplate } from "@/types/cardTemplate";

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

  return (
    <div className="space-y-6">
      <CardTemplatesPanel
        initialTemplates={templates}
        businessId={businessId}
        onEdit={(template) => {
          setSelectedTemplate(template);
          setIsCreating(false);
        }}
        onCreate={() => {
          setSelectedTemplate(undefined);
          setIsCreating(true);
        }}
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
