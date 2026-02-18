"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "../../domain/entities/category";
import {
  createCategorySchema,
  CreateCategoryFormValues,
} from "../schemas/category.schema";
import { useCreateCategory } from "../hooks/use-create-category";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentCategories: Category[];
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  parentCategories,
}: CreateCategoryDialogProps) {
  const createMutation = useCreateCategory();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      featured: false,
      parentId: "",
    },
  });

  const descriptionLength = watch("description")?.length ?? 0;

  const onSubmit = (data: CreateCategoryFormValues) => {
    createMutation.mutate(
      {
        name: data.name,
        description: data.description || undefined,
        featured: data.featured,
        parentId: data.parentId || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Categoria criada com sucesso!");
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Erro ao criar categoria. Tente novamente.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Categoria</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova categoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Mel Natural"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição
                {" "}
                <span className="text-muted-foreground/60 font-normal">(opcional)</span>
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {descriptionLength}/500
              </span>
            </div>
            <Textarea
              id="description"
              placeholder="Descreva brevemente esta categoria..."
              rows={3}
              className="resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Categoria pai */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Categoria pai
              {" "}
              <span className="text-muted-foreground/60 font-normal">(opcional)</span>
            </Label>
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "none"}
                  onValueChange={(v) => field.onChange(v === "none" ? "" : v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Nenhuma (categoria raiz)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhuma (categoria raiz)</SelectItem>
                    {parentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Destaque */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Destaque</Label>
              <p className="text-xs text-muted-foreground">
                Exibir em destaque no site
              </p>
            </div>
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
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
              {createMutation.isPending ? "Criando..." : "Criar Categoria"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
