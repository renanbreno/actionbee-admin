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
  Droplets,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useFlavors, useDeleteFlavor } from "../hooks";
import { Flavor } from "../../domain/entities/flavor";
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

function FlavorStatusBadge({ isActive }: { isActive: boolean }) {
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

function ColorSwatch({ color }: { color: string | null }) {
  if (!color) return null;
  return (
    <span
      className="inline-block h-4 w-4 rounded-full border border-border shrink-0"
      style={{ backgroundColor: color }}
    />
  );
}

function FlavorActions({
  flavor,
  onDeleteClick,
}: {
  flavor: Flavor;
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
            router.push(`/dashboard/products/flavors/${flavor.id}/edit`)
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

function FlavorCard({
  flavor,
  onDeleteClick,
}: {
  flavor: Flavor;
  onDeleteClick: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-lg bg-bee-gold/10 flex items-center justify-center shrink-0">
            {flavor.color ? (
              <span
                className="h-6 w-6 rounded-full border border-border"
                style={{ backgroundColor: flavor.color }}
              />
            ) : (
              <Droplets className="h-5 w-5 text-bee-gold" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm truncate">{flavor.name}</p>
            <p className="text-xs text-muted-foreground">
              Criado em {formatDateTime(flavor.createdAt)}
            </p>
          </div>
          <FlavorActions flavor={flavor} onDeleteClick={onDeleteClick} />
        </div>

        <div className="flex items-center gap-2">
          <FlavorStatusBadge isActive={flavor.isActive} />
          {flavor.color && (
            <Badge variant="outline" className="gap-1.5 font-mono text-xs">
              <ColorSwatch color={flavor.color} />
              {flavor.color}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function FlavorRow({
  flavor,
  onDeleteClick,
}: {
  flavor: Flavor;
  onDeleteClick: () => void;
}) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-bee-gold/10 flex items-center justify-center shrink-0">
            {flavor.color ? (
              <span
                className="h-5 w-5 rounded-full border border-border"
                style={{ backgroundColor: flavor.color }}
              />
            ) : (
              <Droplets className="h-4 w-4 text-bee-gold" />
            )}
          </div>
          <p className="font-medium text-sm">{flavor.name}</p>
        </div>
      </TableCell>
      <TableCell>
        {flavor.color ? (
          <Badge variant="outline" className="gap-1.5 font-mono text-xs">
            <ColorSwatch color={flavor.color} />
            {flavor.color}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
      </TableCell>
      <TableCell>
        <FlavorStatusBadge isActive={flavor.isActive} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDateTime(flavor.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <FlavorActions flavor={flavor} onDeleteClick={onDeleteClick} />
      </TableCell>
    </TableRow>
  );
}

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
          <TableCell><Skeleton className="h-10 w-48" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EmptyState({ search }: { search: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <Droplets className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">
        {search ? "Nenhum sabor encontrado" : "Nenhum sabor cadastrado"}
      </p>
      <p className="text-muted-foreground text-sm">
        {search
          ? "Tente uma nova busca ou cadastre um sabor."
          : "Cadastre o primeiro sabor para começar."}
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar sabores</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

export function FlavorsTable() {
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: flavors = [], isLoading, isError } = useFlavors();
  const deleteMutation = useDeleteFlavor();

  const filteredFlavors = flavors.filter((flavor) =>
    flavor.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Sabor excluído com sucesso");
          setDeleteId(null);
        },
        onError: () => {
          toast.error("Erro ao excluir sabor");
        },
      });
    }
  };

  const filtersSection = (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="flavor-search" className="text-sm font-medium">
            Buscar
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="flavor-search"
              placeholder="Buscar sabor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && filteredFlavors.length === 0 && (
        <EmptyState search={search} />
      )}
      {filteredFlavors.map((flavor) => (
        <FlavorCard
          key={flavor.id}
          flavor={flavor}
          onDeleteClick={() => setDeleteId(flavor.id)}
        />
      ))}
    </div>
  );

  const desktopView = (
    <div className="hidden md:block space-y-4">
      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead className="w-[120px]">Cor</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[180px]">Criado em</TableHead>
              <TableHead className="w-[60px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableSkeleton />}
            {isError && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <ErrorState />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && filteredFlavors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  <EmptyState search={search} />
                </TableCell>
              </TableRow>
            )}
            {filteredFlavors.map((flavor) => (
              <FlavorRow
                key={flavor.id}
                flavor={flavor}
                onDeleteClick={() => setDeleteId(flavor.id)}
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

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir sabor</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este sabor? Esta ação não pode ser
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
