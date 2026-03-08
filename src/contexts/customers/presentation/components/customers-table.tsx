"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import {
  Customer,
  CustomerLastOrder,
  CustomerType,
  CUSTOMER_TYPE_LABELS,
  PaginatedCustomers,
} from "../../domain/entities/customer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCustomers } from "../hooks/use-customers";
import { CustomerFormDialog } from "./customer-form-dialog";
import { formatPhone, formatDocument } from "@/shared/utils/masks";
import type {
  PurchaseStatus,
  CustomerTypeFilter,
} from "../../domain/repositories/customer-repository.interface";

const PURCHASE_STATUS_OPTIONS: { value: PurchaseStatus; label: string }[] = [
  { value: "all", label: "Todos os status" },
  { value: "never", label: "Nunca compraram" },
  { value: "inactive", label: "Inativos (+30 dias)" },
  { value: "active", label: "Ativos (últimos 30 dias)" },
];

const CUSTOMER_TYPE_FILTER_OPTIONS: {
  value: CustomerTypeFilter;
  label: string;
}[] = [
  { value: "all", label: "Todos os clientes" },
  { value: "FINAL_CONSUMER", label: "Consumidor Final" },
  { value: "RETAILER_RESELLER", label: "Lojistas" },
  { value: "DISTRIBUTOR_RESELLER", label: "Distribuidores" },
];

function getCustomerTypeStyle(customerType?: CustomerType | null) {
  switch (customerType) {
    case CustomerType.RETAILER_RESELLER:
      return {
        avatar: "bg-amber-100 text-amber-600",
        badge: "bg-amber-100 text-amber-700",
      };
    case CustomerType.DISTRIBUTOR_RESELLER:
      return {
        avatar: "bg-purple-100 text-purple-600",
        badge: "bg-purple-100 text-purple-700",
      };
    default:
      return {
        avatar: "bg-blue-100 text-blue-600",
        badge: "bg-green-100 text-green-700",
      };
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const LAST_ORDER_STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  DELIVERED: { bg: "bg-green-100", text: "text-green-700", label: "Entregue" },
  CONFIRMED: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Confirmado",
  },
  SHIPPED: { bg: "bg-green-100", text: "text-green-700", label: "Enviado" },
  PENDING: { bg: "bg-amber-100", text: "text-amber-700", label: "Pendente" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", label: "Cancelado" },
};

function getLastOrderStyle(status: string) {
  return (
    LAST_ORDER_STATUS_STYLES[status] ?? {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: status,
    }
  );
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function whatsappUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const number = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${number}`;
}

function isDormant(lastOrderDate?: string | null): boolean {
  if (!lastOrderDate) return true;
  const diff = Date.now() - new Date(lastOrderDate).getTime();
  return diff >= 30 * 24 * 60 * 60 * 1000;
}

function LastOrderCell({
  lastOrder,
  lastOrderDate,
}: {
  lastOrder?: CustomerLastOrder | null;
  lastOrderDate?: string | null;
}) {
  if (!lastOrder || !lastOrderDate) {
    return (
      <div className="flex items-center gap-1.5">
        <ShoppingBag className="h-3.5 w-3.5 text-red-400" />
        <span className="text-xs font-medium text-red-500">Sem compras</span>
      </div>
    );
  }

  const style = getLastOrderStyle(lastOrder.status);

  const trigger = (
    <div className="space-y-1 cursor-pointer group/lastorder rounded-md px-2 py-1.5 -mx-2 -my-1.5 transition-colors hover:bg-muted">
      <div className="flex items-center gap-1.5">
        <ShoppingBag className={`h-3.5 w-3.5 ${style.text}`} />
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
        >
          {style.label}
        </span>
        <ChevronRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover/lastorder:translate-x-0.5 group-hover/lastorder:text-muted-foreground" />
      </div>
      <div className="text-xs text-muted-foreground group-hover/lastorder:text-foreground transition-colors">
        {formatDate(lastOrderDate)} · {formatCurrency(lastOrder.totalAmount)}
      </div>
    </div>
  );

  if (!lastOrder.items?.length) return trigger;

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-0">
        <div className="px-4 py-3 border-b">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Pedido {lastOrder.orderNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(lastOrderDate)}
          </p>
        </div>
        <ul className="divide-y">
          {lastOrder.items.map((item, i) => (
            <li
              key={i}
              className="flex items-start justify-between gap-3 px-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.productName}
                </p>
                {item.variantName && (
                  <p className="text-xs text-muted-foreground truncate">
                    {item.variantName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Qtd: {item.quantity}
                </p>
              </div>
              <span className="text-xs font-medium shrink-0 text-right">
                {formatCurrency(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2.5 border-t flex justify-between items-center">
          <span className="text-xs text-muted-foreground font-medium">
            Total
          </span>
          <span className={`text-sm font-semibold ${style.text}`}>
            {formatCurrency(lastOrder.totalAmount)}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ─── Actions Dropdown ─── */
function CustomerActions({ onEdit }: { onEdit: () => void }) {
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
  const documentNumber = customer.cnpj
    ? formatDocument(customer.cnpj)
    : customer.cpf
      ? formatDocument(customer.cpf)
      : null;
  const dormant = isDormant(customer.lastOrderDate);
  const typeStyle = getCustomerTypeStyle(customer.customerType);

  return (
    <Card
      className={`shadow-sm ${dormant ? "border-orange-300 bg-orange-50/50" : ""}`}
    >
      <CardContent className="space-y-4 p-4">
        {/* Header */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full shrink-0 ${typeStyle.avatar}`}
          >
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-base truncate">
                {customer.name}
              </p>
              {dormant && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700 shrink-0">
                  <AlertTriangle className="h-3 w-3" />
                  +30 dias
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm truncate">
              {customer.email}
            </p>
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
              <a
                href={whatsappUrl(customer.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors"
                title="Abrir no WhatsApp"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(customer.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>
              {customer.ordersCount ?? 0} pedido
              {(customer.ordersCount ?? 0) !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Tipo de cliente */}
        {customer.customerType != null && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium ${typeStyle.badge}`}
            >
              {CUSTOMER_TYPE_LABELS[customer.customerType] ??
                customer.customerType}
            </span>
          </div>
        )}

        {/* Última compra */}
        <div className="border-t pt-3">
          <p className="text-xs text-muted-foreground mb-1.5 font-medium">
            Última compra
          </p>
          <LastOrderCell
            lastOrder={customer.lastOrder}
            lastOrderDate={customer.lastOrderDate}
          />
        </div>

        {/* Address */}
        {customer.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-1">
              {customer.address.street}, {customer.address.number}{" "}
              {customer.address.complement &&
                `- ${customer.address.complement}`}
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
  const documentNumber = customer.cnpj
    ? formatDocument(customer.cnpj)
    : customer.cpf
      ? formatDocument(customer.cpf)
      : null;
  const dormant = isDormant(customer.lastOrderDate);
  const typeStyle = getCustomerTypeStyle(customer.customerType);

  return (
    <TableRow
      className={`group ${dormant ? "bg-orange-50/60 hover:bg-orange-50" : ""}`}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full shrink-0 ${typeStyle.avatar}`}
          >
            <User className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium">{customer.name}</p>
              {dormant && (
                <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-1.5 py-0.5 text-xs font-medium text-orange-700">
                  <AlertTriangle className="h-3 w-3" />
                  +30 dias
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-xs">{customer.email}</p>
            <p className="text-muted-foreground/70 text-xs flex items-center gap-1 mt-0.5">
              <Package className="h-3 w-3" />
              {customer.ordersCount ?? 0} pedido
              {(customer.ordersCount ?? 0) !== 1 ? "s" : ""}
            </p>
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
              <a
                href={whatsappUrl(customer.phone)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors"
                title="Abrir no WhatsApp"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            </>
          ) : (
            <span className="text-muted-foreground text-sm">—</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {customer.customerType != null ? (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle.badge}`}
          >
            {CUSTOMER_TYPE_LABELS[customer.customerType] ??
              customer.customerType}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(customer.createdAt)}
      </TableCell>
      <TableCell>
        <LastOrderCell
          lastOrder={customer.lastOrder}
          lastOrderDate={customer.lastOrderDate}
        />
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
          <TableCell>
            <Skeleton className="h-12 w-44" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-18" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-9 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded" />
          </TableCell>
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
export function CustomersTable({
  onTotalChange,
}: {
  onTotalChange?: (total: number) => void;
} = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>("all");
  const [customerType, setCustomerType] = useState<CustomerTypeFilter>("all");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, isError } = useCustomers(
    page,
    limit,
    search,
    purchaseStatus,
    customerType,
  );

  const paginatedData = data as PaginatedCustomers | undefined;
  const customers = paginatedData?.customers ?? [];
  const total = paginatedData?.total ?? 0;
  const totalPages = paginatedData?.totalPages ?? 1;

  useEffect(() => {
    if (!isLoading && !isError) {
      onTotalChange?.(total);
    }
  }, [total, isLoading, isError, onTotalChange]);

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

  /* Filters */
  const filtersSection = (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,380px)_auto] gap-4">
        <div className="space-y-2">
          <Label htmlFor="customer-search" className="text-sm font-medium">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="customer-search"
              placeholder="Buscar por nome ou e-mail..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1.5 min-w-[180px] flex-1 sm:flex-none sm:w-52">
            <Label htmlFor="purchaseStatus" className="text-sm font-medium">
              Status de compra
            </Label>
            <Select
              value={purchaseStatus}
              onValueChange={(v) => {
                setPurchaseStatus(v as PurchaseStatus);
                setPage(1);
              }}
            >
              <SelectTrigger id="purchaseStatus" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PURCHASE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[160px] flex-1 sm:flex-none sm:w-44">
            <Label htmlFor="customerType" className="text-sm font-medium">
              Tipo de cliente
            </Label>
            <Select
              value={customerType}
              onValueChange={(v) => {
                setCustomerType(v as CustomerTypeFilter);
                setPage(1);
              }}
            >
              <SelectTrigger id="customerType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMER_TYPE_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  /* Mobile: card list */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && customers.length === 0 && <EmptyState />}
      {customers.map((c) => (
        <CustomerCard key={c.id} customer={c} onEdit={() => handleEdit(c)} />
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
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[240px]">Cliente</TableHead>
              <TableHead className="w-[130px]">CPF/CNPJ</TableHead>
              <TableHead className="w-[120px]">Telefone</TableHead>
              <TableHead className="w-[110px]">Tipo</TableHead>
              <TableHead className="w-[90px]">Cadastro</TableHead>
              <TableHead className="w-[160px]">Última Compra</TableHead>
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
            Página {page} de {totalPages} • {total} cliente
            {total !== 1 ? "s" : ""}
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
      {filtersSection}
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
