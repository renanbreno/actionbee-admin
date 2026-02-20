"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandForm } from "@/contexts/brands/presentation/components";

export default function NewBrandPage() {
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
            Nova Marca
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Cadastre uma nova marca para os produtos.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        <BrandForm />
      </div>
    </div>
  );
}
