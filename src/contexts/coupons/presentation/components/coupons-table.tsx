"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAffiliates } from "@/contexts/affiliates/presentation/hooks/use-affiliates";
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
  Ban,
  Power,
  Ticket,
  AlertTriangle,
  Store,
  Sparkles,
  Package,
  ShoppingCart,
  CalendarDays,
  Infinity,
  ChevronLeft,
  ChevronRight,
  Hash,
  Trash2,
  User,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Coupon, CouponStatus, CouponType } from "../../domain/entities/coupon";
import { useCoupons } from "../hooks/use-coupons";
import { useActivateCoupon } from "../hooks/use-activate-coupon";
import { useDeactivateCoupon } from "../hooks/use-deactivate-coupon";
import { useDeleteCoupon } from "../hooks/use-delete-coupon";

const TYPE_CONFIG: Record<
  CouponType,
  { label: string; icon: typeof Store; className: string }
> = {
  STORE_WIDE: {
    label: "Loja toda",
    icon: Store,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  FIRST_PURCHASE: {
    label: "1ª compra",
    icon: Sparkles,
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  BY_PRODUCT: {
    label: "Produto",
    icon: Package,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  BY_CUSTOMER: {
    label: "Cliente",
    icon: ShoppingCart,
    className: "bg-purple-100 text-purple-800 border-purple-200",
  },
};

const STATUS_CONFIG: Record<
  CouponStatus,
  { label: string; dotClass: string; textClass: string; ping?: boolean }
> = {
  ACTIVE: {
    label: "Ativo",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
    ping: true,
  },
  INACTIVE: {
    label: "Inativo",
    dotClass: "bg-muted-foreground/30",
    textClass: "text-muted-foreground",
  },
  EXPIRED: {
    label: "Expirado",
    dotClass: "bg-red-400",
    textClass: "text-red-600",
  },
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
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

/* ─── Affiliate Badge ─── */
function AffiliateBadge({ coupon }: { coupon: Coupon }) {
  if (coupon.affiliate) {
    return (
      <div className="flex items-center gap-1.5 text-xs">
        <User className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium">{coupon.affiliate.name}</span>
        <span className="text-muted-foreground">({coupon.affiliate.commissionRate}%)</span>
      </div>
    );
  }
  if (coupon.affiliateId) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <User className="h-3 w-3" />
        <span>Afiliado</span>
      </div>
    );
  }
  return <span className="text-muted-foreground text-xs">—</span>;
}

/* ─── Status Badge ─── */
function StatusIndicator({ status }: { status: CouponStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        {config.ping && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              config.dotClass,
            )}
          />
        )}
        <span
          className={cn(
            "relative inline-flex h-2 w-2 rounded-full",
            config.dotClass,
          )}
        />
      </span>
      <span className={cn("text-sm font-medium", config.textClass)}>
        {config.label}
      </span>
    </div>
  );
}

/* ─── Actions Dropdown ─── */
function CouponActions({ coupon }: { coupon: Coupon }) {
  const activateMutation = useActivateCoupon();
  const deactivateMutation = useDeactivateCoupon();
  const deleteMutation = useDeleteCoupon();
  const isPending =
    activateMutation.isPending || deactivateMutation.isPending || deleteMutation.isPending;

  if (coupon.status === "EXPIRED") return null;

  const handleActivate = () => {
    activateMutation.mutate(coupon.code, {
      onSuccess: () => toast.success("Cupom ativado"),
      onError: () => toast.error("Erro ao ativar cupom"),
    });
  };

  const handleDeactivate = () => {
    deactivateMutation.mutate(coupon.code, {
      onSuccess: () => toast.success("Cupom desativado"),
      onError: () => toast.error("Erro ao desativar cupom"),
    });
  };

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir o cupom ${coupon.code}?`)) {
      deleteMutation.mutate(coupon.code, {
        onSuccess: () => toast.success("Cupom excluído"),
        onError: () => toast.error("Erro ao excluir cupom"),
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          disabled={isPending}
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {coupon.status === "INACTIVE" && (
          <DropdownMenuItem
            onClick={handleActivate}
            disabled={activateMutation.isPending}
          >
            <Power className="mr-2 h-3.5 w-3.5" />
            Ativar
          </DropdownMenuItem>
        )}
        {coupon.status === "ACTIVE" && (
          <DropdownMenuItem
            onClick={handleDeactivate}
            disabled={deactivateMutation.isPending}
          >
            <Ban className="mr-2 h-3.5 w-3.5" />
            Desativar
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
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
function CouponCard({ coupon }: { coupon: Coupon }) {
  const typeConfig = TYPE_CONFIG[coupon.type] ?? TYPE_CONFIG.STORE_WIDE;
  const TypeIcon = typeConfig.icon;

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn("gap-1.5 font-medium", typeConfig.className)}
            >
              <TypeIcon className="h-3 w-3" />
              {typeConfig.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status={coupon.status} />
            <CouponActions coupon={coupon} />
          </div>
        </div>

        {/* Code + Discount */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-base tracking-wider">
              {coupon.code}
            </span>
          </div>
          <Badge className="bg-bee-gold/15 text-amber-800 border-bee-gold/30 font-bold text-sm">
            {coupon.discountPercentage}% OFF
          </Badge>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {coupon.maxDiscountAmount && (
              <span>Máx: {formatCurrency(coupon.maxDiscountAmount)}</span>
            )}
            {coupon.minCartValue && (
              <span>Mín: {formatCurrency(coupon.minCartValue)}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {coupon.usedCount}/{coupon.usageLimit ?? "∞"}
            </div>
            {coupon.expiresAt ? (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {formatDate(coupon.expiresAt)}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Infinity className="h-3 w-3" />
                Sem expiração
              </div>
            )}
          </div>
          {/* Affiliate */}
          <div className="flex items-center gap-1 pt-1 border-t border-border/50">
            <User className="h-3 w-3 text-muted-foreground" />
            {coupon.affiliate ? (
              <span>
                <span className="font-medium text-foreground">{coupon.affiliate.name}</span>
                <span className="text-muted-foreground"> ({coupon.affiliate.commissionRate}% comissão)</span>
              </span>
            ) : coupon.affiliateId ? (
              <span className="text-muted-foreground">Afiliado vinculado</span>
            ) : (
              <span className="text-muted-foreground">Sem afiliado</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function CouponRow({ coupon }: { coupon: Coupon }) {
  const typeConfig = TYPE_CONFIG[coupon.type] ?? TYPE_CONFIG.STORE_WIDE;
  const TypeIcon = typeConfig.icon;

  return (
    <TableRow className="group">
      <TableCell>
        <span className="font-mono font-bold tracking-wider">
          {coupon.code}
        </span>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn("gap-1.5 font-medium", typeConfig.className)}
        >
          <TypeIcon className="h-3 w-3" />
          {typeConfig.label}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <span className="font-semibold">{coupon.discountPercentage}%</span>
        </div>
      </TableCell>
      <TableCell>
        <StatusIndicator status={coupon.status} />
      </TableCell>
      <TableCell className="text-sm">
        {coupon.usedCount}/{coupon.usageLimit ?? "∞"}
      </TableCell>
      <TableCell>
        {coupon.expiresAt ? (
          <div className="flex items-center gap-1.5 text-sm">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            {formatDate(coupon.expiresAt)}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Infinity className="h-3.5 w-3.5" />
            Ilimitado
          </div>
        )}
      </TableCell>
      <TableCell>
        <AffiliateBadge coupon={coupon} />
      </TableCell>
      <TableCell className="text-right">
        <CouponActions coupon={coupon} />
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
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-8 w-full" />
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
            <Skeleton className="h-5 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-12" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-32" />
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
      <Ticket className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum cupom cadastrado</p>
      <p className="text-muted-foreground text-sm">
        Crie seu primeiro cupom clicando no botão acima.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar cupons</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
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
interface CouponsTableProps {
  page: number;
  onPageChange: (page: number) => void;
  search?: string;
  status?: string;
  affiliateCategoryId?: string;
}

export function CouponsTable({ page, onPageChange, search, status, affiliateCategoryId }: CouponsTableProps) {
  const { data, isLoading, isError } = useCoupons(page, 10, search, status, affiliateCategoryId);
  const { data: affiliates } = useAffiliates();

  const totalPages = data?.totalPages ?? 1;

  // Enrich coupons with affiliate data when API only returns affiliateId
  const coupons = useMemo(() => {
    const raw = data?.coupons ?? [];
    if (!affiliates || affiliates.length === 0) return raw;

    const affiliateMap = new Map(affiliates.map((a) => [a.id, a]));
    return raw.map((coupon) => {
      if (coupon.affiliate || !coupon.affiliateId) return coupon;
      const aff = affiliateMap.get(coupon.affiliateId);
      if (!aff) return coupon;
      return {
        ...coupon,
        affiliate: {
          id: aff.id,
          name: aff.name,
          email: aff.email,
          commissionRate: aff.commissionRate,
        },
      };
    });
  }, [data?.coupons, affiliates]);

  /* Mobile: card list */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && coupons.length === 0 && <EmptyState />}
      {coupons.map((c) => (
        <CouponCard key={c.id} coupon={c} />
      ))}
    </div>
  );

  /* Desktop: table */
  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[130px]">Código</TableHead>
            <TableHead className="w-[110px]">Tipo</TableHead>
            <TableHead className="w-[80px]">Desconto</TableHead>
            <TableHead className="w-[90px]">Status</TableHead>
            <TableHead className="w-[70px]">Uso</TableHead>
            <TableHead className="w-[130px]">Expiração</TableHead>
            <TableHead className="w-[180px]">Afiliado</TableHead>
            <TableHead className="w-[50px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {isError && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && coupons.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {coupons.map((c) => (
            <CouponRow key={c.id} coupon={c} />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
      {!isLoading && !isError && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
