"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StoryImageUpload } from "./story-image-upload";
import type { ProductFormValues } from "../../schemas/product.schema";

interface StatisticsSectionFormProps {
  index: number;
}

export function StatisticsSectionForm({ index }: StatisticsSectionFormProps) {
  const { register, watch, setValue, control } = useFormContext<ProductFormValues>();
  const basePath = `storySections.${index}.data` as const;

  const { fields: stats, append: appendStat, remove: removeStat } = useFieldArray({
    control,
    name: `${basePath}.stats` as any,
  });

  const imageUrl = watch(`${basePath}.imageUrl` as any);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tag (opcional)</Label>
          <Input
            placeholder="Ex: /RESULTADOS"
            {...register(`${basePath}.tag` as any)}
          />
        </div>
        <div className="space-y-2">
          <Label>Cor de fundo (opcional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="#F5F5F5"
              {...register(`${basePath}.backgroundColor` as any)}
            />
            <input
              type="color"
              className="h-10 w-10 rounded border cursor-pointer shrink-0"
              value={watch(`${basePath}.backgroundColor` as any) || "#ffffff"}
              onChange={(e) =>
                setValue(`${basePath}.backgroundColor` as any, e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Título <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="Ex: 99% Das pessoas..."
          {...register(`${basePath}.title` as any)}
        />
      </div>

      <div className="space-y-2">
        <Label>Descrição (opcional)</Label>
        <Textarea
          placeholder="Texto complementar..."
          rows={3}
          className="resize-none"
          {...register(`${basePath}.description` as any)}
        />
      </div>

      <StoryImageUpload
        label="Imagem (opcional)"
        value={imageUrl}
        onChange={(url) => setValue(`${basePath}.imageUrl` as any, url ?? "")}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>
            Estatísticas <span className="text-destructive">*</span>
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendStat({ value: "", description: "" })}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Estatística
          </Button>
        </div>

        <div className="space-y-2">
          {stats.map((stat, statIndex) => (
            <div
              key={stat.id}
              className="flex items-start gap-3 rounded-lg border p-3"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Valor</span>
                  <Input
                    placeholder="99%"
                    {...register(`${basePath}.stats.${statIndex}.value` as any)}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Descrição</span>
                  <Input
                    placeholder="Das pessoas aprovaram"
                    {...register(`${basePath}.stats.${statIndex}.description` as any)}
                  />
                </div>
              </div>
              {stats.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 mt-5 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeStat(statIndex)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
