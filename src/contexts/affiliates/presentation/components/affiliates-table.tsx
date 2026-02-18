"use client";

import { toast } from "sonner";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Trash2,
  Edit,
  AlertTriangle,
  Share2,
  ExternalLink,
  User,
  Phone,
  Percent,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import { Affiliate } from "../../domain/entities/affiliate";
import { useAffiliates } from "../hooks/use-affiliates";
import { useDeleteAffiliate } from "../hooks/use-delete-affiliate";
import { AffiliateFormDialog } from "./affiliate-form-dialog";
import { useState } from "react";
import { formatCPF, formatPhone } from "@/shared/utils/masks";

/* ─── Social Media Links Component (Desktop - popover) ─── */
function SocialMediaLinksDesktop({ urls }: { urls: string[] }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto gap-2 px-2 py-1.5 hover:bg-bee-gold/10"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">
            {urls.length} {urls.length === 1 ? "link" : "links"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-88 max-w-[calc(100vw-2rem)] p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Redes Sociais
        </p>
        {urls.map((social, idx) => (
          <a
            key={idx}
            href={social}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors min-w-0"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span className="break-all">{social}</span>
          </a>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─── Actions Dropdown ─── */
function AffiliateActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-3.5 w-3.5" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
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
function AffiliateCard({
  affiliate,
  onEdit,
  onDelete,
}: {
  affiliate: Affiliate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        {/* Header: avatar + info + commission + actions */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-base truncate">{affiliate.name}</p>
            <p className="text-muted-foreground text-sm truncate">{affiliate.email}</p>
          </div>
          <Badge className="bg-bee-gold/15 text-amber-800 border-bee-gold/30 font-bold text-base gap-1 shrink-0 px-2.5 py-1">
            <Percent className="h-3.5 w-3.5" />
            {affiliate.commissionRate}%
          </Badge>
          <AffiliateActions onEdit={onEdit} onDelete={onDelete} />
        </div>

        {/* Contact info */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {affiliate.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{formatPhone(affiliate.phone)}</span>
            </div>
          )}
          {affiliate.cpf && (
            <div className="flex items-center gap-2">
              <span className="font-medium">CPF</span>
              <span>{formatCPF(affiliate.cpf)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(affiliate.createdAt)}</span>
          </div>
        </div>

        {/* Social Media Links */}
        {affiliate.socialMedia && affiliate.socialMedia.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Share2 className="h-4 w-4" />
              <span>Redes Sociais</span>
            </div>
            <div className="flex flex-col gap-2">
              {affiliate.socialMedia.map((social, idx) => (
                <a
                  key={idx}
                  href={social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 active:text-blue-800 transition-colors min-w-0"
                >
                  <ExternalLink className="h-4 w-4 shrink-0" />
                  <span className="truncate">{social}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function AffiliateRow({
  affiliate,
  onEdit,
  onDelete,
}: {
  affiliate: Affiliate;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bee-gold/20 text-bee-amber">
            <User className="h-4.5 w-4.5" />
          </div>
          <div>
            <p className="font-medium">{affiliate.name}</p>
            <p className="text-muted-foreground text-xs">{affiliate.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1 text-sm">
          {affiliate.phone && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="h-3.5 w-3.5" />
              {formatPhone(affiliate.phone)}
            </div>
          )}
          {affiliate.cpf && (
            <div className="text-muted-foreground">
              <span className="text-xs">CPF: </span>
              {formatCPF(affiliate.cpf)}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge className="bg-bee-gold/15 text-amber-800 border-bee-gold/30 font-semibold gap-1.5">
          <Percent className="h-3.5 w-3.5" />
          {affiliate.commissionRate}%
        </Badge>
      </TableCell>
      <TableCell>
        {affiliate.socialMedia && affiliate.socialMedia.length > 0 ? (
          <SocialMediaLinksDesktop urls={affiliate.socialMedia} />
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {formatDate(affiliate.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <AffiliateActions onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
}

/* ─── Skeletons ─── */
function CardSkeleton() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-14 rounded-full shrink-0" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
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
            <Skeleton className="h-9 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <User className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum afiliado cadastrado</p>
      <p className="text-muted-foreground text-sm">
        Cadastre seu primeiro afiliado clicando no botão acima.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar afiliados</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function AffiliatesTable() {
  const { data, isLoading, isError } = useAffiliates();
  const deleteMutation = useDeleteAffiliate();
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const affiliates = data ?? [];

  const handleEdit = (affiliate: Affiliate) => {
    setEditingAffiliate(affiliate);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o afiliado ${name}?`)) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Afiliado excluído"),
        onError: () => toast.error("Erro ao excluir afiliado"),
      });
    }
  };

  /* Mobile: card list */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {!isLoading && !isError && affiliates.length === 0 && <EmptyState />}
      {affiliates.map((a) => (
        <AffiliateCard
          key={a.id}
          affiliate={a}
          onEdit={() => handleEdit(a)}
          onDelete={() => handleDelete(a.id, a.name)}
        />
      ))}
    </div>
  );

  /* Desktop: table */
  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[250px]">Afiliado</TableHead>
            <TableHead className="w-[200px]">Contato</TableHead>
            <TableHead className="w-[120px]">Comissão</TableHead>
            <TableHead className="w-[150px]">Redes Sociais</TableHead>
            <TableHead className="w-[120px]">Cadastro</TableHead>
            <TableHead className="w-[50px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {isError && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && affiliates.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {affiliates.map((a) => (
            <AffiliateRow
              key={a.id}
              affiliate={a}
              onEdit={() => handleEdit(a)}
              onDelete={() => handleDelete(a.id, a.name)}
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
      <AffiliateFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        affiliate={editingAffiliate}
      />
    </>
  );
}
