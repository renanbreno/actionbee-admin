"use client";

import { use } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlavorForm, FlavorFormSkeleton } from "@/contexts/flavors/presentation/components";
import { useFlavor } from "@/contexts/flavors/presentation/hooks";

export default function EditFlavorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: flavor, isLoading } = useFlavor(id);

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/products/flavors">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Editar Sabor
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Altere os dados do sabor.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
          <FlavorFormSkeleton />
        </div>
      </div>
    );
  }

  if (!flavor) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard/products/flavors">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Voltar</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Sabor não encontrado
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/dashboard/products/flavors">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Voltar</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Editar Sabor
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Altere os dados do sabor: <span className="font-medium">{flavor.name}</span>
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        <FlavorForm flavorId={id} />
      </div>
    </div>
  );
}
