"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit,
  MoreHorizontal,
  Search,
  Package,
  AlertTriangle,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { useBrands, useDeleteBrand } from "../hooks";
import { Brand } from "../../domain/entities/brand";
import { toast } from "sonner";

function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

function BrandStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={
        isActive
          ? "bg-emerald-100 text-emerald-700 border-0"
          : "bg-muted text-muted-foreground border-0"
      }
    >
      {isActive ? "Ativo" : "Inativo"}
    </Badge>
  );
}

function BrandActions({
  brand,
  onDeleteClick,
}: {
  brand: Brand;
  onDeleteClick: () => void;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() =>
            router.push(`/dashboard/products/brands/${brand.id}/edit`)
          }
        >
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDeleteClick}
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
function BrandCard({
  brand,
  onDeleteClick,
}: {
  brand: Brand;
  onDeleteClick: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-lg bg-bee-gold/10 flex items-center justify-center shrink-0">
            <Package className="h-5 w-5 text-bee-gold" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{brand.name}</p>
            <p className="text-xs text-muted-foreground">
              Criado em {formatDateTime(brand.createdAt)}
            </p>
          </div>
          <BrandActions brand={brand} onDeleteClick={onDeleteClick} />
        </div>

        <div className="flex items-center gap-2">
          <BrandStatusBadge isActive={brand.isActive} />
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function BrandRow({
  brand,
  onDeleteClick,
}: {
  brand: Brand;
  onDeleteClick: () => void;
}) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-bee-gold/10 flex items-center justify-center shrink-0">
            <Package className="h-4 w-4 text-bee-gold" />
          </div>
          <p className="font-medium text-sm">{brand.name}</p>
        </div>
      </TableCell>
      <TableCell>
        <BrandStatusBadge isActive={brand.isActive} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDateTime(brand.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <BrandActions brand={brand} onDeleteClick={onDeleteClick} />
      </TableCell>
    </TableRow>
  );
}

/* ─── Skeletons ─── */
function CardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
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
            <Skeleton className="h-10 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-8 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <Package className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">
        {search ? "Nenhuma marca encontrada" : "Nenhuma marca cadastrada"}
      </p>
      <p className="text-muted-foreground text-sm">
        {search
          ? "Tente uma nova busca ou cadastre uma marca."
          : "Cadastre a primeira marca para começar."}
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar marcas</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function BrandsTable() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: brands = [], isLoading, isError } = useBrands();
  const deleteMutation = useDeleteBrand();

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Marca excluída com sucesso");
          setDeleteId(null);
        },
        onError: () => {
          toast.error("Erro ao excluir marca");
        },
      });
    }
  };

  /* ─── Filters ─── */
  const filtersSection = (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="brand-search" className="text-sm font-medium">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="brand-search"
              placeholder="Buscar marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Mobile ─── */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && filteredBrands.length === 0 && (
        <EmptyState search={search} />
      )}
      {filteredBrands.map((brand) => (
        <BrandCard
          key={brand.id}
          brand={brand}
          onDeleteClick={() => setDeleteId(brand.id)}
        />
      ))}
    </div>
  );

  /* ─── Desktop ─── */
  const desktopView = (
    <div className="hidden md:block space-y-4">
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Nome</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[180px]">Criado em</TableHead>
              <TableHead className="w-[60px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableSkeleton />}
            {isError && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <ErrorState />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && filteredBrands.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <EmptyState search={search} />
                </TableCell>
              </TableRow>
            )}
            {filteredBrands.map((brand) => (
              <BrandRow
                key={brand.id}
                brand={brand}
                onDeleteClick={() => setDeleteId(brand.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      {filtersSection}
      {mobileView}
      {desktopView}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir marca</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta marca? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
