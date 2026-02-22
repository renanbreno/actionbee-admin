"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Edit,
  AlertTriangle,
  User,
  Phone,
  MapPin,
  Calendar,
  Package,
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { Customer, PaginatedCustomers } from "../../domain/entities/customer";
import { useCustomers } from "../hooks/use-customers";
import { CustomerFormDialog } from "./customer-form-dialog";
import { formatPhone, formatDocument } from "@/shared/utils/masks";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Actions Dropdown ─── */
function CustomerActions({
  onEdit,
}: {
  onEdit: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Mobile Card ─── */
function CustomerCard({
  customer,
  onEdit,
}: {
  customer: Customer;
  onEdit: () => void;
}) {
  const documentNumber = customer.cnpj ? formatDocument(customer.cnpj) : customer.cpf ? formatDocument(customer.cpf) : null;

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-11 w-11 items-center justify-center rounded-full shrink-0 ${customer.isFinalConsumer === false ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-base truncate">{customer.name}</p>
            <p className="text-muted-foreground text-sm truncate">{customer.email}</p>
          </div>
          <CustomerActions onEdit={onEdit} />
        </div>

        {/* Info */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {documentNumber && (
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="text-xs">{documentNumber}</span>
            </div>
          )}
          {customer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{formatPhone(customer.phone)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(customer.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>{customer.ordersCount ?? 0} pedido{(customer.ordersCount ?? 0) !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Tipo de cliente */}
        {customer.isFinalConsumer !== undefined && customer.isFinalConsumer !== null && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${customer.isFinalConsumer ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {customer.isFinalConsumer ? "Consumidor Final" : "Revendedor"}
            </span>
          </div>
        )}

        {/* Address */}
        {customer.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {customer.address.street}, {customer.address.number}{" "}
              {customer.address.complement && `- ${customer.address.complement}`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function CustomerRow({
  customer,
  onEdit,
}: {
  customer: Customer;
  onEdit: () => void;
}) {
  const documentNumber = customer.cnpj ? formatDocument(customer.cnpj) : customer.cpf ? formatDocument(customer.cpf) : null;

  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${customer.isFinalConsumer === false ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"}`}>
            <User className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-medium">{customer.name}</p>
            <p className="text-muted-foreground text-xs">{customer.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm">
          {documentNumber ? (
            <>
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{documentNumber}</span>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm">
          {customer.phone ? (
            <>
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{formatPhone(customer.phone)}</span>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {customer.isFinalConsumer !== undefined && customer.isFinalConsumer !== null ? (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${customer.isFinalConsumer ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
            {customer.isFinalConsumer ? "Consumidor Final" : "Revendedor"}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-3.5 w-3.5" />
          <span>{customer.ordersCount ?? 0}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(customer.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <CustomerActions onEdit={onEdit} />
      </TableCell>
    </TableRow>
  );
}

/* ─── Skeletons ─── */
function CardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <div className="flex gap-3">
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
          <TableCell><Skeleton className="h-9 w-48" /></TableCell>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <User className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum cliente encontrado</p>
      <p className="text-muted-foreground text-sm">
        Tente uma nova busca ou cadastre um novo cliente.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar clientes</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function CustomersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, isError } = useCustomers(page, limit, search);

  const paginatedData = data as PaginatedCustomers | undefined;
  const customers = paginatedData?.customers ?? [];
  const total = paginatedData?.total ?? 0;
  const totalPages = paginatedData?.totalPages ?? 1;

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsEditDialogOpen(true);
  };

  /* Debounce search: aguarda 500ms após o último keystroke antes de buscar */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  /* Mobile: card list */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {/* Search bar mobile */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome ou e-mail..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && customers.length === 0 && <EmptyState />}
      {customers.map((c) => (
        <CustomerCard
          key={c.id}
          customer={c}
          onEdit={() => handleEdit(c)}
        />
      ))}

      {/* Pagination mobile */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  /* Desktop: table */
  const desktopView = (
    <div className="hidden md:block space-y-4">
      {/* Search bar desktop */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {total} cliente{total !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">Cliente</TableHead>
              <TableHead className="w-[140px]">CPF/CNPJ</TableHead>
              <TableHead className="w-[130px]">Telefone</TableHead>
              <TableHead className="w-[110px]">Tipo</TableHead>
              <TableHead className="w-[60px]">Pedidos</TableHead>
              <TableHead className="w-[90px]">Cadastro</TableHead>
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
            {!isLoading && !isError && customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {customers.map((c) => (
              <CustomerRow
                key={c.id}
                customer={c}
                onEdit={() => handleEdit(c)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination desktop */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} • {total} cliente{total !== 1 ? "s" : ""}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
      <CustomerFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={editingCustomer}
      />
    </>
  );
}
