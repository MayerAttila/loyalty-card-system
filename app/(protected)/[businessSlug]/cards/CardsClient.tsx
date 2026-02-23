"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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
import HelpCard from "@/components/HelpCard";

type CardsClientProps = {
  initialTemplates: CardTemplate[];
  businessId?: string;
  initialBusinessName?: string;
  initialHasLogo?: boolean;
};

type EditorRenderState = {
  selectedTemplate?: CardTemplate;
  isCreating: boolean;
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
  const [editorExpanded, setEditorExpanded] = useState(false);
  const [editorRenderState, setEditorRenderState] =
    useState<EditorRenderState | null>(null);
  const editorSectionRef = useRef<HTMLDivElement | null>(null);
  const hasTemplates = templates.length > 0;
  const hasActiveTemplate = templates.some((template) => template.isActive);
  const isEditorOpen = Boolean(selectedTemplate || isCreating);

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

  useEffect(() => {
    if (!isEditorOpen) return;
    setEditorRenderState({
      selectedTemplate,
      isCreating,
    });
  }, [isEditorOpen, isCreating, selectedTemplate]);

  useEffect(() => {
    if (!isEditorOpen) {
      setEditorExpanded(false);
      return;
    }

    setEditorExpanded(false);
    let raf1 = 0;
    let raf2 = 0;

    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        setEditorExpanded(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
    };
  }, [isEditorOpen]);

  useEffect(() => {
    if (isEditorOpen || !editorRenderState) return;

    const timeoutId = window.setTimeout(() => {
      setEditorRenderState(null);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [editorRenderState, isEditorOpen]);

  useEffect(() => {
    if (!isEditorOpen || !editorExpanded) return;

    const timeoutId = window.setTimeout(() => {
      editorSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(timeoutId);
  }, [isEditorOpen, editorExpanded, selectedTemplate?.id]);

  return (
    <div className="space-y-6">
      {!hasTemplates ? (
        <HelpCard
          title="Create your first loyalty card"
          description="Logo upload is required before creating cards. Upload your business logo in the Business tab, then create and activate a template here."
        >
          <div>
            <Button type="button" onClick={startCreate}>
              Create template
            </Button>
          </div>
        </HelpCard>
      ) : (
        <>
          {!hasActiveTemplate ? (
            <HelpCard
              title="No active template yet"
              description="Activate one of your templates so new customers receive a card automatically."
            >
              <div className="flex items-center gap-2 text-xs text-contrast/70">
                <ActiveButton
                  isActive={false}
                  onActivate={() => undefined}
                  disabled
                  title="Activate template"
                />
                <span>Use this toggle to set an active template.</span>
              </div>
            </HelpCard>
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
      {editorRenderState ? (
        <div
          ref={editorSectionRef}
          className={`scroll-mt-24 grid transition-all duration-300 ease-out ${
            editorExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className={`transition-all duration-300 ease-out ${
                editorExpanded
                  ? "translate-y-0 scale-100"
                  : "-translate-y-2 scale-[0.995]"
              }`}
            >
              <CardTemplateEditor
                key={editorRenderState.selectedTemplate?.id ?? "new-template"}
                initialBusinessName={initialBusinessName}
                initialHasLogo={initialHasLogo}
                businessId={businessId}
                selectedTemplate={editorRenderState.selectedTemplate}
                onTemplateSaved={handleTemplateSaved}
                onCancel={() => {
                  setSelectedTemplate(undefined);
                  setIsCreating(false);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CardsClient;
