"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Settings, Info, ImageIcon, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/contexts/categories/presentation/hooks/use-categories";
import { useBrands } from "@/contexts/brands/presentation/hooks";
import { Product } from "../../domain/entities/product";
import {
  productFormSchema,
  ProductFormValues,
} from "../schemas/product.schema";
import { VariantFields } from "./variant-fields";
import { ImageUploadField } from "./image-upload-field";
import { normalizeRichText } from "@/shared/utils/masks";

// Animated section component for smooth transitions
function AnimatedSection({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        show ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

// Section component with icon and title
function Section({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border bg-card ${className ?? ""}`}>
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <Icon className="h-4 w-4 text-bee-gold" />
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
}

interface ProductFormProps {
  defaultValues?: Product;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
  onDeleteImage?: (imageId: string) => Promise<void>;
}

function buildDefaultValues(product?: Product): ProductFormValues {
  if (!product) {
    return {
      name: "",
      description: null,
      ingredients: null,
      usageRecommendation: null,
      stockUnits: null,
      brandId: null,
      variationType: null,
      isActive: true,
      showOnEcommerce: true,
      categoryId: null,
      variants: [
        {
          name: "",
          sku: "",
          unitsPerVariant: 1,
          price: 0,
          offerPrice: null,
          retailerPrice: null,
          height: null,
          width: null,
          depth: null,
          weight: null,
          ean: null,
          unitId: null,
          hasFreeShipping: false,
          isRetailerVariant: false,
        },
      ],
      imageFiles: [],
      nutritionalTableImageFile: null,
      existingImages: [],
      keepImageIds: [],
    };
  }

  return {
    name: product.name,
    // Normalize description to ensure it's valid JSON or null
    description: normalizeRichText(product.description),
    ingredients: product.ingredients ?? null,
    usageRecommendation: product.usageRecommendation ?? null,
    stockUnits: product.stockUnits ?? null,
    brandId: product.brandId ?? null,
    variationType: product.variationType ?? null,
    isActive: product.isActive,
    showOnEcommerce: product.showOnEcommerce ?? true,
    categoryId: product.categoryId ?? null,
    variants: product.variants.map((v) => ({
      name: v.name,
      sku: v.sku,
      unitsPerVariant: v.unitsPerVariant,
      price: v.price,
      offerPrice: v.offerPrice ?? null,
      retailerPrice: v.retailerPrice ?? null,
      height: v.height ?? null,
      width: v.width ?? null,
      depth: v.depth ?? null,
      weight: v.weight ?? null,
      ean: v.ean ?? null,
        unitId: typeof v.unitId === "string" ? v.unitId : v.unit?.id ?? null,
      hasFreeShipping: v.hasFreeShipping ?? false,
      isRetailerVariant: v.isRetailerVariant ?? v.retailerPrice != null,
    })),
    imageFiles: [],
    nutritionalTableImageFile: null,
    existingImages: product.images ?? [],
    keepImageIds: (product.images ?? []).map((img) => img.id),
  };
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
  onDeleteImage,
}: ProductFormProps) {
  const { data: categories } = useCategories();
  const { data: brands = [] } = useBrands();

  const methods = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onChange",
    defaultValues: buildDefaultValues(defaultValues),
  });

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (defaultValues) {
      methods.reset(buildDefaultValues(defaultValues));
    }
  }, [defaultValues, methods]);

  const imageFiles = watch("imageFiles");
  const nutritionalFile = watch("nutritionalTableImageFile");
  const existingImages = watch("existingImages");
  const keepImageIds = watch("keepImageIds");
  const watchedName = watch("name");
  const watchedVariants = watch("variants");
  const watchedCategoryId = watch("categoryId");

  // Check if the selected category is a food product
  const selectedCategory = categories?.find((cat) => cat.id === watchedCategoryId);
  const isFoodProduct = selectedCategory?.isFoodProduct ?? false;

  const canSubmit =
    (watchedName?.trim().length ?? 0) >= 2 &&
    (watchedVariants?.length ?? 0) >= 1;

  const handleToggleKeepImage = (imageId: string) => {
    const current = keepImageIds;
    if (current.includes(imageId)) {
      setValue("keepImageIds", current.filter((id) => id !== imageId));
    } else {
      setValue("keepImageIds", [...current, imageId]);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">

        {/* Seção: Configurações - visível primeiro no mobile */}
        <Section title="Configurações" icon={Settings} className="xl:hidden">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Exibir no e-commerce</Label>
              <p className="text-xs text-muted-foreground">
                Produto disponível para compra na loja virtual
              </p>
            </div>
            <Controller
              name="showOnEcommerce"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </Section>

        {/* Layout em 2 colunas para telas grandes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

          {/* Coluna Esquerda: Informações Básicas */}
          <div className="space-y-4">
            {/* Seção 1: Informações Básicas */}
            <Section title="Informações Básicas" icon={Package}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome (full width) */}
                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="name">
                    Nome <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ex: Mel Puro Silvestre"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* Descrição (full width) */}
                <div className="sm:col-span-2">
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <RichTextEditor
                        label="Descrição"
                        placeholder="Descreva o produto com formatação rica..."
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        error={errors.description?.message}
                      />
                    )}
                  />
                </div>

                {/* Marca */}
                <div className="space-y-2">
                  <Label htmlFor="brandId">Marca</Label>
                  <Controller
                    name="brandId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? "none"}
                        onValueChange={(v) =>
                          field.onChange(v === "none" ? null : v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem marca</SelectItem>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? "none"}
                        onValueChange={(v) =>
                          field.onChange(v === "none" ? null : v)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sem categoria</SelectItem>
                          {(categories ?? []).map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.parentId ? `  ↳ ${cat.name}` : cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Tipo de variação */}
                <div className="space-y-2">
                  <Label htmlFor="variationType">Tipo de variação</Label>
                  <Input
                    id="variationType"
                    placeholder="Ex: peso, tamanho"
                    {...register("variationType")}
                  />
                </div>

                {/* Estoque */}
                <div className="space-y-2">
                  <Label htmlFor="stockUnits">Estoque (unidades base)</Label>
                  <Input
                    id="stockUnits"
                    type="number"
                    min={0}
                    placeholder="Ex: 500"
                    {...register("stockUnits", { valueAsNumber: true })}
                  />
                  {errors.stockUnits && (
                    <p className="text-destructive text-sm">
                      {errors.stockUnits.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Ingredientes e Modo de Uso (condicional food) */}
              <AnimatedSection show={isFoodProduct}>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="ingredients">Ingredientes</Label>
                    <Textarea
                      id="ingredients"
                      placeholder="Liste os ingredientes do produto..."
                      rows={4}
                      className="resize-none"
                      {...register("ingredients")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usageRecommendation">Modo de uso</Label>
                    <Textarea
                      id="usageRecommendation"
                      placeholder="Descreva como usar o produto..."
                      rows={3}
                      className="resize-none"
                      {...register("usageRecommendation")}
                    />
                  </div>
                </div>
              </AnimatedSection>
            </Section>

            {/* Seção: Configurações - só desktop xl */}
            <Section title="Configurações" icon={Settings} className="hidden xl:block">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Exibir no e-commerce</Label>
                  <p className="text-xs text-muted-foreground">
                    Produto disponível para compra na loja virtual
                  </p>
                </div>
                <Controller
                  name="showOnEcommerce"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>
            </Section>
          </div>

          {/* Coluna Direita: Imagens + Variantes */}
          <div className="space-y-4">
            {/* Seção: Imagens */}
            <Section title="Imagens" icon={ImageIcon}>
              <ImageUploadField
                label="Fotos do produto"
                multiple
                maxFiles={10}
                files={imageFiles}
                existingImages={mode === "edit" ? existingImages : []}
                keepImageIds={keepImageIds}
                onFilesChange={(files) => setValue("imageFiles", files)}
                onToggleKeep={
                  mode === "edit" ? handleToggleKeepImage : undefined
                }
                onDeleteImage={onDeleteImage}
              />

              <AnimatedSection show={isFoodProduct}>
                <ImageUploadField
                  label="Tabela nutricional"
                  multiple={false}
                  files={nutritionalFile ? [nutritionalFile] : []}
                  onFilesChange={(files) =>
                    setValue(
                      "nutritionalTableImageFile",
                      files.length > 0 ? files[0] : null,
                    )
                  }
                />
              </AnimatedSection>
            </Section>

            {/* Seção: Variantes */}
            <Section title="Variantes" icon={Layers}>
              <VariantFields />
            </Section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-6">
          <Button variant="outline" asChild>
            <Link href="/dashboard/products">Cancelar</Link>
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="min-h-[44px] min-w-[160px] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
          >
            {isSubmitting
              ? mode === "create"
                ? "Criando..."
                : "Salvando..."
              : mode === "create"
                ? "Criar Produto"
                : "Salvar Alterações"}
          </Button>
        </div>

      </form>
    </FormProvider>
  );
}

// Backwards-compat alias for existing imports
export { ProductForm as ProductWizard };
