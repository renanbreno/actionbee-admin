"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductWizard } from "@/contexts/products/presentation/components";
import { useCreateProduct } from "@/contexts/products/presentation/hooks/use-create-product";
import { useCategories } from "@/contexts/categories/presentation/hooks/use-categories";
import { ProductFormValues } from "@/contexts/products/presentation/schemas/product.schema";

export default function NewProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct();
  const { data: categories } = useCategories();

  const handleSubmit = (values: ProductFormValues) => {
    // Check if selected category is a food product
    const selectedCategory = categories?.find((cat) => cat.id === values.categoryId);
    const isFoodProduct = selectedCategory?.isFoodProduct ?? false;

    const data = {
      name: values.name,
      description: values.description ?? undefined,
      // Only send food-related fields if the category is a food product, otherwise send empty string to clear
      ingredients: isFoodProduct ? (values.ingredients ?? undefined) : "",
      usageRecommendation: isFoodProduct ? (values.usageRecommendation ?? undefined) : "",
      stockUnits: values.stockUnits ?? undefined,
      brandId: values.brandId ?? undefined,
      variationType: values.variationType ?? undefined,
      isActive: values.isActive,
      showOnEcommerce: values.showOnEcommerce,
      categoryId: values.categoryId ?? undefined,
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
        unitId: v.unitId ?? undefined,
        hasFreeShipping: v.hasFreeShipping ?? false,
        isRetailerVariant: v.isRetailerVariant ?? false,
      })),
    };

    createMutation.mutate(
      {
        data,
        images: values.imageFiles,
        nutritionalTableImage: isFoodProduct ? (values.nutritionalTableImageFile ?? undefined) : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Produto criado com sucesso!");
          router.push("/dashboard/products");
        },
        onError: (error) => {
          toast.error(error.message || "Erro ao criar produto. Tente novamente.");
        },
      },
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-4">
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
              Novo Produto
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Preencha os dados para cadastrar um novo produto.
            </p>
          </div>
        </div>
      </div>

      <ProductWizard
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending}
      />
    </div>
  );
}
