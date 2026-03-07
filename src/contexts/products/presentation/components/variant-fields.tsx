"use client";

import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductFormValues } from "../schemas/product.schema";
import { useActiveUnits } from "@/contexts/units/presentation/hooks";
import { CurrencyInput } from "@/shared/presentation/components/currency-input";

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
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<ProductFormValues>();

  const variantErrors = errors.variants?.[index];
  const name = watch(`variants.${index}.name`);
  const isRetailerVariant = watch(`variants.${index}.isRetailerVariant`);

  useEffect(() => {
    if (isRetailerVariant) {
      setValue(`variants.${index}.price`, 0);
      setValue(`variants.${index}.offerPrice`, null);
      setValue(`variants.${index}.hasFreeShipping`, false);
    }
  }, [isRetailerVariant]);

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

          {/* Toggle: Variante de revendedor */}
          <div className="flex items-center justify-between rounded-lg border p-3 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium">Variante de revendedor</Label>
              <p className="text-xs text-muted-foreground">
                Oculta no e-commerce. Usa o preço de revendedor em pedidos manuais.
              </p>
            </div>
            <Controller
              name={`variants.${index}.isRetailerVariant`}
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

          {/* Toggle: Frete grátis (apenas para variantes normais) */}
          {!isRetailerVariant && (
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
          )}

          {/* Row 2: Preços */}
          {isRetailerVariant ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Controller
                name={`variants.${index}.retailerPrice`}
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    label="Preço Revendedor (R$)"
                    value={field.value ?? 0}
                    onChange={(v) => field.onChange(v === 0 ? null : v)}
                    error={variantErrors?.retailerPrice?.message as string | undefined}
                    required
                    className="text-xs"
                    inputClassName="text-xs"
                  />
                )}
              />
              <Controller
                name={`variants.${index}.distributorPrice`}
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    label="Preço Distribuidor (R$)"
                    value={field.value ?? 0}
                    onChange={(v) => field.onChange(v === 0 ? null : v)}
                    error={variantErrors?.distributorPrice?.message as string | undefined}
                    className="text-xs"
                    inputClassName="text-xs"
                  />
                )}
              />
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Unidades/variante <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  className="text-xs"
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
          ) : (
            <>
              {/* Preços por tipo de cliente */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Preços por tipo de cliente</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg border bg-muted/30">
                  <Controller
                    name={`variants.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        label="Consumidor Final (R$)"
                        value={field.value}
                        onChange={field.onChange}
                        error={variantErrors?.price?.message as string | undefined}
                        required
                        className="text-xs"
                        inputClassName="text-xs"
                      />
                    )}
                  />
                  <Controller
                    name={`variants.${index}.offerPrice`}
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        label="Preço Oferta (R$)"
                        value={field.value ?? null}
                        onChange={(v) => field.onChange(v === 0 ? null : v)}
                        error={variantErrors?.offerPrice?.message as string | undefined}
                        className="text-xs"
                        inputClassName="text-xs"
                      />
                    )}
                  />
                  <Controller
                    name={`variants.${index}.retailerPrice`}
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        label="Revendedor (R$)"
                        value={field.value ?? 0}
                        onChange={(v) => field.onChange(v === 0 ? null : v)}
                        error={variantErrors?.retailerPrice?.message as string | undefined}
                        className="text-xs"
                        inputClassName="text-xs"
                      />
                    )}
                  />
                  <Controller
                    name={`variants.${index}.distributorPrice`}
                    control={control}
                    render={({ field }) => (
                      <CurrencyInput
                        label="Distribuidor (R$)"
                        value={field.value ?? 0}
                        onChange={(v) => field.onChange(v === 0 ? null : v)}
                        error={variantErrors?.distributorPrice?.message as string | undefined}
                        className="text-xs"
                        inputClassName="text-xs"
                      />
                    )}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Unidades/variante <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  className="text-xs"
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
            </>
          )}

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
            <UnitSelectField index={index} />
          </div>

        </div>
      )}
    </div>
  );
}

function UnitSelectField({ index }: { index: number }) {
  const { data: units = [], isLoading: isLoadingUnits } = useActiveUnits({
    enabled: true,
  });
  const { control } = useFormContext<ProductFormValues>();

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Unidade</Label>
      <Controller
        name={`variants.${index}.unitId`}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ?? "none"}
            onValueChange={(v) => field.onChange(v === "none" ? null : v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingUnits ? "Carregando..." : "Selecione"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem unidade</SelectItem>
              {units.map((unit) => (
                <SelectItem key={unit.id} value={unit.id}>
                  {unit.acronym} - {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
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
      retailerPrice: null,
      distributorPrice: null,
      height: null,
      width: null,
      depth: null,
      weight: null,
      ean: null,
      unitId: null,
      hasFreeShipping: false,
      isRetailerVariant: false,
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
