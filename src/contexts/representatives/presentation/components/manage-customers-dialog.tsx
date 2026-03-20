"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserMinus, User, Check, X } from "lucide-react";
import { Representative, RepresentativeCustomer } from "../../domain/entities/representative";
import { useAssociateCustomer } from "../hooks/use-associate-customer";
import { useDissociateCustomer } from "../hooks/use-dissociate-customer";
import { useRepresentativeCustomers } from "../hooks/use-representative-customers";
import { getAllCustomersUseCase } from "@/contexts/customers/di";

interface ManageCustomersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  representative: Representative | null;
}

interface Customer {
  id: string;
  name: string;
  email: string;
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12">
      <User className="h-6 w-6 text-muted-foreground/40" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

function AssociatedCustomerCard({
  customer,
  isProcessing,
  onDissociate,
}: {
  customer: RepresentativeCustomer;
  isProcessing: boolean;
  onDissociate: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base truncate">{customer.name}</p>
            <p className="text-muted-foreground text-sm truncate">{customer.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDissociate}
            disabled={isProcessing}
            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <UserMinus className="h-4 w-4" />
            <span className="sr-only">Desvincular</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerSuggestionItem({
  customer,
  onSelect,
}: {
  customer: Customer;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-muted transition-colors text-left"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{customer.name}</p>
        <p className="text-muted-foreground text-xs truncate">{customer.email}</p>
      </div>
      <Check className="h-4 w-4 text-muted-foreground/50" />
    </button>
  );
}

export function ManageCustomersDialog({
  open,
  onOpenChange,
  representative,
}: ManageCustomersDialogProps) {
  const [search, setSearch] = useState("");
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [associatedCustomers, setAssociatedCustomers] = useState<RepresentativeCustomer[]>([]);
  const queryClient = useQueryClient();

  const associateMutation = useAssociateCustomer();
  const dissociateMutation = useDissociateCustomer();
  const { data: fetchedCustomers, isLoading: isFetchingAssociated } =
    useRepresentativeCustomers(open ? (representative?.id ?? null) : null);

  const isProcessing =
    associateMutation.isPending || dissociateMutation.isPending || isFetchingAssociated;

  // Sync associated customers from the query result
  useEffect(() => {
    if (fetchedCustomers) {
      setAssociatedCustomers(fetchedCustomers);
    }
  }, [fetchedCustomers]);

  // Reset local state when dialog closes
  useEffect(() => {
    if (!open) {
      setAssociatedCustomers([]);
    }
  }, [open]);

  // Fetch all customers when dialog opens
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsCustomersLoading(true);
        const result = await getAllCustomersUseCase.execute(1, 100);
        setAllCustomers(result.customers);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsCustomersLoading(false);
      }
    };

    if (open) {
      fetchCustomers();
    }
  }, [open]);

  // Get available customers (not already associated)
  const associatedIds = new Set(associatedCustomers.map(c => c.id));
  const availableCustomers = allCustomers.filter(c => !associatedIds.has(c.id));

  // Filter available customers by search
  const filteredCustomers = search
    ? availableCustomers.filter(
        c =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleAssociate = async (customer: Customer) => {
    if (!representative) return;

    try {
      const updatedCustomers = await associateMutation.mutateAsync({
        representativeId: representative.id,
        customerId: customer.id,
      });
      setAssociatedCustomers(updatedCustomers);
      queryClient.invalidateQueries({ queryKey: ["representative-customers", representative.id] });
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
      toast.success("Cliente vinculado com sucesso");
      setSearch("");
      setIsSearchOpen(false);
    } catch (error) {
      toast.error("Erro ao vincular cliente");
    }
  };

  const handleDissociate = async (customerId: string, customerName: string) => {
    if (!representative) return;

    if (!confirm(`Deseja desvincular o cliente ${customerName} deste representante?`)) {
      return;
    }

    try {
      const updatedCustomers = await dissociateMutation.mutateAsync({
        representativeId: representative.id,
        customerId,
      });
      setAssociatedCustomers(updatedCustomers);
      queryClient.invalidateQueries({ queryKey: ["representative-customers", representative.id] });
      queryClient.invalidateQueries({ queryKey: ["representatives"] });
      toast.success("Cliente desvinculado com sucesso");
    } catch (error) {
      toast.error("Erro ao desvincular cliente");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setSearch("");
    setIsSearchOpen(false);
  };

  // Mobile view
  const mobileView = (
    <div className="space-y-4 md:hidden">
      {associatedCustomers.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Clientes vinculados ({associatedCustomers.length})
          </h3>
          {associatedCustomers.map(customer => (
            <AssociatedCustomerCard
              key={customer.id}
              customer={customer}
              isProcessing={isProcessing}
              onDissociate={() => handleDissociate(customer.id, customer.name)}
            />
          ))}
        </div>
      ) : (
        <EmptyState message="Nenhum cliente vinculado" />
      )}
    </div>
  );

  // Desktop view
  const desktopView = (
    <div className="hidden md:block rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[100px] text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {associatedCustomers.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-12">
                <EmptyState message="Nenhum cliente vinculado" />
              </TableCell>
            </TableRow>
          )}
          {associatedCustomers.map(customer => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber shrink-0">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  {customer.name}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{customer.email}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDissociate(customer.id, customer.name)}
                  disabled={isProcessing}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Desvincular</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-bee-amber" />
            Gerenciar Clientes
          </DialogTitle>
          <DialogDescription>
            Vincule ou desvincule clientes ao representante{" "}
            <span className="font-semibold text-foreground">{representative?.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          {/* Search to add customers */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="add-customer-search">Adicionar cliente</Label>
            <Popover open={isSearchOpen && filteredCustomers.length > 0} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="add-customer-search"
                    placeholder="Buscar por nome ou email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    className="pl-9"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-3rem)] sm:w-[500px] p-0" align="start">
                <div className="max-h-64 overflow-y-auto">
                  {filteredCustomers.map(customer => (
                    <CustomerSuggestionItem
                      key={customer.id}
                      customer={customer}
                      onSelect={() => handleAssociate(customer)}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            {search && filteredCustomers.length === 0 && (
              <p className="text-xs text-muted-foreground">
                {availableCustomers.length === 0
                  ? "Todos os clientes já estão vinculados"
                  : "Nenhum cliente encontrado"}
              </p>
            )}
          </div>

          {/* Associated customers */}
          <div className="space-y-2">
            <Label>Clientes vinculados ({associatedCustomers.length})</Label>
            {mobileView}
            {desktopView}
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
