"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Megaphone, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createAnnouncementSchema,
  CreateAnnouncementFormValues,
} from "../schemas/announcement.schema";
import { useCreateAnnouncement } from "../hooks/use-create-announcement";

const typeOptions = [
  {
    value: "info" as const,
    label: "Informativo",
    icon: Info,
    color: "border-blue-500/40 bg-blue-500/5 text-blue-700 hover:bg-blue-500/10",
    activeColor: "border-blue-500 bg-blue-500/15 text-blue-700 ring-2 ring-blue-500/20",
  },
  {
    value: "promotion" as const,
    label: "Promoção",
    icon: Megaphone,
    color: "border-bee-gold/40 bg-bee-gold/5 text-amber-700 hover:bg-bee-gold/10",
    activeColor: "border-bee-gold bg-bee-gold/15 text-amber-700 ring-2 ring-bee-gold/20",
  },
  {
    value: "warning" as const,
    label: "Aviso",
    icon: AlertTriangle,
    color: "border-red-500/40 bg-red-500/5 text-red-700 hover:bg-red-500/10",
    activeColor: "border-red-500 bg-red-500/15 text-red-700 ring-2 ring-red-500/20",
  },
];

interface CreateAnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAnnouncementDialog({
  open,
  onOpenChange,
}: CreateAnnouncementDialogProps) {
  const createMutation = useCreateAnnouncement();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateAnnouncementFormValues>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: {
      message: "",
      type: "info",
      startsAt: undefined as unknown as Date,
      endsAt: undefined,
    },
  });

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = (data: CreateAnnouncementFormValues) => {
    const startsAtTimestamp = Math.floor(data.startsAt.getTime() / 1000);
    const endsAtTimestamp = data.endsAt
      ? Math.floor(data.endsAt.getTime() / 1000)
      : null;

    createMutation.mutate(
      {
        message: data.message,
        type: data.type,
        isActive: true,
        startsAt: startsAtTimestamp,
        endsAt: endsAtTimestamp,
      },
      {
        onSuccess: () => {
          toast.success("Anúncio criado com sucesso!");
          reset();
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Erro ao criar anúncio. Tente novamente.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Anúncio</DialogTitle>
          <DialogDescription>
            Configure a mensagem, tipo e período de exibição do anúncio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* Tipo */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Tipo do anúncio</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => field.onChange(opt.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-3 sm:p-4 transition-all duration-200",
                        field.value === opt.value
                          ? opt.activeColor
                          : opt.color,
                      )}
                    >
                      <opt.icon className="h-5 w-5" />
                      <span className="text-[10px] sm:text-xs font-semibold">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.type && (
              <p className="text-destructive text-sm">{errors.type.message}</p>
            )}
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message" className="text-sm font-medium">
                Mensagem
              </Label>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  messageLength > 450
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {messageLength}/500
              </span>
            </div>
            <Textarea
              id="message"
              placeholder="Ex: Frete grátis para todo o Brasil em compras acima de R$150!"
              rows={3}
              className="resize-none"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-destructive text-sm">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Período */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Período de exibição</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-xs">Início</span>
                <Controller
                  name="startsAt"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Data de início"
                    />
                  )}
                />
                {errors.startsAt && (
                  <p className="text-destructive text-xs">
                    {errors.startsAt.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-xs">
                  Término{" "}
                  <span className="text-muted-foreground/60">(opcional)</span>
                </span>
                <Controller
                  name="endsAt"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      placeholder="Sem término"
                    />
                  )}
                />
                {errors.endsAt && (
                  <p className="text-destructive text-xs">
                    {errors.endsAt.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="min-w-[140px] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            >
              {createMutation.isPending ? "Criando..." : "Criar Anúncio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
