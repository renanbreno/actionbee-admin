"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Box } from "lucide-react";
import { UnitsTable } from "@/contexts/units/presentation/components/units-table";
import { CreateUnitDialog } from "@/contexts/units/presentation/components/create-unit-dialog";

export default function UnitsPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Box className="h-5 w-5 text-bee-gold" />
          <div>
            <h1 className="text-lg font-bold leading-tight md:text-xl">Unidades de Medida</h1>
            <p className="text-xs text-muted-foreground">
              Gerencie as unidades de medida dos produtos
            </p>
          </div>
        </div>
        {/* Desktop button */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="hidden md:flex h-9 bg-bee-gold text-black hover:bg-bee-amber shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Nova unidade
        </Button>
      </div>

      <UnitsTable />

      {/* Mobile FAB */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg active:scale-95 transition-transform md:hidden"
        aria-label="Nova unidade"
      >
        <Plus className="h-6 w-6" />
      </button>

      <CreateUnitDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
