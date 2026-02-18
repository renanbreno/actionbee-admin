"use client";

import { useState } from "react";
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
  Ban,
  Eye,
  EyeOff,
  Megaphone,
  AlertTriangle,
  Info,
  CalendarDays,
  Infinity,
  Pencil,
  Power,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Announcement } from "../../domain/entities/announcement";
import { useAnnouncements } from "../hooks/use-announcements";
import { useDeactivateAnnouncement } from "../hooks/use-deactivate-announcement";
import { useActivateAnnouncement } from "../hooks/use-activate-announcement";
import { EditAnnouncementDialog } from "./edit-announcement-dialog";

const TYPE_CONFIG: Record<
  string,
  { label: string; icon: typeof Info; className: string }
> = {
  promotion: {
    label: "Promoção",
    icon: Megaphone,
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  warning: {
    label: "Aviso",
    icon: AlertTriangle,
    className: "bg-red-100 text-red-800 border-red-200",
  },
  info: {
    label: "Informativo",
    icon: Info,
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
};

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ─── Actions Dropdown ─── */
function AnnouncementActions({ announcement }: { announcement: Announcement }) {
  const [editOpen, setEditOpen] = useState(false);
  const deactivateMutation = useDeactivateAnnouncement();
  const activateMutation = useActivateAnnouncement();
  const isPending = deactivateMutation.isPending || activateMutation.isPending;

  const handleDeactivate = () => {
    deactivateMutation.mutate(announcement.id, {
      onSuccess: () => toast.success("Anúncio desativado"),
      onError: () => toast.error("Erro ao desativar anúncio"),
    });
  };

  const handleActivate = () => {
    activateMutation.mutate(announcement.id, {
      onSuccess: () => toast.success("Anúncio ativado"),
      onError: () => toast.error("Erro ao ativar anúncio"),
    });
  };

  return (
    <>
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
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-3.5 w-3.5" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {announcement.isActive ? (
            <DropdownMenuItem
              onClick={handleDeactivate}
              disabled={deactivateMutation.isPending}
            >
              <Ban className="mr-2 h-3.5 w-3.5" />
              Desativar
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={handleActivate}
              disabled={activateMutation.isPending}
            >
              <Power className="mr-2 h-3.5 w-3.5" />
              Ativar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAnnouncementDialog
        announcement={announcement}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}

/* ─── Mobile Card ─── */
function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const typeConfig = TYPE_CONFIG[announcement.type] ?? TYPE_CONFIG.info;
  const TypeIcon = typeConfig.icon;

  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 p-4">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className={cn("gap-1.5 font-medium", typeConfig.className)}
          >
            <TypeIcon className="h-3 w-3" />
            {typeConfig.label}
          </Badge>
          <div className="flex items-center gap-2">
            {announcement.isActive ? (
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-emerald-700">Ativo</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                <span className="text-muted-foreground text-xs">Inativo</span>
              </div>
            )}
            {announcement.isCurrentlyVisible ? (
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <AnnouncementActions announcement={announcement} />
          </div>
        </div>

        {/* Message */}
        <p className="text-sm font-medium leading-snug">{announcement.message}</p>

        {/* Dates */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatTimestamp(announcement.startsAt)}
          </div>
          <div className="flex items-center gap-1">
            {announcement.endsAt ? (
              <>
                <CalendarDays className="h-3 w-3" />
                {formatTimestamp(announcement.endsAt)}
              </>
            ) : (
              <>
                <Infinity className="h-3 w-3" />
                Ilimitado
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Desktop Row ─── */
function AnnouncementRow({ announcement }: { announcement: Announcement }) {
  const typeConfig = TYPE_CONFIG[announcement.type] ?? TYPE_CONFIG.info;
  const TypeIcon = typeConfig.icon;

  return (
    <TableRow className="group">
      <TableCell>
        <Badge
          variant="outline"
          className={cn("gap-1.5 font-medium", typeConfig.className)}
        >
          <TypeIcon className="h-3 w-3" />
          {typeConfig.label}
        </Badge>
      </TableCell>
      <TableCell className="max-w-sm">
        <p className="truncate font-medium">{announcement.message}</p>
      </TableCell>
      <TableCell>
        {announcement.isActive ? (
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
            <span className="text-muted-foreground text-sm">Inativo</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        {announcement.isCurrentlyVisible ? (
          <div className="flex items-center gap-1.5 text-emerald-700">
            <Eye className="h-3.5 w-3.5" />
            <span className="text-sm">Visível</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <EyeOff className="h-3.5 w-3.5" />
            <span className="text-sm">Oculto</span>
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5 text-sm">
          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
          {formatTimestamp(announcement.startsAt)}
        </div>
      </TableCell>
      <TableCell>
        {announcement.endsAt ? (
          <div className="flex items-center gap-1.5 text-sm">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            {formatTimestamp(announcement.endsAt)}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <Infinity className="h-3.5 w-3.5" />
            Ilimitado
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        <AnnouncementActions announcement={announcement} />
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
          <Skeleton className="h-8 w-8 rounded" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-64" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

/* ─── Empty / Error states ─── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <Megaphone className="h-8 w-8 text-muted-foreground/40" />
      <p className="font-medium">Nenhum anúncio cadastrado</p>
      <p className="text-muted-foreground text-sm">
        Crie seu primeiro anúncio clicando no botão acima.
      </p>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center gap-2 py-16">
      <AlertTriangle className="h-8 w-8 text-destructive/60" />
      <p className="text-destructive font-medium">Erro ao carregar anúncios</p>
      <p className="text-muted-foreground text-sm">
        Verifique sua conexão e tente novamente.
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function AnnouncementsTable() {
  const { data: announcements, isLoading, isError } = useAnnouncements();

  /* Mobile: card list */
  const mobileView = (
    <div className="space-y-3 md:hidden">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
      {isError && <ErrorState />}
      {announcements && announcements.length === 0 && <EmptyState />}
      {announcements?.map((a) => (
        <AnnouncementCard key={a.id} announcement={a} />
      ))}
    </div>
  );

  /* Desktop: table */
  const desktopView = (
    <div className="hidden md:block rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[130px]">Tipo</TableHead>
            <TableHead>Mensagem</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[100px]">Visibilidade</TableHead>
            <TableHead className="w-[170px]">Início</TableHead>
            <TableHead className="w-[170px]">Término</TableHead>
            <TableHead className="w-[50px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableSkeleton />}
          {isError && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <ErrorState />
              </TableCell>
            </TableRow>
          )}
          {announcements && announcements.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                <EmptyState />
              </TableCell>
            </TableRow>
          )}
          {announcements?.map((a) => (
            <AnnouncementRow key={a.id} announcement={a} />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
    </>
  );
}
