"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductWizard } from "@/contexts/products/presentation/components";
import { useCreateProduct } from "@/contexts/products/presentation/hooks/use-create-product";
import { ProductFormValues } from "@/contexts/products/presentation/schemas/product.schema";

export default function NewProductPage() {
  const router = useRouter();
  const createMutation = useCreateProduct();

  const handleSubmit = (values: ProductFormValues) => {
    const data = {
      name: values.name,
      description: values.description ?? undefined,
      ingredients: values.ingredients ?? undefined,
      usageRecommendation: values.usageRecommendation ?? undefined,
      stockUnits: values.stockUnits ?? undefined,
      brand: values.brand ?? undefined,
      variationType: values.variationType ?? undefined,
      isActive: values.isActive,
      categoryId: values.categoryId ?? undefined,
      variants: values.variants.map((v) => ({
        name: v.name,
        sku: v.sku,
        unitsPerVariant: v.unitsPerVariant,
        price: v.price,
        offerPrice: v.offerPrice,
        height: v.height,
        width: v.width,
        depth: v.depth,
        weight: v.weight,
        ean: v.ean,
        unit: v.unit,
      })),
    };

    createMutation.mutate(
      {
        data,
        images: values.imageFiles,
        nutritionalTableImage: values.nutritionalTableImageFile ?? undefined,
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
              Novo Produto
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Preencha os dados para cadastrar um novo produto.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        <ProductWizard
          mode="create"
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}
