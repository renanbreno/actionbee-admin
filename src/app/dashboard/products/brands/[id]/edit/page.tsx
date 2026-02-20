"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandForm, BrandFormSkeleton } from "@/contexts/brands/presentation/components";
import { useBrand } from "@/contexts/brands/presentation/hooks";

export default function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: brand, isLoading } = useBrand(id);

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/products/brands">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Editar Marca
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Altere os dados da marca.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <BrandFormSkeleton />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/products/brands">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Marca não encontrada
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/products/brands">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Editar Marca
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Altere os dados da marca: <span className="font-medium">{brand.name}</span>
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        <BrandForm brandId={id} />
      </div>
    </div>
  );
}
