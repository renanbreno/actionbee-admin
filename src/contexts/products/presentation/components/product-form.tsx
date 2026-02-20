"use client";

import { useEffect, useState } from "react";
import {
  useForm,
  Controller,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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

interface ProductWizardProps {
  defaultValues?: Product;
  onSubmit: (values: ProductFormValues) => void;
  isSubmitting: boolean;
  mode: "create" | "edit";
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
          height: null,
          width: null,
          depth: null,
          weight: null,
          ean: null,
          unit: null,
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
    description: product.description ?? null,
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
      height: v.height ?? null,
      width: v.width ?? null,
      depth: v.depth ?? null,
      weight: v.weight ?? null,
      ean: v.ean ?? null,
      unit: v.unit ?? null,
    })),
    imageFiles: [],
    nutritionalTableImageFile: null,
    existingImages: product.images ?? [],
    keepImageIds: (product.images ?? []).map((img) => img.id),
  };
}

const STEPS = [
  { label: "Informações" },
  { label: "Imagens" },
  { label: "Variantes" },
  { label: "Configurações" },
];

const STEP_FIELDS: Record<number, (keyof ProductFormValues)[]> = {
  0: ["name"],
  1: [],
  2: ["variants"],
  3: ["variationType", "isActive", "showOnEcommerce"],
};

function StepIndicator({
  currentStep,
  completedUpTo,
}: {
  currentStep: number;
  completedUpTo: number;
}) {
  return (
    <>
      {/* Mobile: text only */}
      <div className="sm:hidden text-sm font-medium text-muted-foreground mb-6">
        Passo {currentStep + 1} de {STEPS.length} —{" "}
        <span className="text-foreground font-semibold">
          {STEPS[currentStep].label}
        </span>
      </div>

      {/* Desktop: circles + lines */}
      <div className="hidden sm:flex items-center mb-8">
        {STEPS.map((step, index) => {
          const isCompleted = index < completedUpTo;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="flex items-center flex-1 last:flex-none">
              {/* Circle */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    isCompleted
                      ? "bg-bee-gold text-white"
                      : isCurrent
                        ? "bg-bee-gold text-white ring-4 ring-bee-gold/20"
                        : "bg-muted text-muted-foreground",
                  ].join(" ")}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={[
                    "text-xs whitespace-nowrap",
                    isCurrent
                      ? "font-semibold text-foreground"
                      : isCompleted
                        ? "text-bee-gold font-medium"
                        : "text-muted-foreground",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={[
                    "h-0.5 flex-1 mx-2 mb-5 transition-colors",
                    index < completedUpTo ? "bg-bee-gold" : "bg-border",
                  ].join(" ")}
                />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export function ProductWizard({
  defaultValues,
  onSubmit,
  isSubmitting,
  mode,
}: ProductWizardProps) {
  const { data: categories } = useCategories();
  const { data: brands = [] } = useBrands();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedUpTo, setCompletedUpTo] = useState(0);

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
    trigger,
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

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const ok = fields.length === 0 ? true : await trigger(fields);
    if (ok) {
      const next = currentStep + 1;
      setCurrentStep(next);
      setCompletedUpTo((prev) => Math.max(prev, next));
    }
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-6"
      >
        <StepIndicator currentStep={currentStep} completedUpTo={completedUpTo} />

        {/* Step 0: Informações */}
        {currentStep === 0 && (
          <section className="space-y-4">
            <div className="space-y-2">
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

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Descreva o produto..."
                rows={4}
                className="resize-none"
                {...register("description")}
              />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
          </section>
        )}

        {/* Step 1: Imagens */}
        {currentStep === 1 && (
          <section className="space-y-4">
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
            />

            <ImageUploadField
              label="Tabela nutricional (opcional)"
              multiple={false}
              files={nutritionalFile ? [nutritionalFile] : []}
              onFilesChange={(files) =>
                setValue(
                  "nutritionalTableImageFile",
                  files.length > 0 ? files[0] : null,
                )
              }
            />
          </section>
        )}

        {/* Step 2: Variantes */}
        {currentStep === 2 && (
          <section className="space-y-4">
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
            <VariantFields />
          </section>
        )}

        {/* Step 3: Configurações */}
        {currentStep === 3 && (
          <section className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="variationType">Tipo de variação</Label>
              <Input
                id="variationType"
                placeholder="Ex: peso, tamanho"
                {...register("variationType")}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Produto ativo</Label>
                <p className="text-xs text-muted-foreground">
                  Produto visível para os clientes
                </p>
              </div>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>

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

          </section>
        )}

        {/* Navigation */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="min-h-[44px]"
          >
            Voltar
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="min-h-[44px] min-w-[120px] bg-bee-gold hover:bg-bee-amber text-black font-semibold"
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => methods.handleSubmit(onSubmit)()}
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
          )}
        </div>
      </form>
    </FormProvider>
  );
}

// Backwards-compat alias so existing imports of ProductForm still work during migration
export { ProductWizard as ProductForm };
