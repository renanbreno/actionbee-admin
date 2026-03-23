"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Mail,
  MoreHorizontal,
  Phone,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AbandonedCart } from "../../domain/entities/abandoned-cart.entity";
import { CheckoutStepBadge } from "./checkout-step-badge";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "R$ 0,00";
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success(`${label} copiado`);
  });
}

function CartActions({ cart }: { cart: AbandonedCart }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => copyToClipboard(cart.customerEmail, "Email")}>
          <Copy className="mr-2 h-3.5 w-3.5" />
          Copiar email
        </DropdownMenuItem>
        {cart.customerPhone && (
          <DropdownMenuItem onClick={() => copyToClipboard(cart.customerPhone!, "Telefone")}>
            <Phone className="mr-2 h-3.5 w-3.5" />
            Copiar telefone
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/customers/${cart.customerId}`}>
            <ExternalLink className="mr-2 h-3.5 w-3.5" />
            Ver cliente
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CartCard({ cart }: { cart: AbandonedCart }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">{cart.customerName}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>{cart.customerEmail}</span>
            </div>
            {cart.customerPhone && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{cart.customerPhone}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <CheckoutStepBadge step={cart.checkoutStep} />
            <CartActions cart={cart} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Valor</p>
            <p className="font-semibold text-bee-gold">{formatCurrency(cart.cartValue)}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Itens</p>
            <p className="font-medium">{cart.itemsCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Abandonado em</p>
            <p className="font-medium flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(cart.abandonedAt)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Notificações</p>
            <p className="font-medium flex items-center gap-1">
              <Bell className="h-3 w-3" />
              {cart.notificationCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CartRow({ cart }: { cart: AbandonedCart }) {
  return (
    <TableRow className="group">
      <TableCell>
        <div>
          <p className="font-medium text-sm">{cart.customerName}</p>
          <p className="text-xs text-muted-foreground">{cart.customerEmail}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {cart.customerPhone ? (
            <>
              <Phone className="h-3.5 w-3.5" />
              <span>{cart.customerPhone}</span>
            </>
          ) : (
            <span className="text-muted-foreground/50">—</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <CheckoutStepBadge step={cart.checkoutStep} />
      </TableCell>
      <TableCell className="text-right">
        <p className="font-semibold text-bee-gold">{formatCurrency(cart.cartValue)}</p>
      </TableCell>
      <TableCell className="text-center">
        <p className="text-sm">{cart.itemsCount}</p>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          {formatDate(cart.abandonedAt)}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{cart.notificationCount}</span>
          {cart.lastNotifiedAt && (
            <span className="text-xs text-muted-foreground">
              ({formatDate(cart.lastNotifiedAt)})
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <CartActions cart={cart} />
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="space-y-3 p-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-40" />
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
      <div className="hidden md:block rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Cliente</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Step</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-center">Itens</TableHead>
              <TableHead>Abandonado em</TableHead>
              <TableHead>Notificações</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
      <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum carrinho abandonado encontrado</p>
      <p className="text-muted-foreground text-sm">
        Ajuste os filtros para ver outros resultados.
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

interface AbandonedCartsTableProps {
  carts: AbandonedCart[];
  totalPages: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
}

export function AbandonedCartsTable({
  carts,
  totalPages,
  page,
  onPageChange,
  isLoading,
  isError,
}: AbandonedCartsTableProps) {
  if (isLoading) return <TableSkeleton />;

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isError && (
        <div className="text-center py-8 text-destructive">
          Erro ao carregar carrinhos abandonados
        </div>
      )}
      {!isError && carts.length === 0 && <EmptyState />}
      {carts.map((cart) => (
        <CartCard key={cart.id} cart={cart} />
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[200px]">Cliente</TableHead>
            <TableHead className="w-[140px]">Telefone</TableHead>
            <TableHead className="w-[110px]">Step</TableHead>
            <TableHead className="w-[110px] text-right">Valor</TableHead>
            <TableHead className="w-[60px] text-center">Itens</TableHead>
            <TableHead className="w-[140px]">Abandonado em</TableHead>
            <TableHead className="w-[180px]">Notificações</TableHead>
            <TableHead className="w-[60px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isError && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <div className="py-8 text-destructive">Erro ao carregar carrinhos abandonados</div>
              </TableCell>
            </TableRow>
          )}
          {!isError && carts.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {carts.map((cart) => (
            <CartRow key={cart.id} cart={cart} />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
      {!isError && carts.length > 0 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </>
  );
}
