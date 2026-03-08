"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Users,
} from "lucide-react";
import { Representative } from "../../domain/entities/representative";
import { useRepresentatives } from "../hooks/use-representatives";
import { useDeleteRepresentative } from "../hooks/use-delete-representative";
import { RepresentativeFormDialog } from "./representative-form-dialog";
import { ManageCustomersDialog } from "./manage-customers-dialog";
import { formatDocument, formatPhone } from "@/shared/utils/masks";

function getDocument(rep: Representative): string | null {
  if (rep.cnpj) return formatDocument(rep.cnpj);
  if (rep.cpf) return formatDocument(rep.cpf);
  return null;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Actions Dropdown ─── */
function RepresentativeActions({
  onEdit,
  onManageCustomers,
  onDelete,
}: {
  onEdit: () => void;
  onManageCustomers: () => void;
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
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onManageCustomers}>
          <Users className="mr-2 h-3.5 w-3.5" />
          Gerenciar Clientes
        </DropdownMenuItem>
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
function RepresentativeCard({
  representative,
  onEdit,
  onManageCustomers,
  onDelete,
}: {
  representative: Representative;
  onEdit: () => void;
  onManageCustomers: () => void;
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
            <p className="font-semibold text-base truncate">{representative.name}</p>
            <p className="text-muted-foreground text-sm truncate">{representative.email}</p>
          </div>
          <RepresentativeActions
            onEdit={onEdit}
            onManageCustomers={onManageCustomers}
            onDelete={onDelete}
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {representative.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{formatPhone(representative.phone)}</span>
            </div>
          )}
          {(() => {
            const doc = getDocument(representative);
            return doc ? (
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>{doc}</span>
              </div>
            ) : null;
          })()}
          {representative.customersCount > 0 && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 shrink-0 text-bee-amber" />
              <span>{representative.customersCount} cliente{representative.customersCount !== 1 ? "s" : ""}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{formatDate(representative.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function RepresentativeRow({
  representative,
  onEdit,
  onManageCustomers,
  onDelete,
}: {
  representative: Representative;
  onEdit: () => void;
  onManageCustomers: () => void;
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
            <p className="font-medium">{representative.name}</p>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Mail className="h-3 w-3" />
              {representative.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {representative.phone ? (
          <div className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" />
            {formatPhone(representative.phone)}
          </div>
        ) : (
          <span>—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {getDocument(representative) ?? <span>—</span>}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {representative.customersCount > 0 ? (
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-bee-amber" />
            <span>{representative.customersCount} cliente{representative.customersCount !== 1 ? "s" : ""}</span>
          </div>
        ) : (
          <span>—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(representative.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <RepresentativeActions
          onEdit={onEdit}
          onManageCustomers={onManageCustomers}
          onDelete={onDelete}
        />
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
      <p className="font-medium">Nenhum representante encontrado</p>
      <p className="text-muted-foreground text-sm">
        Tente uma nova busca ou cadastre um novo representante.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar representantes</p>
      <p className="text-muted-foreground text-sm">Verifique sua conexão e tente novamente.</p>
    </div>
  );
}

/* ─── Main Component ─── */
export function RepresentativesTable({
  onTotalChange,
}: {
  onTotalChange?: (total: number) => void;
} = {}) {
  const [nameInput, setNameInput] = useState("");
  const [name, setName] = useState("");
  const [editingRep, setEditingRep] = useState<Representative | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [managingCustomersRep, setManagingCustomersRep] = useState<Representative | null>(null);
  const [isManageCustomersDialogOpen, setIsManageCustomersDialogOpen] = useState(false);

  const deleteMutation = useDeleteRepresentative();
  const { data, isLoading, isError } = useRepresentatives(name || undefined);

  const representatives = data ?? [];

  useEffect(() => {
    const id = setTimeout(() => setName(nameInput), 400);
    return () => clearTimeout(id);
  }, [nameInput]);

  useEffect(() => {
    if (!isLoading && !isError) {
      onTotalChange?.(representatives.length);
    }
  }, [representatives.length, isLoading, isError, onTotalChange]);

  const handleEdit = (rep: Representative) => {
    setEditingRep(rep);
    setIsEditDialogOpen(true);
  };

  const handleManageCustomers = (rep: Representative) => {
    setManagingCustomersRep(rep);
    setIsManageCustomersDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o representante ${name}?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Representante excluído"),
        onError: () => toast.error("Erro ao excluir representante"),
      });
    }
  };

  const filtersSection = (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="space-y-1.5 w-full sm:w-80">
        <Label htmlFor="rep-name-filter" className="text-sm font-medium">
          Nome do representante
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="rep-name-filter"
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
      {!isLoading && !isError && representatives.length === 0 && <EmptyState />}
      {representatives.map((rep) => (
        <RepresentativeCard
          key={rep.id}
          representative={rep}
          onEdit={() => handleEdit(rep)}
          onManageCustomers={() => handleManageCustomers(rep)}
          onDelete={() => handleDelete(rep.id, rep.name)}
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
            <TableHead className="w-[240px]">Representante</TableHead>
            <TableHead className="w-[160px]">Telefone</TableHead>
            <TableHead className="w-[170px]">CPF / CNPJ</TableHead>
            <TableHead className="w-[140px]">Clientes</TableHead>
            <TableHead className="w-[120px]">Cadastro</TableHead>
            <TableHead className="w-[50px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && representatives.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {representatives.map((rep) => (
            <RepresentativeRow
              key={rep.id}
              representative={rep}
              onEdit={() => handleEdit(rep)}
              onManageCustomers={() => handleManageCustomers(rep)}
              onDelete={() => handleDelete(rep.id, rep.name)}
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
      <RepresentativeFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        representative={editingRep}
      />
      <ManageCustomersDialog
        open={isManageCustomersDialogOpen}
        onOpenChange={setIsManageCustomersDialogOpen}
        representative={managingCustomersRep}
      />
    </>
  );
}
