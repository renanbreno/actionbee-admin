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
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Link2,
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertTriangle,
  Image as ImageIcon,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useProducts } from "../hooks/use-products";
import { useUpdateProduct } from "../hooks/use-update-product";
import { useCategories } from "@/contexts/categories/presentation/hooks/use-categories";
import { Product } from "../../domain/entities/product";
import { RelatedProductsDialog } from "./related-products-dialog";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
}

function formatCategory(
  parentCategoryName: string | null | undefined,
  categoryName: string | null | undefined,
): string | null {
  if (!categoryName) return null;
  if (!parentCategoryName) return categoryName;
  return `${parentCategoryName} → ${categoryName}`;
}

function ProductStatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span className="text-sm font-medium text-emerald-700">Ativo</span>
    </div>
  ) : (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
      <span className="text-sm text-muted-foreground">Inativo</span>
    </div>
  );
}

function ProductBrandBadge({ brandName }: { brandName?: string | null }) {
  if (!brandName) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  return (
    <Badge
      variant="outline"
      className="bg-bee-gold/20 text-amber-900 border-bee-gold/30 font-medium"
    >
      <Tag className="h-3 w-3 mr-1" />
      {brandName}
    </Badge>
  );
}

function ProductActions({
  productId,
  productName,
  isActive,
}: {
  productId: string;
  productName: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [relatedOpen, setRelatedOpen] = useState(false);
  const updateMutation = useUpdateProduct(productId);

  const handleToggle = () => {
    updateMutation.mutate(
      { data: { isActive: !isActive } },
      {
        onError: (e: Error) => {
          console.error("Erro ao alterar status do produto:", e.message);
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Ações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/products/${productId}/edit`)}
          >
            <Edit className="mr-2 h-3.5 w-3.5" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleToggle}
            disabled={updateMutation.isPending}
          >
            {isActive ? (
              <>
                <XCircle className="mr-2 h-3.5 w-3.5" />
                Desativar
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-3.5 w-3.5" />
                Ativar
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRelatedOpen(true)}>
            <Link2 className="mr-2 h-3.5 w-3.5" />
            Produtos Relacionados
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RelatedProductsDialog
        productId={productId}
        productName={productName}
        open={relatedOpen}
        onClose={() => setRelatedOpen(false)}
      />
    </>
  );
}

/* ─── Mobile Card ─── */
function ProductCard({ product }: { product: Product }) {
  const basePrice = product.variants[0]?.price;

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        {/* Header: Image + Name + Actions */}
        <div className="flex gap-3">
          <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{product.name}</p>
                {product.brandName && (
                  <ProductBrandBadge brandName={product.brandName} />
                )}
              </div>
              <ProductActions
                productId={product.id}
                productName={product.name}
                isActive={product.isActive}
              />
            </div>
          </div>
        </div>

        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
          {formatCategory(product.parentCategoryName, product.categoryName) && (
            <span className="truncate">
              {formatCategory(product.parentCategoryName, product.categoryName)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            {product.variants.length} variante
            {product.variants.length !== 1 ? "s" : ""}
          </span>
          {basePrice != null && (
            <span className="font-medium text-foreground">
              {formatPrice(basePrice)}
            </span>
          )}
          {product.costPrice != null && (
            <span className="text-muted-foreground">
              custo: {formatPrice(product.costPrice)}
            </span>
          )}
        </div>

        {/* Status */}
        <ProductStatusBadge isActive={product.isActive} />
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function ProductRow({ product }: { product: Product }) {
  const basePrice = product.variants[0]?.price;
  const totalStock = product.stockUnits ?? 0;

  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            {product.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <p className="font-medium text-sm">{product.name}</p>
        </div>
      </TableCell>
      <TableCell>
        <ProductBrandBadge brandName={product.brandName} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatCategory(product.parentCategoryName, product.categoryName) ??
          "—"}
      </TableCell>
      <TableCell className="text-sm text-center">
        {product.variants.length}
      </TableCell>
      <TableCell className="text-sm text-center">{totalStock}</TableCell>
      <TableCell>
        <ProductStatusBadge isActive={product.isActive} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {product.costPrice != null ? formatPrice(product.costPrice) : "—"}
      </TableCell>
      <TableCell className="text-right">
        <ProductActions
          productId={product.id}
          productName={product.name}
          isActive={product.isActive}
        />
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
        <div className="flex gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
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
            <Skeleton className="h-10 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-24 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
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
      <Package className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum produto encontrado</p>
      <p className="text-muted-foreground text-sm">
        Tente uma nova busca ou cadastre um produto.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar produtos</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function ProductsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const limit = 10;

  const { data, isLoading, isError } = useProducts(
    page,
    limit,
    search,
    categoryId,
  );
  const { data: categories } = useCategories();

  const products = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value === "all" ? undefined : value);
    setPage(1);
  };

  /* ─── Mobile ─── */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {/* Filters */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {(categories ?? []).map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && products.length === 0 && <EmptyState />}
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}

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

  /* ─── Desktop ─── */
  const desktopView = (
    <div className="hidden md:block space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Select onValueChange={handleCategoryChange} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {(categories ?? []).map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-auto">
          {total} produto{total !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">Produto</TableHead>
              <TableHead className="w-[150px]">Marca</TableHead>
              <TableHead className="w-[150px]">Categoria</TableHead>
              <TableHead className="w-[80px] text-center">Variantes</TableHead>
              <TableHead className="w-[80px] text-center">Estoque</TableHead>
              <TableHead className="w-[90px]">Status</TableHead>
              <TableHead className="w-[110px]">Preço de custo</TableHead>
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
            {!isLoading && !isError && products.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
            {products.map((p) => (
              <ProductRow key={p.id} product={p} />
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages} • {total} produto
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
      {mobileView}
      {desktopView}
    </>
  );
}
