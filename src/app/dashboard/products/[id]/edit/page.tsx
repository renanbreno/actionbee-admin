"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductWizard } from "@/contexts/products/presentation/components";
import { useProduct } from "@/contexts/products/presentation/hooks/use-product";
import { useUpdateProduct } from "@/contexts/products/presentation/hooks/use-update-product";
import { useDeleteImage } from "@/contexts/products/presentation/hooks/use-delete-image";
import { useCategories } from "@/contexts/categories/presentation/hooks/use-categories";
import { ProductFormValues } from "@/contexts/products/presentation/schemas/product.schema";

function EditProductSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="rounded-xl border bg-card p-6 space-y-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const { data: product, isLoading, isError } = useProduct(id);
  const updateMutation = useUpdateProduct(id);
  const deleteImageMutation = useDeleteImage(id);
  const { data: categories } = useCategories();

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImageMutation.mutateAsync(imageId);
      toast.success("Imagem removida com sucesso!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao remover imagem. Tente novamente.");
      throw error;
    }
  };

  const handleSubmit = (values: ProductFormValues) => {
    // Check if selected category is a food product
    const selectedCategory = categories?.find((cat) => cat.id === values.categoryId);
    const isFoodProduct = selectedCategory?.isFoodProduct ?? false;

    const keptImages = values.existingImages
      .filter((img) => values.keepImageIds.includes(img.id))
      .map((img, i) => ({ url: img.url, order: i }));

    const hasRemovedImages = keptImages.length < values.existingImages.length;
    const hasNewFiles = values.imageFiles.length > 0;
    // Always send images when there are changes - empty array tells backend to delete all
    const shouldSendImages = hasRemovedImages || hasNewFiles;

    const data = {
      name: values.name,
      description: values.description ?? null,
      // Only send food-related fields if the category is a food product, otherwise send empty string to clear backend data
      ingredients: isFoodProduct ? (values.ingredients ?? null) : "",
      usageRecommendation: isFoodProduct ? (values.usageRecommendation ?? null) : "",
      stockUnits: values.stockUnits ?? null,
      brandId: values.brandId ?? null,
      variationType: values.variationType ?? null,
      isActive: values.isActive,
      showOnEcommerce: values.showOnEcommerce,
      categoryId: values.categoryId ?? null,
      variants: values.variants.map((v) => ({
        name: v.name,
        sku: v.sku,
        unitsPerVariant: v.unitsPerVariant,
        price: v.price,
        offerPrice: v.offerPrice,
        retailerPrice: v.retailerPrice,
        height: v.height,
        width: v.width,
        depth: v.depth,
        weight: v.weight,
        ean: v.ean,
        unit: v.unit,
        hasFreeShipping: v.hasFreeShipping ?? false,
        isRetailerVariant: v.isRetailerVariant ?? false,
      })),
      ...(shouldSendImages && { images: keptImages }),
    };

    updateMutation.mutate(
      {
        data,
        images: values.imageFiles.length > 0 ? values.imageFiles : undefined,
        nutritionalTableImage: isFoodProduct ? (values.nutritionalTableImageFile ?? undefined) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Produto atualizado com sucesso!");
          router.push("/dashboard/products");
        },
        onError: (error) => {
          toast.error(error.message || "Erro ao atualizar produto. Tente novamente.");
        },
      },
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/dashboard/products">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bee-gold/10">
            <Package className="h-5 w-5 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {isLoading ? (
                <Skeleton className="h-7 w-48 inline-block" />
              ) : (
                product?.name ?? "Editar Produto"
              )}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Atualize os dados do produto.
            </p>
          </div>
        </div>
      </div>

      {isLoading && <EditProductSkeleton />}

      {isError && (
        <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
          <p className="text-destructive font-medium">Erro ao carregar produto.</p>
          <p className="text-muted-foreground text-sm mt-1">
            Verifique sua conexão e tente novamente.
          </p>
        </div>
      )}

      {!isLoading && !isError && product && (
        <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <ProductWizard
            mode="edit"
            defaultValues={product}
            onSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
            onDeleteImage={handleDeleteImage}
          />
        </div>
      )}
    </div>
  );
}
