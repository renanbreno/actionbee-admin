"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ProductFormValues } from "../schemas/product.schema";

function VariantRow({
  index,
  onRemove,
  canRemove,
}: {
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<ProductFormValues>();

  const variantErrors = errors.variants?.[index];
  const name = watch(`variants.${index}.name`);

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer select-none hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground font-medium shrink-0">
            #{index + 1}
          </span>
          <span className="font-medium text-sm truncate">
            {name || `Variante ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1.5 rounded text-destructive hover:bg-destructive/10 transition-colors"
              aria-label="Remover variante"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Fields */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t">
          {/* Row 1: Name + SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="space-y-1.5">
              <Label className="text-xs">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Ex: 250g"
                {...register(`variants.${index}.name`)}
              />
              {variantErrors?.name && (
                <p className="text-destructive text-xs">
                  {variantErrors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">
                SKU <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Ex: MEL-250G"
                {...register(`variants.${index}.sku`)}
              />
              {variantErrors?.sku && (
                <p className="text-destructive text-xs">
                  {variantErrors.sku.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Price + Offer price + Units */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">
                Preço (R$) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register(`variants.${index}.price`, {
                  valueAsNumber: true,
                })}
              />
              {variantErrors?.price && (
                <p className="text-destructive text-xs">
                  {variantErrors.price.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Preço Oferta (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                {...register(`variants.${index}.offerPrice`, {
                  valueAsNumber: true,
                  setValueAs: (v) =>
                    v === "" || isNaN(v) ? null : Number(v),
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">
                Unidades/variante <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="1"
                {...register(`variants.${index}.unitsPerVariant`, {
                  valueAsNumber: true,
                })}
              />
              {variantErrors?.unitsPerVariant && (
                <p className="text-destructive text-xs">
                  {variantErrors.unitsPerVariant.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Dimensions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Altura (cm)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="0"
                {...register(`variants.${index}.height`, {
                  valueAsNumber: true,
                  setValueAs: (v) =>
                    v === "" || isNaN(v) ? null : Number(v),
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Largura (cm)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="0"
                {...register(`variants.${index}.width`, {
                  valueAsNumber: true,
                  setValueAs: (v) =>
                    v === "" || isNaN(v) ? null : Number(v),
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prof. (cm)</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                placeholder="0"
                {...register(`variants.${index}.depth`, {
                  valueAsNumber: true,
                  setValueAs: (v) =>
                    v === "" || isNaN(v) ? null : Number(v),
                })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Peso (kg)</Label>
              <Input
                type="number"
                step="0.001"
                min="0"
                placeholder="0"
                {...register(`variants.${index}.weight`, {
                  valueAsNumber: true,
                  setValueAs: (v) =>
                    v === "" || isNaN(v) ? null : Number(v),
                })}
              />
            </div>
          </div>

          {/* Row 4: EAN + Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">EAN/Barcode</Label>
              <Input
                placeholder="Ex: 7891234567890"
                {...register(`variants.${index}.ean`)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Unidade</Label>
              <Input
                placeholder="Ex: kg, un, ml"
                {...register(`variants.${index}.unit`)}
              />
            </div>
          </div>

          {/* Row 5: Frete grátis */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">Frete grátis</Label>
              <p className="text-xs text-muted-foreground">
                Esta variante possui frete gratuito
              </p>
            </div>
            <Controller
              name={`variants.${index}.hasFreeShipping`}
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <Switch
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function VariantFields() {
  const {
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const { fields, append, remove } = useFieldArray<ProductFormValues>({
    name: "variants",
  });

  const addVariant = () => {
    append({
      name: "",
      sku: "",
      unitsPerVariant: 1,
      price: 0,
      offerPrice: null,
      height: null,
      width: null,
      depth: null,
      weight: null,
      ean: null,
      unit: null,
      hasFreeShipping: false,
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Variantes <span className="text-destructive">*</span>
        </Label>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Adicionar
        </Button>
      </div>

      {errors.variants && !Array.isArray(errors.variants) && (
        <p className="text-destructive text-sm">
          {(errors.variants as { message?: string }).message}
        </p>
      )}

      <div className="space-y-2">
        {fields.map((field, index) => (
          <VariantRow
            key={field.id}
            index={index}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
