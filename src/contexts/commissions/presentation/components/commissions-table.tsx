"use client";

import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Ticket,
  User,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CommissionOrder, CommissionStatus } from "../../domain/entities/commission";

const STATUS_CONFIG: Record<
  CommissionStatus,
  { label: string; icon: typeof Clock; className: string }
> = {
  PENDING: {
    label: "Pendente",
    icon: Clock,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  PAID: {
    label: "Pago",
    icon: CheckCircle,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  CANCELLED: {
    label: "Cancelado",
    icon: XCircle,
    className: "bg-red-100 text-red-800 border-red-200",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: CommissionStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium", config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

/* ─── Actions Dropdown ─── */
function CommissionActions({
  order,
  onMarkPaid,
  onCancel,
  isMarkPending,
  isCancelPending,
}: {
  order: CommissionOrder;
  onMarkPaid: (order: CommissionOrder) => void;
  onCancel: (order: CommissionOrder) => void;
  isMarkPending: boolean;
  isCancelPending: boolean;
}) {
  if (order.commissionStatus !== "PENDING") return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          disabled={isMarkPending || isCancelPending}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={() => onMarkPaid(order)}
          disabled={isMarkPending}
        >
          <CheckCircle className="mr-2 h-3.5 w-3.5" />
          Marcar pago
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onCancel(order)}
          disabled={isCancelPending}
          className="text-destructive focus:text-destructive"
        >
          <XCircle className="mr-2 h-3.5 w-3.5" />
          Cancelar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ─── Mobile Card ─── */
function CommissionCard({
  order,
  onMarkPaid,
  onCancel,
  isMarkPending,
  isCancelPending,
}: {
  order: CommissionOrder;
  onMarkPaid: (order: CommissionOrder) => void;
  onCancel: (order: CommissionOrder) => void;
  isMarkPending: boolean;
  isCancelPending: boolean;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.commissionStatus!} />
            <CommissionActions
              order={order}
              onMarkPaid={onMarkPaid}
              onCancel={onCancel}
              isMarkPending={isMarkPending}
              isCancelPending={isCancelPending}
            />
          </div>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span className="font-medium">{order.customerName}</span>
        </div>

        {/* Coupon */}
        {order.couponCode && (
          <div className="flex items-center gap-1.5 text-sm">
            <Ticket className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-mono">{order.couponCode}</span>
          </div>
        )}

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Valor original</p>
            <p className="font-medium">{formatCurrency(order.totalAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Valor líquido</p>
            <p className="font-medium">{formatCurrency(order.discountedAmount)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">% Comissão</p>
            <p className="font-medium">
              {order.commissionRate ? `${order.commissionRate}%` : "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Vl. Comissão</p>
            <p className="font-semibold text-bee-gold">
              {formatCurrency(order.commissionAmount)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Data</p>
            <p className="font-medium flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(order.orderCreatedAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function CommissionRow({
  order,
  onMarkPaid,
  onCancel,
  isMarkPending,
  isCancelPending,
  showActions,
}: {
  order: CommissionOrder;
  onMarkPaid: (order: CommissionOrder) => void;
  onCancel: (order: CommissionOrder) => void;
  isMarkPending: boolean;
  isCancelPending: boolean;
  showActions: boolean;
}) {
  return (
    <TableRow className="group">
      <TableCell>
        <span className="font-mono font-bold text-sm">{order.orderNumber}</span>
      </TableCell>
      <TableCell>
        <p className="text-sm font-medium">{order.customerName}</p>
      </TableCell>
      <TableCell>
        {order.couponCode ? (
          <span className="font-mono text-sm">{order.couponCode}</span>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-medium">{formatCurrency(order.discountedAmount)}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-sm font-medium">
          {order.commissionRate ? `${order.commissionRate}%` : "—"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className="font-semibold text-bee-gold">
          {formatCurrency(order.commissionAmount)}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          {formatDate(order.orderCreatedAt)}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={order.commissionStatus!} />
      </TableCell>
      {showActions && (
        <TableCell className="text-right">
          <CommissionActions
            order={order}
            onMarkPaid={onMarkPaid}
            onCancel={onCancel}
            isMarkPending={isMarkPending}
            isCancelPending={isCancelPending}
          />
        </TableCell>
      )}
    </TableRow>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <DollarSign className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhuma comissão encontrada</p>
      <p className="text-muted-foreground text-sm">
        Ajuste os filtros ou aguarde novas vendas com cupom.
      </p>
    </div>
  );
}

/* ─── Pagination ─── */
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

/* ─── Main Component ─── */
interface CommissionsTableProps {
  orders: CommissionOrder[];
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  onMarkPaid: (order: CommissionOrder) => void;
  onCancel: (order: CommissionOrder) => void;
  isMarkPending: boolean;
  isCancelPending: boolean;
}

export function CommissionsTable({
  orders,
  totalPages,
  page,
  onPageChange,
  isLoading,
  isError,
  onMarkPaid,
  onCancel,
  isMarkPending,
  isCancelPending,
}: CommissionsTableProps) {
  const hasPendingOrders = orders.some((o) => o.commissionStatus === "PENDING");
  const colCount = hasPendingOrders ? 10 : 9;

  /* Mobile: card list */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          Carregando...
        </div>
      )}
      {isError && (
        <div className="text-center py-8 text-destructive">
          Erro ao carregar comissões
        </div>
      )}
      {!isLoading && !isError && orders.length === 0 && <EmptyState />}
      {orders.map((order) => (
        <CommissionCard
          key={order.orderId}
          order={order}
          onMarkPaid={onMarkPaid}
          onCancel={onCancel}
          isMarkPending={isMarkPending}
          isCancelPending={isCancelPending}
        />
      ))}
    </div>
  );

  /* Desktop: table */
  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">Pedido</TableHead>
            <TableHead className="w-[180px]">Cliente</TableHead>
            <TableHead className="w-[120px]">Cupom</TableHead>
            <TableHead className="w-[100px] text-right">Original</TableHead>
            <TableHead className="w-[100px] text-right">Líquido</TableHead>
            <TableHead className="w-[70px] text-right">Taxa</TableHead>
            <TableHead className="w-[100px] text-right">Comissão</TableHead>
            <TableHead className="w-[110px]">Data</TableHead>
            <TableHead className="w-[110px]">Status</TableHead>
            {hasPendingOrders && (
              <TableHead className="w-[50px] text-right">Ações</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={colCount} className="text-center">
                <div className="py-8 text-muted-foreground">Carregando...</div>
              </TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={colCount} className="text-center">
                <div className="py-8 text-destructive">Erro ao carregar comissões</div>
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={colCount} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <CommissionRow
              key={order.orderId}
              order={order}
              onMarkPaid={onMarkPaid}
              onCancel={onCancel}
              isMarkPending={isMarkPending}
              isCancelPending={isCancelPending}
              showActions={hasPendingOrders}
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
      {!isLoading && !isError && orders.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
