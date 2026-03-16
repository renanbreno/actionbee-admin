"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, UserCheck, UserMinus, User, X } from "lucide-react";
import { Customer } from "../../domain/entities/customer";
import { useRepresentatives } from "@/contexts/representatives/presentation/hooks/use-representatives";
import { useAssociateCustomer } from "@/contexts/representatives/presentation/hooks/use-associate-customer";
import { useDissociateCustomer } from "@/contexts/representatives/presentation/hooks/use-dissociate-customer";

interface AssignRepresentativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function AssignRepresentativeDialog({
  open,
  onOpenChange,
  customer,
}: AssignRepresentativeDialogProps) {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: representatives = [], isLoading } = useRepresentatives();
  const associateMutation = useAssociateCustomer();
  const dissociateMutation = useDissociateCustomer();

  const isProcessing = associateMutation.isPending || dissociateMutation.isPending;

  const filtered = search
    ? representatives.filter(
        (r) =>
          r.name.toLowerCase().includes(search.toLowerCase()) ||
          r.email.toLowerCase().includes(search.toLowerCase()),
      )
    : representatives;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["customers"] });
    queryClient.invalidateQueries({ queryKey: ["representatives"] });
  };

  const handleAssign = async (representativeId: string, representativeName: string) => {
    if (!customer) return;
    try {
      await associateMutation.mutateAsync({ representativeId, customerId: customer.id });
      invalidate();
      toast.success(`Cliente vinculado a ${representativeName}`);
      onOpenChange(false);
    } catch {
      toast.error("Erro ao vincular representante");
    }
  };

  const handleUnassign = async () => {
    if (!customer?.representativeId) return;
    if (!confirm(`Deseja desvincular o cliente ${customer.name} do representante atual?`)) return;
    try {
      await dissociateMutation.mutateAsync({
        representativeId: customer.representativeId,
        customerId: customer.id,
      });
      invalidate();
      toast.success("Representante desvinculado");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao desvincular representante");
    }
  };

  const handleClose = () => {
    setSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-bee-amber" />
            Vincular Representante
          </DialogTitle>
          <DialogDescription>
            Selecione o representante para{" "}
            <span className="font-semibold text-foreground">{customer?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current representative */}
          {customer?.representativeId && (
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs font-medium text-muted-foreground mb-2">Representante atual</p>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm truncate">
                    {customer.representativeName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUnassign}
                  disabled={isProcessing}
                  className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                >
                  <X className="h-3.5 w-3.5" />
                  Desvincular
                </Button>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Buscar representante..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Representatives list */}
          <div className="max-h-64 overflow-y-auto rounded-lg border divide-y">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                </div>
              ))}
            {!isLoading && filtered.length === 0 && (
              <div className="flex flex-col items-center gap-1.5 py-10 text-center">
                <UserMinus className="h-6 w-6 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  {search ? "Nenhum representante encontrado" : "Nenhum representante cadastrado"}
                </p>
              </div>
            )}
            {!isLoading &&
              filtered.map((rep) => {
                const isCurrent = rep.id === customer?.representativeId;
                return (
                  <button
                    key={rep.id}
                    onClick={() => !isCurrent && handleAssign(rep.id, rep.name)}
                    disabled={isProcessing || isCurrent}
                    className={`flex items-center gap-3 w-full p-3 transition-colors text-left ${
                      isCurrent
                        ? "bg-muted/60 cursor-default"
                        : "hover:bg-muted cursor-pointer"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${
                        isCurrent
                          ? "bg-bee-gold/20 text-bee-amber"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{rep.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{rep.email}</p>
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-medium text-bee-amber shrink-0">Atual</span>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
