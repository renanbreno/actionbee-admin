"use client";

import { Settings } from "lucide-react";
import { StoreSettingsForm } from "@/contexts/store-settings/presentation/components/store-settings-form";

export default function StoreSettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-2.5">
        <Settings className="h-5 w-5 text-bee-gold" />
        <div>
          <h1 className="text-lg font-bold leading-tight md:text-xl">
            Configurações da Loja
          </h1>
          <p className="text-xs text-muted-foreground">
            Gerencie as configurações gerais do ecommerce
          </p>
        </div>
      </div>

      <StoreSettingsForm />
    </div>
  );
}
