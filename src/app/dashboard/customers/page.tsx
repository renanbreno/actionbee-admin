"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CustomersTable,
  CustomerFormDialog,
} from "@/contexts/customers/presentation/components";
import { useCustomers } from "@/contexts/customers/presentation/hooks/use-customers";

export default function CustomersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const limit = 10;

  const { data } = useCustomers(1, limit, "");

  const paginatedData = data as
    | { customers: unknown[]; total: number }
    | undefined;
  const total = paginatedData?.total ?? 0;

  return (
    <div className="space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-[#FBBD23]/20">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-[#FBBD23]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Clientes
              </h1>
              {total > 0 && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {total} {total === 1 ? "cliente" : "clientes"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie os cadastros de clientes
            </p>
          </div>
        </div>

        {/* Desktop button */}
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="hidden sm:inline-flex gap-2 bg-[#FBBD23] text-black hover:bg-[#FCAC1C] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      {/* Table */}
      <CustomersTable />

      {/* Mobile FAB */}
      <button
        onClick={() => setIsCreateDialogOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#FBBD23] text-black shadow-lg shadow-[#FBBD23]/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Novo Cliente"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      {/* Dialogs */}
      <CustomerFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
