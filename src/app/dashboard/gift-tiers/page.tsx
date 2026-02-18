"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Gift } from "lucide-react";
import { GiftTiersTable } from "@/contexts/gift-tiers/presentation/components/gift-tiers-table";
import { CreateGiftTierDialog } from "@/contexts/gift-tiers/presentation/components/create-gift-tier-dialog";

export default function GiftTiersPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Gift className="h-5 w-5 text-bee-gold" />
          <div>
            <h1 className="text-lg font-bold leading-tight md:text-xl">Brindes</h1>
            <p className="text-xs text-muted-foreground">
              Gerencie os brindes exibidos no ecommerce
            </p>
          </div>
        </div>
        {/* Desktop button */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="hidden md:flex h-9 bg-bee-gold text-black hover:bg-bee-amber shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Novo brinde
        </Button>
      </div>

      <GiftTiersTable />

      {/* Mobile FAB */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg active:scale-95 transition-transform md:hidden"
        aria-label="Novo brinde"
      >
        <Plus className="h-6 w-6" />
      </button>

      <CreateGiftTierDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
