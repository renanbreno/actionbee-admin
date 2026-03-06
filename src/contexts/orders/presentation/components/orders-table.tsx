"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Barcode,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  MoreHorizontal,
  Package,
  QrCode,
  RefreshCw,
  Ticket,
  User,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OrderListItem, OrderStatus } from "../../domain/entities/order";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  CONFIRMED: {
    label: "Confirmado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  SHIPPED: {
    label: "Enviado",
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
  DELIVERED: {
    label: "Entregue",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

const TERMINAL_STATUSES: OrderStatus[] = ["DELIVERED", "CANCELLED"];

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Dinheiro",
  PIX: "Pix",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  BOLETO: "Boleto",
};

const PAYMENT_METHOD_ICONS: Record<string, LucideIcon> = {
  CASH: Banknote,
  PIX: QrCode,
  CREDIT_CARD: CreditCard,
  DEBIT_CARD: CreditCard,
  BOLETO: Barcode,
};

function PaymentMethodIcon({ method }: { method: string }) {
  const Icon = PAYMENT_METHOD_ICONS[method];
  const label = PAYMENT_METHOD_LABELS[method] ?? method;
  if (!Icon) return <span className="text-xs text-muted-foreground">{label}</span>;
  return (
    <span title={label}>
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
    </span>
  );
}

function PaymentMethodLabel({ method }: { method: string }) {
  const methods = method.split(",").map((m) => m.trim()).filter(Boolean);
  return (
    <span className="flex items-center gap-1.5">
      {methods.map((m) => (
        <PaymentMethodIcon key={m} method={m} />
      ))}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };
  return (
    <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}

function OrderActions({
  order,
  onViewDetail,
  onUpdateStatus,
  onCancel,
}: {
  order: OrderListItem;
  onViewDetail: (order: OrderListItem) => void;
  onUpdateStatus: (order: OrderListItem) => void;
  onCancel: (order: OrderListItem) => void;
}) {
  const isTerminal = TERMINAL_STATUSES.includes(order.status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onViewDetail(order)}>
          <Eye className="mr-2 h-3.5 w-3.5" />
          Ver detalhes
        </DropdownMenuItem>
        {!isTerminal && (
          <DropdownMenuItem onClick={() => onUpdateStatus(order)}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Atualizar status
          </DropdownMenuItem>
        )}
        {!isTerminal && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onCancel(order)}
              className="text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-3.5 w-3.5" />
              Cancelar pedido
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function OrderCard({
  order,
  onViewDetail,
  onUpdateStatus,
  onCancel,
}: {
  order: OrderListItem;
  onViewDetail: (order: OrderListItem) => void;
  onUpdateStatus: (order: OrderListItem) => void;
  onCancel: (order: OrderListItem) => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status} />
            <OrderActions
              order={order}
              onViewDetail={onViewDetail}
              onUpdateStatus={onUpdateStatus}
              onCancel={onCancel}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{order.customerName}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Valor</p>
            <div className="flex items-center gap-1.5">
              {order.couponCode && (
                <Ticket className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              )}
              <div>
                <p className="font-semibold text-bee-gold">{formatCurrency(order.discountedAmount)}</p>
                {order.totalAmount !== order.discountedAmount && (
                  <p className="text-xs text-muted-foreground line-through">{formatCurrency(order.totalAmount)}</p>
                )}
              </div>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Pagamento</p>
            <p className="font-medium">
              <PaymentMethodLabel method={order.paymentMethod} />
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Itens</p>
            <p className="font-medium">{order.itemsCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Data</p>
            <p className="font-medium flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderRow({
  order,
  onViewDetail,
  onUpdateStatus,
  onCancel,
}: {
  order: OrderListItem;
  onViewDetail: (order: OrderListItem) => void;
  onUpdateStatus: (order: OrderListItem) => void;
  onCancel: (order: OrderListItem) => void;
}) {
  return (
    <TableRow className="group">
      <TableCell>
        <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-sm">{order.customerName}</p>
          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {order.couponCode && (
            <Ticket className="h-4 w-4 text-emerald-600" />
          )}
          <div>
            <p className="font-semibold text-bee-gold">{formatCurrency(order.discountedAmount)}</p>
            {order.totalAmount !== order.discountedAmount && (
              <p className="text-xs text-muted-foreground line-through">
                {formatCurrency(order.totalAmount)}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <PaymentMethodLabel method={order.paymentMethod} />
      </TableCell>
      <TableCell>
        <StatusBadge status={order.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          {formatDate(order.createdAt)}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <OrderActions
          order={order}
          onViewDetail={onViewDetail}
          onUpdateStatus={onUpdateStatus}
          onCancel={onCancel}
        />
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <>
      {/* Mobile skeletons */}
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="space-y-3 p-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-36" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Desktop skeletons */}
      <div className="hidden md:block rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <Package className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum pedido encontrado</p>
      <p className="text-muted-foreground text-sm">
        Ajuste os filtros ou crie um novo pedido.
      </p>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>
      <span className="text-sm text-muted-foreground tabular-nums px-2">
        {page} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="gap-1"
      >
        <span className="hidden sm:inline">Próxima</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

interface OrdersTableProps {
  orders: OrderListItem[];
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onViewDetail: (order: OrderListItem) => void;
  onUpdateStatus: (order: OrderListItem) => void;
  onCancel: (order: OrderListItem) => void;
}

export function OrdersTable({
  orders,
  totalPages,
  page,
  onPageChange,
  isLoading,
  isError,
  onViewDetail,
  onUpdateStatus,
  onCancel,
}: OrdersTableProps) {
  if (isLoading) return <TableSkeleton />;

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isError && (
        <div className="text-center py-8 text-destructive">
          Erro ao carregar pedidos
        </div>
      )}
      {!isError && orders.length === 0 && <EmptyState />}
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewDetail={onViewDetail}
          onUpdateStatus={onUpdateStatus}
          onCancel={onCancel}
        />
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[130px]">Pedido</TableHead>
            <TableHead className="w-[200px]">Cliente</TableHead>
            <TableHead className="w-[120px] text-right">Valor</TableHead>
            <TableHead className="w-[130px]">Pagamento</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[130px]">Data</TableHead>
            <TableHead className="w-[60px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <div className="py-8 text-destructive">Erro ao carregar pedidos</div>
              </TableCell>
            </TableRow>
          )}
          {!isError && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onViewDetail={onViewDetail}
              onUpdateStatus={onUpdateStatus}
              onCancel={onCancel}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
      {!isError && orders.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </>
  );
}
