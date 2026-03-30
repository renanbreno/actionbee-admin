"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  ShoppingCart,
  Briefcase,
  CheckSquare,
  MessageSquare,
  Calendar,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useCustomerDetails } from "../hooks/use-customer-details";
import { useOrders } from "@/contexts/orders/presentation/hooks/use-orders";
import { useAbandonedCarts } from "@/contexts/abandoned-carts/presentation/hooks/use-abandoned-carts";
import { useDeals } from "@/contexts/crm/presentation/hooks/use-deals";
import { useTasks } from "@/contexts/crm/presentation/hooks/use-tasks";
import { useInteractions } from "@/contexts/crm/presentation/hooks/use-interactions";
import { LifecycleStageBadge } from "./lifecycle-stage-badge";
import { CUSTOMER_TYPE_LABELS } from "../../domain/entities/customer";
import { formatPhone, formatDocument } from "@/shared/utils/masks";

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value?: number | null): string {
  if (value == null) return "—";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ─── Profile Tab ─── */
function ProfileTab({ customerId }: { customerId: string }) {
  const { data: customer, isLoading } = useCustomerDetails(customerId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
    );
  }

  if (!customer) return <p className="text-muted-foreground text-sm">Não foi possível carregar o perfil.</p>;

  const documentNumber = customer.cnpj
    ? formatDocument(customer.cnpj)
    : customer.cpf
      ? formatDocument(customer.cpf)
      : null;

  return (
    <div className="space-y-4">
      {/* Contact */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Contato</h4>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span>{customer.email || "—"}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{formatPhone(customer.phone)}</span>
            </div>
          )}
          {documentNumber && (
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{documentNumber}</span>
            </div>
          )}
          {customer.birthDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span>{formatDate(customer.birthDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Commercial */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Comercial</h4>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground min-w-[100px]">Tipo:</span>
            {customer.customerType ? (
              <span>{CUSTOMER_TYPE_LABELS[customer.customerType] ?? customer.customerType}</span>
            ) : <span className="text-muted-foreground">—</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground min-w-[100px]">Total de pedidos:</span>
            <span>{customer.ordersCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground min-w-[100px]">Último pedido:</span>
            <span>{formatDate(customer.lastOrderDate)}</span>
          </div>
          {customer.representativeName && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground min-w-[100px]">Representante:</span>
              <span>{customer.representativeName}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground min-w-[100px]">Cadastro:</span>
            <span>{formatDate(customer.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Address */}
      {customer.address && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">Endereço</h4>
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <span>
              {customer.address.street}, {customer.address.number}
              {customer.address.complement && ` - ${customer.address.complement}`},{" "}
              {customer.address.neighborhood}, {customer.address.city}/{customer.address.state} — CEP {customer.address.zipCode}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Orders Tab ─── */
function OrdersTab({ customerId }: { customerId: string }) {
  const { data, isLoading } = useOrders({
    page: 1,
    limit: 10,
    customerId,
  });

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>;

  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
        <Package className="h-7 w-7 opacity-40" />
        <p className="text-sm">Nenhum pedido encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border px-3 py-2.5 text-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">#{order.orderNumber}</span>
            <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDate(order.createdAt)}</span>
            <span>·</span>
            <span>{order.itemsCount} {order.itemsCount === 1 ? "item" : "itens"}</span>
            <span>·</span>
            <span>{order.status}</span>
          </div>
        </div>
      ))}
      {(data?.totalPages ?? 1) > 1 && (
        <p className="text-xs text-muted-foreground text-center pt-1">Mostrando 10 de {data?.total} pedidos</p>
      )}
    </div>
  );
}

/* ─── Carts Tab ─── */
function CartsTab({ customerId }: { customerId: string }) {
  const { data, isLoading } = useAbandonedCarts({
    page: 1,
    limit: 5,
    customerId,
  });

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>;

  const carts = data?.abandonedCarts ?? [];

  if (carts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
        <ShoppingCart className="h-7 w-7 opacity-40" />
        <p className="text-sm">Nenhum carrinho abandonado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {carts.map((cart) => (
        <div key={cart.id} className="rounded-lg border px-3 py-2.5 text-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{cart.checkoutStep}</span>
            <span className="font-semibold text-amber-600">{formatCurrency(cart.cartValue)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Abandonado: {formatDate(cart.abandonedAt)}</span>
            <span>·</span>
            <span>{cart.itemsCount} {cart.itemsCount === 1 ? "item" : "itens"}</span>
            {cart.notificationCount > 0 && (
              <>
                <span>·</span>
                <span>{cart.notificationCount} notif.</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── CRM Tab ─── */
function CrmTab({ customerId }: { customerId: string }) {
  const { data: dealsData, isLoading: dealsLoading } = useDeals(1, 5, { customerId });
  const { data: tasksData, isLoading: tasksLoading } = useTasks(1, 5, { customerId });
  const { data: interactionsData, isLoading: interactionsLoading } = useInteractions(1, 5, { customerId });

  const deals = dealsData?.items ?? [];
  const tasks = tasksData?.items ?? [];
  const interactions = interactionsData?.items ?? [];

  const isLoading = dealsLoading || tasksLoading || interactionsLoading;

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>;

  return (
    <div className="space-y-5">
      {/* Deals */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Negócios ({dealsData?.total ?? 0})</h4>
        </div>
        {deals.length === 0 ? (
          <p className="text-xs text-muted-foreground pl-6">Nenhum negócio.</p>
        ) : (
          <div className="space-y-1.5 pl-6">
            {deals.map((deal) => (
              <div key={deal.id} className="rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{deal.title}</span>
                  {deal.estimatedValue != null && (
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">{formatCurrency(deal.estimatedValue)}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{deal.pipelineName} › {deal.stageName}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Tarefas ({tasksData?.total ?? 0})</h4>
        </div>
        {tasks.length === 0 ? (
          <p className="text-xs text-muted-foreground pl-6">Nenhuma tarefa.</p>
        ) : (
          <div className="space-y-1.5 pl-6">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-1 py-0">{task.status}</Badge>
                  <span className="font-medium truncate">{task.title}</span>
                </div>
                {task.dueDate && (
                  <p className="text-xs text-muted-foreground">Prazo: {formatDate(task.dueDate)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactions */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-semibold">Interações ({interactionsData?.total ?? 0})</h4>
        </div>
        {interactions.length === 0 ? (
          <p className="text-xs text-muted-foreground pl-6">Nenhuma interação.</p>
        ) : (
          <div className="space-y-1.5 pl-6">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="rounded-md border px-3 py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{interaction.type}</span>
                  {interaction.subject && <span className="font-medium truncate">{interaction.subject}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(interaction.occurredAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Sheet ─── */
interface Customer360SheetProps {
  customerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Customer360Sheet({ customerId, open, onOpenChange }: Customer360SheetProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const { data: customer } = useCustomerDetails(customerId);

  const documentNumber = customer?.cnpj
    ? formatDocument(customer.cnpj)
    : customer?.cpf
      ? formatDocument(customer.cpf)
      : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col overflow-hidden p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <SheetTitle className="text-lg leading-tight">
                {customer?.name ?? "—"}
              </SheetTitle>
              <SheetDescription className="text-sm truncate">
                {customer?.email ?? ""}
                {documentNumber && ` · ${documentNumber}`}
              </SheetDescription>
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                {customer?.lifecycleStage && (
                  <LifecycleStageBadge stage={customer.lifecycleStage} />
                )}
                {customer?.customerType && (
                  <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {CUSTOMER_TYPE_LABELS[customer.customerType] ?? customer.customerType}
                  </span>
                )}
                {customer?.ordersCount != null && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Package className="h-3 w-3" />
                    {customer.ordersCount} pedido{customer.ordersCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {customerId && (
          <div className="flex-1 overflow-y-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <div className="px-6 pt-4 border-b">
                <TabsList className="grid w-full grid-cols-4 h-9">
                  <TabsTrigger value="profile" className="text-xs">Perfil</TabsTrigger>
                  <TabsTrigger value="orders" className="text-xs">Pedidos</TabsTrigger>
                  <TabsTrigger value="carts" className="text-xs">Carrinhos</TabsTrigger>
                  <TabsTrigger value="crm" className="text-xs">CRM</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <TabsContent value="profile" className="m-0">
                  <ProfileTab customerId={customerId} />
                </TabsContent>
                <TabsContent value="orders" className="m-0">
                  <OrdersTab customerId={customerId} />
                </TabsContent>
                <TabsContent value="carts" className="m-0">
                  <CartsTab customerId={customerId} />
                </TabsContent>
                <TabsContent value="crm" className="m-0">
                  <CrmTab customerId={customerId} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
