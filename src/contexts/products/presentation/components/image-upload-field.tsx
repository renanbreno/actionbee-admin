"use client";

import { useRef, useState, useMemo } from "react";
import { X, Upload, RotateCcw, Loader2, GripVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ProductImage } from "../../domain/entities/product";
import { compressImages } from "@/shared/utils/compress-image";

interface ImageUploadFieldProps {
  label: string;
  multiple?: boolean;
  files: File[];
  existingImages?: ProductImage[];
  keepImageIds?: string[];
  onFilesChange: (files: File[]) => void;
  onToggleKeep?: (imageId: string) => void;
  onDeleteImage?: (imageId: string) => Promise<void>;
  onReorder?: (existingImages: ProductImage[], files: File[]) => void;
  maxFiles?: number;
}

type SortableItem =
  | { type: "existing"; id: string; image: ProductImage }
  | { type: "new"; id: string; file: File; index: number };

function SortableImageItem({
  item,
  isKept,
  isDeleting,
  onToggleKeep,
  onRemoveNew,
}: {
  item: SortableItem;
  isKept?: boolean;
  isDeleting?: boolean;
  onToggleKeep?: (imageId: string) => void;
  onRemoveNew?: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  if (item.type === "existing") {
    return (
      <div ref={setNodeRef} style={style} className="relative shrink-0">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-0 left-0 z-10 h-6 w-6 flex items-center justify-center rounded-br-lg bg-black/50 text-white cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {/* Thumbnail */}
        <div
          className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
            isKept ? "border-border" : "border-destructive/60"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image.url}
            alt="Imagem do produto"
            className={`w-full h-full object-cover transition-all duration-200 ${
              isKept ? "" : "opacity-30"
            }`}
          />

          {/* Deleted overlay */}
          {!isKept && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-destructive/10 rounded-xl">
              <X className="h-6 w-6 text-destructive" strokeWidth={2.5} />
              <span className="text-[10px] font-semibold text-destructive uppercase tracking-wide">
                Removida
              </span>
            </div>
          )}

          {/* Loading overlay */}
          {isDeleting && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/80 rounded-xl">
              <Loader2
                className="h-6 w-6 text-bee-gold animate-spin"
                strokeWidth={2.5}
              />
              <span className="text-[10px] font-semibold text-bee-gold uppercase tracking-wide">
                Excluindo...
              </span>
            </div>
          )}
        </div>

        {/* Action button */}
        {onToggleKeep && (
          <button
            type="button"
            onClick={() => onToggleKeep(item.image.id)}
            disabled={isDeleting}
            className={`absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center shadow-md border-2 border-background transition-colors ${
              isKept
                ? "bg-destructive text-white hover:bg-destructive/80"
                : "bg-muted text-muted-foreground hover:bg-background hover:text-foreground"
            } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={isKept ? "Remover imagem" : "Restaurar imagem"}
            title={isKept ? "Remover imagem" : "Restaurar imagem"}
          >
            {isDeleting ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : isKept ? (
              <X className="h-3 w-3" strokeWidth={2.5} />
            ) : (
              <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
            )}
          </button>
        )}
      </div>
    );
  }

  // New file item
  return (
    <div ref={setNodeRef} style={style} className="relative shrink-0">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 z-10 h-6 w-6 flex items-center justify-center rounded-br-lg bg-black/50 text-white cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>

      <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-bee-gold">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={URL.createObjectURL(item.file)}
          alt={item.file.name}
          className="w-full h-full object-cover"
        />
        {/* "New" badge */}
        <div className="absolute bottom-0 left-0 right-0 bg-bee-gold/90 py-0.5 text-center">
          <span className="text-[9px] font-bold text-black uppercase tracking-wider">
            Nova
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemoveNew?.(item.index)}
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-md border-2 border-background hover:bg-destructive/80 transition-colors"
        aria-label="Remover imagem"
        title="Remover imagem"
      >
        <X className="h-3 w-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function ImageUploadField({
  label,
  multiple = false,
  files,
  existingImages = [],
  keepImageIds = [],
  onFilesChange,
  onToggleKeep,
  onDeleteImage,
  onReorder,
  maxFiles = 10,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingImageIds, setDeletingImageIds] = useState<Set<string>>(
    new Set(),
  );
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selected = Array.from(e.target.files ?? []);
    if (inputRef.current) inputRef.current.value = "";
    if (selected.length === 0) return;

    setIsCompressing(true);
    try {
      const compressed = await compressImages(selected);
      if (multiple) {
        const combined = [...files, ...compressed].slice(0, maxFiles);
        onFilesChange(combined);
      } else {
        onFilesChange(compressed.slice(0, 1));
      }
    } finally {
      setIsCompressing(false);
    }
  };

  const removeNewFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const handleToggleKeep = async (imageId: string) => {
    const isCurrentlyKept = keepImageIds.includes(imageId);

    if (isCurrentlyKept && onDeleteImage) {
      setDeletingImageIds((prev) => new Set(prev).add(imageId));
      try {
        await onDeleteImage(imageId);
        onToggleKeep?.(imageId);
      } catch {
        // If deletion fails, don't update local state
      } finally {
        setDeletingImageIds((prev) => {
          const next = new Set(prev);
          next.delete(imageId);
          return next;
        });
      }
    } else {
      onToggleKeep?.(imageId);
    }
  };

  // Build sortable items list
  const sortableItems: SortableItem[] = useMemo(() => {
    const items: SortableItem[] = existingImages.map((img) => ({
      type: "existing" as const,
      id: `existing-${img.id}`,
      image: img,
    }));
    files.forEach((file, i) => {
      items.push({
        type: "new" as const,
        id: `new-${i}-${file.name}`,
        file,
        index: i,
      });
    });
    return items;
  }, [existingImages, files]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortableItems.findIndex((item) => item.id === active.id);
    const newIndex = sortableItems.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sortableItems, oldIndex, newIndex);

    // Split back into existing images and new files
    const newExistingImages: ProductImage[] = [];
    const newFiles: File[] = [];
    let orderCounter = 0;

    reordered.forEach((item) => {
      if (item.type === "existing") {
        newExistingImages.push({ ...item.image, order: orderCounter });
      } else {
        newFiles.push(item.file);
      }
      orderCounter++;
    });

    onReorder?.(newExistingImages, newFiles);
  };

  const keptCount = existingImages.filter((img) =>
    keepImageIds.includes(img.id),
  ).length;
  const totalKept = keptCount + files.length;
  const canAddMore = multiple
    ? totalKept < maxFiles
    : files.length === 0 && keptCount === 0;

  const hasAny = existingImages.length > 0 || files.length > 0;
  const canDrag = multiple && sortableItems.length > 1;

  return (
    <div className="space-y-2.5">
      <Label className="text-sm font-medium">{label}</Label>

      {hasAny && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortableItems.map((item) => item.id)}
            strategy={horizontalListSortingStrategy}
            disabled={!canDrag}
          >
            <div className="flex flex-wrap gap-3">
              {sortableItems.map((item) => (
                <SortableImageItem
                  key={item.id}
                  item={item}
                  isKept={
                    item.type === "existing"
                      ? keepImageIds.includes(item.image.id)
                      : undefined
                  }
                  isDeleting={
                    item.type === "existing"
                      ? deletingImageIds.has(item.image.id)
                      : undefined
                  }
                  onToggleKeep={onToggleKeep ? handleToggleKeep : undefined}
                  onRemoveNew={removeNewFile}
                />
              ))}

              {/* Inline upload tile */}
              {canAddMore && (
                <>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isCompressing}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-bee-gold hover:bg-bee-gold/5 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-bee-gold shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Adicionar imagem"
                  >
                    {isCompressing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="text-[10px] font-medium">
                          Otimizando...
                        </span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5" />
                        <span className="text-[10px] font-medium">
                          Adicionar
                        </span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty state: upload button */}
      {!hasAny && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isCompressing}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-bee-gold hover:bg-bee-gold/5 transition-colors text-sm text-muted-foreground hover:text-foreground w-full justify-center sm:w-auto sm:justify-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompressing ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                Otimizando imagens...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 shrink-0" />
                {multiple
                  ? `Adicionar imagens (máx. ${maxFiles})`
                  : "Selecionar imagem"}
              </>
            )}
          </button>
        </>
      )}

      {canDrag && (
        <p className="text-[11px] text-muted-foreground">
          Arraste as imagens para reorganizar a ordem de exibição.
        </p>
      )}
    </div>
  );
}
