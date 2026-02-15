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
import { useUpdateCategory } from "../hooks/use-update-category";

interface EditCategoryDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  parentCategories: Category[];
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
  parentCategories,
}: EditCategoryDialogProps) {
  const updateMutation = useUpdateCategory();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    values: {
      name: category.name,
      description: category.description ?? "",
      featured: category.featured,
      parentId: category.parentId ?? "",
    },
  });

  const descriptionLength = watch("description")?.length ?? 0;

  // Exclude self and own children from parent options
  const availableParents = parentCategories.filter(
    (cat) => cat.id !== category.id,
  );

  const onSubmit = (data: CreateCategoryFormValues) => {
    updateMutation.mutate(
      {
        id: category.id,
        data: {
          name: data.name,
          description: data.description || undefined,
          featured: data.featured,
          parentId: data.parentId || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Categoria atualizada com sucesso!");
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Erro ao atualizar categoria. Tente novamente.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Categoria</DialogTitle>
          <DialogDescription>
            Altere as informações da categoria.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-sm font-medium">
              Nome
            </Label>
            <Input id="edit-name" {...register("name")} />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-description" className="text-sm font-medium">
                Descrição <span className="text-muted-foreground/60 font-normal">(opcional)</span>
              </Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {descriptionLength}/500
              </span>
            </div>
            <Textarea
              id="edit-description"
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
              Categoria pai <span className="text-muted-foreground/60 font-normal">(opcional)</span>
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
                    {availableParents.map((cat) => (
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
              disabled={updateMutation.isPending}
              className="min-w-[140px] shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
