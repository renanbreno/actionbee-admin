"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  Edit,
  AlertTriangle,
  User,
  Phone,
  Calendar,
  MoreHorizontal,
  Mail,
  FileText,
  Search,
  ShoppingCart,
} from "lucide-react";
import { Vendedor } from "../../domain/entities/vendedor";
import { useVendedores } from "../hooks/use-vendedores";
import { useDeleteVendedor } from "../hooks/use-delete-vendedor";
import { VendedorFormDialog } from "./vendedor-form-dialog";
import { formatCPF, formatPhone } from "@/shared/utils/masks";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Actions Dropdown ─── */
function VendedorActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Mobile Card ─── */
function VendedorCard({
  vendedor,
  onEdit,
  onDelete,
}: {
  vendedor: Vendedor;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-base truncate">{vendedor.name}</p>
            <p className="text-muted-foreground text-sm truncate">{vendedor.email}</p>
          </div>
          <VendedorActions onEdit={onEdit} onDelete={onDelete} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {vendedor.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{formatPhone(vendedor.phone)}</span>
            </div>
          )}
          {vendedor.cpf && (
            <div className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span>{formatCPF(vendedor.cpf)}</span>
            </div>
          )}
          <Badge className="bg-bee-gold/15 text-amber-800 border-bee-gold/30 font-semibold text-xs">
            {vendedor.commissionRate}%
          </Badge>
          {vendedor.ordersCount > 0 && (
            <div className="flex items-center gap-1.5">
              <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-bee-amber" />
              <span>{vendedor.ordersCount} pedido{vendedor.ordersCount !== 1 ? "s" : ""}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(vendedor.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function VendedorRow({
  vendedor,
  onEdit,
  onDelete,
}: {
  vendedor: Vendedor;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber shrink-0">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{vendedor.name}</p>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Mail className="h-3 w-3" />
              {vendedor.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {vendedor.phone ? (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {formatPhone(vendedor.phone)}
          </div>
        ) : (
          <span>—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {vendedor.cpf ? formatCPF(vendedor.cpf) : <span>—</span>}
      </TableCell>
      <TableCell>
        <Badge className="bg-bee-gold/15 text-amber-800 border-bee-gold/30 font-semibold">
          {vendedor.commissionRate}%
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {vendedor.ordersCount > 0 ? (
          <div className="flex items-center gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5 text-bee-amber" />
            <span>{vendedor.ordersCount} pedido{vendedor.ordersCount !== 1 ? "s" : ""}</span>
          </div>
        ) : (
          <span>—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(vendedor.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <VendedorActions onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}

/* ─── Skeletons ─── */
function CardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-9 w-52" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-16" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded ml-auto" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <User className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum vendedor encontrado</p>
      <p className="text-muted-foreground text-sm">
        Tente uma nova busca ou cadastre um novo vendedor.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar vendedores</p>
      <p className="text-muted-foreground text-sm">Verifique sua conexão e tente novamente.</p>
    </div>
  );
}

/* ─── Main Component ─── */
export function VendedoresTable({
  onTotalChange,
}: {
  onTotalChange?: (total: number) => void;
} = {}) {
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteMutation = useDeleteVendedor();
  const { data, isLoading, isError } = useVendedores(name || undefined);

  const vendedores = data ?? [];

  useEffect(() => {
    const id = setTimeout(() => setName(nameInput), 400);
    return () => clearTimeout(id);
  }, [nameInput]);

  useEffect(() => {
    if (!isLoading && !isError) {
      onTotalChange?.(vendedores.length);
    }
  }, [vendedores.length, isLoading, isError, onTotalChange]);

  const handleEdit = (vendedor: Vendedor) => {
    setEditingVendedor(vendedor);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o vendedor ${name}?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Vendedor excluído"),
        onError: () => toast.error("Erro ao excluir vendedor"),
      });
    }
  };

  const filtersSection = (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-1.5 w-full sm:w-80">
        <Label htmlFor="vend-name-filter" className="text-sm font-medium">
          Nome do vendedor
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="vend-name-filter"
            placeholder="Buscar por nome..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  );

  /* Mobile */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && vendedores.length === 0 && <EmptyState />}
      {vendedores.map((v) => (
        <VendedorCard
          key={v.id}
          vendedor={v}
          onEdit={() => handleEdit(v)}
          onDelete={() => handleDelete(v.id, v.name)}
        />
      ))}
    </div>
  );

  /* Desktop */
  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[240px]">Vendedor</TableHead>
            <TableHead className="w-[160px]">Telefone</TableHead>
            <TableHead className="w-[150px]">CPF</TableHead>
            <TableHead className="w-[100px]">Comissão</TableHead>
            <TableHead className="w-[120px]">Pedidos</TableHead>
            <TableHead className="w-[120px]">Cadastro</TableHead>
            <TableHead className="w-[50px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && vendedores.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {vendedores.map((v) => (
            <VendedorRow
              key={v.id}
              vendedor={v}
              onEdit={() => handleEdit(v)}
              onDelete={() => handleDelete(v.id, v.name)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {filtersSection}
      {mobileView}
      {desktopView}
      <VendedorFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        vendedor={editingVendedor}
      />
    </>
  );
}
