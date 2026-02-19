"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductsTable } from "@/contexts/products/presentation/components";
import { useProducts } from "@/contexts/products/presentation/hooks/use-products";

function ProductsHeader() {
  const { data } = useProducts(1, 1);
  const total = data?.total;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              Produtos
            </h1>
            {total != null && (
              <Badge
                variant="secondary"
                className="text-xs font-medium"
              >
                {total}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Gerencie o catálogo de produtos da loja.
          </p>
        </div>
      </div>

      {/* Desktop button */}
      <Button
        asChild
        className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
      >
        <Link href="/dashboard/products/new">
          <Plus className="h-4 w-4" />
          Novo Produto
        </Link>
      </Button>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <ProductsHeader />

      <ProductsTable />

      {/* Mobile FAB */}
      <Link
        href="/dashboard/products/new"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Novo Produto"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </Link>
    </div>
  );
}
