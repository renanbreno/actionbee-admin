"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StoryImageUpload } from "./story-image-upload";
import type { ProductFormValues } from "../../schemas/product.schema";

interface TextImageSectionFormProps {
  index: number;
}

export function TextImageSectionForm({ index }: TextImageSectionFormProps) {
  const { register, watch, setValue } = useFormContext<ProductFormValues>();
  const basePath = `storySections.${index}.data` as const;

  const imagePosition = watch(`${basePath}.imagePosition` as any) ?? "right";
  const imageUrl = watch(`${basePath}.imageUrl` as any);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tag (opcional)</Label>
        <Input
          placeholder="Ex: /PORQUE ZERO AÇÚCAR?"
          {...register(`${basePath}.tag` as any)}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Título <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="Ex: Pico glicêmico x Energia sustentada"
          {...register(`${basePath}.title` as any)}
        />
      </div>

      <div className="space-y-2">
        <Label>
          Descrição <span className="text-destructive">*</span>
        </Label>
        <Textarea
          placeholder="Texto descritivo da seção..."
          rows={4}
          className="resize-none"
          {...register(`${basePath}.description` as any)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StoryImageUpload
          label="Imagem"
          value={imageUrl}
          onChange={(url) => setValue(`${basePath}.imageUrl` as any, url ?? "")}
        />

        <div className="space-y-2">
          <Label>Posição da imagem</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={imagePosition === "left" ? "default" : "outline"}
              size="sm"
              className="min-h-[44px] flex-1"
              onClick={() => setValue(`${basePath}.imagePosition` as any, "left")}
            >
              Esquerda
            </Button>
            <Button
              type="button"
              variant={imagePosition === "center" ? "default" : "outline"}
              size="sm"
              className="min-h-[44px] flex-1"
              onClick={() => setValue(`${basePath}.imagePosition` as any, "center")}
            >
              Centro
            </Button>
            <Button
              type="button"
              variant={imagePosition === "right" ? "default" : "outline"}
              size="sm"
              className="min-h-[44px] flex-1"
              onClick={() => setValue(`${basePath}.imagePosition` as any, "right")}
            >
              Direita
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
