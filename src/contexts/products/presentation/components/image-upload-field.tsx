"use client";

import { useRef } from "react";
import { X, Upload, RotateCcw } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ProductImage } from "../../domain/entities/product";

interface ImageUploadFieldProps {
  label: string;
  multiple?: boolean;
  files: File[];
  existingImages?: ProductImage[];
  keepImageIds?: string[];
  onFilesChange: (files: File[]) => void;
  onToggleKeep?: (imageId: string) => void;
  maxFiles?: number;
}

export function ImageUploadField({
  label,
  multiple = false,
  files,
  existingImages = [],
  keepImageIds = [],
  onFilesChange,
  onToggleKeep,
  maxFiles = 10,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (multiple) {
      const combined = [...files, ...selected].slice(0, maxFiles);
      onFilesChange(combined);
    } else {
      onFilesChange(selected.slice(0, 1));
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeNewFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  const keptCount = existingImages.filter((img) =>
    keepImageIds.includes(img.id),
  ).length;
  const totalKept = keptCount + files.length;
  const canAddMore = multiple ? totalKept < maxFiles : files.length === 0 && keptCount === 0;

  const hasAny = existingImages.length > 0 || files.length > 0;

  return (
    <div className="space-y-2.5">
      <Label className="text-sm font-medium">{label}</Label>

      {hasAny && (
        <div className="flex flex-wrap gap-3">
          {/* Existing images */}
          {existingImages.map((img) => {
            const isKept = keepImageIds.includes(img.id);
            return (
              <div key={img.id} className="relative shrink-0">
                {/* Thumbnail */}
                <div
                  className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    isKept
                      ? "border-border"
                      : "border-destructive/60"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
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
                </div>

                {/* Action button */}
                {onToggleKeep && (
                  <button
                    type="button"
                    onClick={() => onToggleKeep(img.id)}
                    className={`absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center shadow-md border-2 border-background transition-colors ${
                      isKept
                        ? "bg-destructive text-white hover:bg-destructive/80"
                        : "bg-muted text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                    aria-label={isKept ? "Remover imagem" : "Restaurar imagem"}
                    title={isKept ? "Remover imagem" : "Restaurar imagem"}
                  >
                    {isKept ? (
                      <X className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {/* New files */}
          {files.map((file, i) => (
            <div key={i} className="relative shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-bee-gold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
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
                onClick={() => removeNewFile(i)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white flex items-center justify-center shadow-md border-2 border-background hover:bg-destructive/80 transition-colors"
                aria-label="Remover imagem"
                title="Remover imagem"
              >
                <X className="h-3 w-3" strokeWidth={2.5} />
              </button>
            </div>
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
                className="w-24 h-24 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-bee-gold hover:bg-bee-gold/5 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-bee-gold shrink-0"
                aria-label="Adicionar imagem"
              >
                <Upload className="h-5 w-5" />
                <span className="text-[10px] font-medium">Adicionar</span>
              </button>
            </>
          )}
        </div>
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
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-bee-gold hover:bg-bee-gold/5 transition-colors text-sm text-muted-foreground hover:text-foreground w-full justify-center sm:w-auto sm:justify-start"
          >
            <Upload className="h-4 w-4 shrink-0" />
            {multiple
              ? `Adicionar imagens (máx. ${maxFiles})`
              : "Selecionar imagem"}
          </button>
        </>
      )}
    </div>
  );
}
