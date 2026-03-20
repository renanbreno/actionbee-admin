"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  ImageIcon,
  Table2,
  BarChart3,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SectionTypePicker } from "./section-type-picker";
import { TextImageSectionForm } from "./text-image-section-form";
import { ComparisonTableSectionForm } from "./comparison-table-section-form";
import { StatisticsSectionForm } from "./statistics-section-form";
import type { StorySectionType } from "@/contexts/products/domain/entities/story-section";
import type { ProductFormValues } from "../../schemas/product.schema";

const sectionMeta: Record<StorySectionType, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  text_image: { label: "Texto + Imagem", icon: ImageIcon },
  comparison_table: { label: "Tabela Comparativa", icon: Table2 },
  statistics: { label: "Estatísticas", icon: BarChart3 },
};

function defaultDataForType(type: StorySectionType) {
  switch (type) {
    case "text_image":
      return { tag: "", title: "", description: "", imageUrl: "", imagePosition: "right" as const };
    case "comparison_table":
      return {
        title: "", subtitle: "", leftImageUrl: "", rightImageUrl: "",
        rows: [{ label: "", leftValue: "true", rightValue: "false", leftType: "boolean" as const, rightType: "boolean" as const }],
      };
    case "statistics":
      return { tag: "", title: "", description: "", imageUrl: "", stats: [{ value: "", description: "" }], backgroundColor: "" };
  }
}

interface SortableSectionProps {
  field: Record<string, any>;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
}

function SortableSection({ field, index, isExpanded, onToggleExpand, onRemove }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  const meta = sectionMeta[field.type as StorySectionType];
  const Icon = meta?.icon ?? ImageIcon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-lg border bg-card ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 w-full px-3 py-2.5 text-left min-h-[44px]">
        <button
          type="button"
          className="touch-none cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted shrink-0"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div
          role="button"
          tabIndex={0}
          className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
          onClick={onToggleExpand}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggleExpand(); }}
        >
          <Icon className="h-4 w-4 text-bee-gold shrink-0" />
          <span className="text-sm font-medium flex-1 truncate">
            {meta?.label ?? "Seção"} #{index + 1}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <button
            type="button"
            className="p-1 text-muted-foreground"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t pt-3">
          {field.type === "text_image" && (
            <TextImageSectionForm index={index} />
          )}
          {field.type === "comparison_table" && (
            <ComparisonTableSectionForm index={index} />
          )}
          {field.type === "statistics" && (
            <StatisticsSectionForm index={index} />
          )}
        </div>
      )}
    </div>
  );
}

export function StoryBuilder() {
  const { control } = useFormContext<ProductFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "storySections",
  });

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addSection = (type: StorySectionType) => {
    const newId = crypto.randomUUID();
    append({
      id: newId,
      type,
      order: fields.length,
      data: defaultDataForType(type),
    });
    setExpandedIds((prev) => new Set(prev).add(newId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Seções da Story</Label>
        <SectionTypePicker onSelect={addSection} />
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6 border rounded-lg border-dashed">
          Nenhuma seção adicionada. Clique em &quot;Adicionar seção&quot; para começar.
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((f) => f.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {fields.map((field, index) => (
              <SortableSection
                key={field.id}
                field={field}
                index={index}
                isExpanded={expandedIds.has(field.id)}
                onToggleExpand={() => toggleExpand(field.id)}
                onRemove={() => remove(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
