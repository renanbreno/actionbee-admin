"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Banknote,
  Barcode,
  Briefcase,
  CalendarDays,
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  Gift,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  QrCode,
  Truck,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { OrderBonusItem, OrderDetail, OrderStatus } from "../../domain/entities/order";
import { useOrderDetail } from "../hooks/use-order-detail";
import { useCreateShipment } from "../hooks/use-create-shipment";
import { useGetShipmentLabel } from "../hooks/use-get-shipment-label";

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  WAITING: "Aguardando pagamento",
  IN_ANALYSIS: "Em análise",
  AUTHORIZED: "Autorizado",
  PAID: "Pago",
  DECLINED: "Recusado",
  CANCELED: "Cancelado",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  WAITING: "bg-yellow-100 text-yellow-800 border-yellow-300",
  IN_ANALYSIS: "bg-blue-100 text-blue-800 border-blue-300",
  AUTHORIZED: "bg-teal-100 text-teal-800 border-teal-300",
  PAID: "bg-green-100 text-green-800 border-green-300",
  DECLINED: "bg-red-100 text-red-800 border-red-300",
  CANCELED: "bg-gray-100 text-gray-600 border-gray-300",
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pendente", className: "bg-amber-100 text-amber-800 border-amber-200" },
  CONFIRMED: { label: "Confirmado", className: "bg-blue-100 text-blue-800 border-blue-200" },
  SHIPPED: { label: "Enviado", className: "bg-purple-100 text-purple-800 border-purple-200" },
  DELIVERED: { label: "Entregue", className: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  CANCELLED: { label: "Cancelado", className: "bg-red-100 text-red-800 border-red-200" },
};

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.substring(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const PAYMENT_METHOD_CONFIG: Record<string, { label: string; icon: LucideIcon }> = {
  CASH: { label: "Dinheiro", icon: Banknote },
  PIX: { label: "Pix", icon: QrCode },
  CREDIT_CARD: { label: "Cartão de Crédito", icon: CreditCard },
  DEBIT_CARD: { label: "Cartão de Débito", icon: CreditCard },
  BOLETO: { label: "Boleto", icon: Barcode },
};


function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </div>
  );
}

function OrderDetailContent({ order }: { order: OrderDetail }) {
  const statusConfig = STATUS_CONFIG[order.status as OrderStatus] ?? {
    label: order.status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };
  const { mutate: createShipment, isPending: isCreatingShipment } = useCreateShipment();
  const { openLabel, isPending: isLoadingLabel } = useGetShipmentLabel();
  const canCreateShipment =
    order.status === "CONFIRMED" &&
    !order.meShipmentId &&
    order.shippingInfo.carrier !== "ADMIN";

  return (
    <div className="space-y-6 pb-6">
      {/* Header Info */}
      <Section title="Informações do Pedido">
        <div className="rounded-lg border bg-muted/30 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono font-bold">{order.orderNumber}</span>
            </div>
            <Badge
              variant="outline"
              className={cn("font-medium text-xs", statusConfig.className)}
            >
              {statusConfig.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(order.orderDate ?? order.createdAt)}
          </div>
          <Separator />
          <div className="flex items-center gap-2 text-sm">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
            </div>
          </div>
          {order.representativeName && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Representante: <span className="font-medium text-foreground">{order.representativeName}</span>
              </span>
            </div>
          )}
          {order.vendedorName && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Vendedor: <span className="font-medium text-foreground">{order.vendedorName}</span>
              </span>
            </div>
          )}
        </div>
      </Section>

      {/* Pagamento */}
      {order.paymentMethod && (
        <Section title="Pagamento">
          {order.paymentStatus && (
            <div className="mb-2">
              <Badge
                className={`text-xs border ${PAYMENT_STATUS_COLORS[order.paymentStatus] ?? "bg-gray-100 text-gray-600 border-gray-300"}`}
              >
                {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
              </Badge>
            </div>
          )}
          <div className="rounded-lg border bg-card p-4 space-y-2 text-sm">
            {order.payments && order.payments.length > 0
              ? order.payments.map((payment, i) => {
                  const config = PAYMENT_METHOD_CONFIG[payment.paymentMethod];
                  const Icon = config?.icon ?? CreditCard;
                  const label = config?.label ?? payment.paymentMethod;
                  return (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{label}</span>
                      </div>
                      <span className="font-semibold tabular-nums">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  );
                })
              : order.paymentMethod
                  .split(",")
                  .map((m) => m.trim())
                  .filter(Boolean)
                  .map((method) => {
                    const config = PAYMENT_METHOD_CONFIG[method];
                    const Icon = config?.icon ?? CreditCard;
                    const label = config?.label ?? method;
                    return (
                      <div key={method} className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="font-medium">{label}</span>
                      </div>
                    );
                  })}
          </div>
        </Section>
      )}

      {/* Items */}
      <Section title="Itens">
        <div className="space-y-2">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border bg-card p-4 text-sm"
            >
              <div className="flex-1">
                <p className="font-medium">{item.productName}</p>
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <p className="text-xs text-muted-foreground">{item.variantName} × {item.quantity}</p>
                  {item.priceType === "RETAILER" && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-400">
                      Lojista
                    </span>
                  )}
                  {item.priceType === "DISTRIBUTOR" && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-400">
                      Distribuidor
                    </span>
                  )}
                </div>
                {item.originalPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground line-through">
                      de {formatCurrency(item.originalPrice)}
                    </span>
                    <span className="text-xs font-semibold text-green-600">
                      por {formatCurrency(item.unitPrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(item.unitPrice)} un.
                  </span>
                )}
              </div>
              <div className="text-right ml-4">
                {item.originalPrice && (
                  <p className="text-xs text-muted-foreground line-through">
                    {formatCurrency(item.originalPrice * item.quantity)}
                  </p>
                )}
                <span className={[
                  "font-semibold",
                  item.originalPrice ? "text-green-600" : ""
                ].join(" ")}>
                  {formatCurrency(item.totalPrice)}
                </span>
              </div>
            </div>
          ))}
          <div className="rounded-lg bg-muted/50 p-4 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
            {order.shippingInfo.price > 0 ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>{formatCurrency(order.shippingInfo.price)}</span>
              </div>
            ) : order.shippingInfo.carrier ? (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-emerald-600 font-medium">Grátis</span>
              </div>
            ) : null}
            {order.totalAmount > order.discountedAmount && (
              <div className="flex justify-between text-emerald-600">
                <span>
                  {order.couponCode ? `Desconto (${order.couponCode})` : "Desconto"}
                </span>
                <span>-{formatCurrency(order.totalAmount - order.discountedAmount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-bee-gold">{formatCurrency(order.discountedAmount + order.shippingInfo.price)}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Shipping Address */}
      {order.shippingAddress.street && (
        <Section title="Endereço de Entrega">
          <div className="rounded-lg border bg-card p-4 text-sm space-y-1">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p>
                  {order.shippingAddress.street}, {order.shippingAddress.number}
                  {order.shippingAddress.complement &&
                    ` - ${order.shippingAddress.complement}`}
                </p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.neighborhood}, {order.shippingAddress.city} -{" "}
                  {order.shippingAddress.state}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.zipCode}</p>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Shipping Info */}
      {order.shippingInfo.carrier !== "ADMIN" && (
        <Section title="Entrega">
          <div className="rounded-lg border bg-card p-4 text-sm space-y-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {order.shippingInfo.carrier} — {order.shippingInfo.service}
              </span>
            </div>
            {order.shippingInfo.trackingCode && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Código de Rastreio</p>
                <p className="font-mono font-medium">{order.shippingInfo.trackingCode}</p>
                {order.shippingInfo.trackingUrl && (
                  <a
                    href={order.shippingInfo.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Rastrear envio →
                  </a>
                )}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Melhor Envio */}
      {order.shippingInfo.carrier !== "ADMIN" && order.shippingInfo.carrier !== "Entrega Local" && (
        <Section title="Envio">
          <div className="rounded-lg border bg-card p-4 space-y-3 text-sm">
            {order.meShipmentId ? (
              <>
                <div className="flex items-center gap-2 text-emerald-600">
                  <Package className="h-4 w-4 shrink-0" />
                  <span className="font-medium">Etiqueta gerada</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => openLabel(order.id)}
                  disabled={isLoadingLabel}
                >
                  {isLoadingLabel ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  {isLoadingLabel ? "Carregando..." : "Imprimir etiqueta"}
                </Button>
              </>
            ) : (
              <>
                {canCreateShipment ? (
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => createShipment(order.id)}
                    disabled={isCreatingShipment}
                  >
                    {isCreatingShipment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Truck className="h-4 w-4" />
                    )}
                    {isCreatingShipment ? "Gerando etiqueta..." : "Gerar etiqueta Melhor Envio"}
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {order.status !== "CONFIRMED"
                      ? "Pedido precisa estar Confirmado para gerar etiqueta."
                      : "Etiqueta ainda não gerada."}
                  </p>
                )}
              </>
            )}
          </div>
        </Section>
      )}

      {/* Gifts */}
      {order.gifts.length > 0 && (
        <Section title="Brindes">
          <div className="space-y-2">
            {order.gifts.map((gift, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border bg-card p-4 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-bee-gold shrink-0" />
                  <span>{gift.giftName}{gift.quantity > 1 ? ` x${gift.quantity}` : ''}</span>
                </div>
                {gift.unitCost !== undefined && (
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-xs text-muted-foreground">custo un.</p>
                    <p className="font-medium tabular-nums">{formatCurrency(gift.unitCost)}</p>
                    {gift.quantity > 1 && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        total: {formatCurrency(gift.unitCost * gift.quantity)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {(() => {
              const totalGiftCost = order.gifts
                .filter((g) => g.unitCost !== undefined)
                .reduce((sum, g) => sum + g.unitCost! * g.quantity, 0);
              return totalGiftCost > 0 ? (
                <div className="rounded-lg bg-bee-gold/10 border border-bee-gold/30 p-3 flex justify-between text-sm">
                  <span className="text-foreground/80 font-medium text-xs">Custo total em brindes</span>
                  <span className="font-semibold tabular-nums text-xs">{formatCurrency(totalGiftCost)}</span>
                </div>
              ) : null;
            })()}
          </div>
        </Section>
      )}

      {/* Bonus Items */}
      {order.bonusItems && order.bonusItems.length > 0 && (
        <Section title="Bonificações">
          <div className="space-y-2">
            {order.bonusItems.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border bg-card p-4 text-sm"
              >
                <div className="flex items-start gap-2 flex-1">
                  <Package className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variantName} × {item.quantity}
                    </p>
                  </div>
                </div>
                {item.unitCost !== undefined && (
                  <div className="text-right ml-4">
                    <p className="text-xs text-muted-foreground">custo un.</p>
                    <p className="font-medium tabular-nums">{formatCurrency(item.unitCost)}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground tabular-nums">
                        total: {formatCurrency(item.unitCost * item.quantity)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {(() => {
              const totalBonusCost = order.bonusItems!
                .filter((i) => i.unitCost !== undefined)
                .reduce((sum, i) => sum + i.unitCost! * i.quantity, 0);
              return totalBonusCost > 0 ? (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-3 flex justify-between text-sm">
                  <span className="text-amber-800 dark:text-amber-400 font-medium text-xs">Custo total em bonificações</span>
                  <span className="font-semibold text-amber-800 dark:text-amber-400 tabular-nums text-xs">
                    {formatCurrency(totalBonusCost)}
                  </span>
                </div>
              ) : null;
            })()}
          </div>
        </Section>
      )}

      {/* Checkout Payment Link (PIX, Credit Card, Debit Card) */}
      {order.paymentLink && (
        <Section title="Link de Pagamento">
          <div className="rounded-lg border bg-card p-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ExternalLink className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">Link de Pagamento</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Compartilhe este link com o cliente - ele poderá escolher entre PIX, Cartão de Crédito ou Cartão de Débito</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 min-w-0 break-all rounded bg-muted px-2 py-1.5 text-xs font-mono">
                  {order.paymentLink}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => navigator.clipboard.writeText(order.paymentLink!)}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => window.open(order.paymentLink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Section>
      )}

      {/* Boleto */}
      {(order.boletoBarcode || order.boletoPdfUrl) && (
        <Section title="Boleto">
          <div className="rounded-lg border bg-card p-4 space-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Barcode className="h-4 w-4 shrink-0" />
              <span className="font-medium text-foreground">Boleto Bancário</span>
            </div>
            {order.boletoDueDate && (
              <p className="text-xs text-muted-foreground">
                Vencimento:{" "}
                <span className="font-medium text-foreground">
                  {new Date(order.boletoDueDate).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </p>
            )}
            {order.boletoBarcode && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Código de barras</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 min-w-0 break-all rounded bg-muted px-2 py-1.5 text-xs font-mono">
                    {order.boletoBarcode}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => navigator.clipboard.writeText(order.boletoBarcode!)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
            {order.boletoPdfUrl && (
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => window.open(order.boletoPdfUrl, "_blank")}
              >
                <Download className="h-4 w-4" />
                Baixar Boleto
              </Button>
            )}
          </div>
        </Section>
      )}

      {/* Observações */}
      {order.notes && (
        <Section title="Observações">
          <div className="rounded-lg border bg-card p-4 text-sm">
            <div className="flex items-start gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="whitespace-pre-wrap text-foreground">{order.notes}</p>
            </div>
          </div>
        </Section>
      )}

      {/* Status History */}
      {order.statusHistory.length > 0 && (
        <Section title="Histórico de Status">
          <div className="space-y-2">
            {order.statusHistory.map((entry, i) => {
              const config = STATUS_CONFIG[entry.status as OrderStatus] ?? {
                label: entry.status,
                className: "bg-gray-100 text-gray-800 border-gray-200",
              };
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border bg-card p-4 text-sm"
                >
                  <Badge variant="outline" className={cn("font-medium text-xs", config.className)}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(entry.changedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        </Section>
      )}

    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6 pb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface OrderDetailSheetProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailSheet({ orderId, open, onOpenChange }: OrderDetailSheetProps) {
  const { data: order, isLoading, isError } = useOrderDetail(orderId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto px-7"
        >
          <SheetHeader className="mb-0 flex flex-row items-center justify-between gap-2">
            <SheetTitle className="text-center flex-1">Detalhe do Pedido</SheetTitle>
          </SheetHeader>

          {isLoading && <DetailSkeleton />}
          {isError && (
            <div className="text-center py-8 text-destructive">
              Erro ao carregar detalhes do pedido
            </div>
          )}
          {order && <OrderDetailContent order={order} />}
        </SheetContent>
      </Sheet>
  );
}
