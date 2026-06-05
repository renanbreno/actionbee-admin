"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlavorForm } from "@/contexts/flavors/presentation/components";

export default function NewFlavorPage() {
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
            Novo Sabor
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Cadastre um novo sabor para os produtos.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-xl border bg-card p-4 sm:p-6 shadow-sm">
        <FlavorForm />
      </div>
    </div>
  );
}
