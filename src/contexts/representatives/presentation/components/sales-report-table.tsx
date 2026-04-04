"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Banknote,
  Barcode,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  QrCode,
  ShoppingCart,
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SalesReportOrder } from "../../domain/entities/sales-report";
import type { LucideIcon } from "lucide-react";
import { OrderStatusBadge } from "@/shared/presentation/components/order-status-badge";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

/* ─── Representative Commission Status ─── */
type CommissionStatus = "PENDING" | "PAID" | "CANCELLED";

const COMMISSION_STATUS_CONFIG: Record<
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

function RepresentativeCommissionStatusBadge({ status }: { status: CommissionStatus | null }) {
  if (!status) return <span className="text-muted-foreground text-sm">—</span>;
  const config = COMMISSION_STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-medium text-xs", config.className)}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

/* ─── Mobile Card ─── */
function OrderCard({
  order,
}: {
  order: SalesReportOrder;
}) {
  const router = useRouter();
  function handleClick() {
    router.push(`/dashboard/orders?orderId=${order.id}`);
  }

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-mono font-bold text-sm">#{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            {order.representativeCommissionStatus && (
              <RepresentativeCommissionStatusBadge status={order.representativeCommissionStatus} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span>{order.customerName}</span>
          {order.representativeName && <span>{order.representativeName}</span>}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Pagamento</p>
            <p className="font-medium">
              {order.paymentMethod ? <PaymentMethodLabel method={order.paymentMethod} /> : "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Total</p>
            <p className="font-semibold text-bee-gold">{formatCurrency(order.totalAmount + (order.shippingPrice ?? 0))}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Comissão Rep.</p>
            <p className="font-semibold text-bee-gold">
              {order.representativeCommissionAmount != null ? formatCurrency(order.representativeCommissionAmount) : "—"}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs gap-2"
          onClick={handleClick}
        >
          Ver pedido
          <ExternalLink className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function OrderRow({
  order,
}: {
  order: SalesReportOrder;
}) {
  const router = useRouter();
  function handleClick() {
    router.push(`/dashboard/orders?orderId=${order.id}`);
  }

  return (
    <TableRow
      className="group cursor-pointer hover:bg-muted/50"
      onClick={handleClick}
    >
      <TableCell>
        <span className="font-mono font-bold text-sm">#{order.orderNumber}</span>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(order.createdAt)}
      </TableCell>
      <TableCell className="text-sm">{order.customerName}</TableCell>
      <TableCell className="text-sm">{order.representativeName ?? "—"}</TableCell>
      <TableCell className="text-sm">
        {order.paymentMethod ? <PaymentMethodLabel method={order.paymentMethod} /> : "—"}
      </TableCell>
      <TableCell className="text-sm font-semibold text-bee-gold">
        {formatCurrency(order.totalAmount + (order.shippingPrice ?? 0))}
      </TableCell>
      <TableCell className="text-sm">
        {order.representativeCommissionAmount != null ? formatCurrency(order.representativeCommissionAmount) : "—"}
      </TableCell>
      <TableCell>
        <RepresentativeCommissionStatusBadge status={order.representativeCommissionStatus} />
      </TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
    </TableRow>
  );
}

/* ─── Skeletons ─── */
function CardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-40" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
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
          {Array.from({ length: 9 }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum pedido encontrado</p>
      <p className="text-muted-foreground text-sm">
        Ajuste os filtros para encontrar pedidos de representantes.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar relatório</p>
      <p className="text-muted-foreground text-sm">Verifique sua conexão e tente novamente.</p>
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
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Página {page} de {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

/* ─── Main Component ─── */
interface SalesReportTableProps {
  orders: SalesReportOrder[];
  isLoading?: boolean;
  isError?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SalesReportTable({
  orders,
  isLoading,
  isError,
  page,
  totalPages,
  onPageChange,
}: SalesReportTableProps) {

  /* Mobile */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading && Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && orders.length === 0 && <EmptyState />}
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
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
            <TableHead className="w-[130px]">Pedido</TableHead>
            <TableHead className="w-[110px]">Data</TableHead>
            <TableHead className="w-[160px]">Cliente</TableHead>
            <TableHead className="w-[140px]">Representante</TableHead>
            <TableHead className="w-[100px]">Pagamento</TableHead>
            <TableHead className="w-[110px]">Total</TableHead>
            <TableHead className="w-[110px]">Comissão Rep.</TableHead>
            <TableHead className="w-[100px]">Status Comissão</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {isError && (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <h2 className="text-base font-semibold">Pedidos</h2>
      {mobileView}
      {desktopView}
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </>
  );
}
