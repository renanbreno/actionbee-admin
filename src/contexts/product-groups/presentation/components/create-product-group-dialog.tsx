"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  productGroupSchema,
  ProductGroupFormValues,
} from "../schemas/product-group.schema";
import { useCreateProductGroup } from "../hooks/use-create-product-group";
import { ProductPicker } from "./product-picker";

interface CreateProductGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProductGroupDialog({
  open,
  onOpenChange,
}: CreateProductGroupDialogProps) {
  const createMutation = useCreateProductGroup();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductGroupFormValues>({
    resolver: zodResolver(productGroupSchema),
    defaultValues: { name: "", productIds: [] },
  });

  const onSubmit = (data: ProductGroupFormValues) => {
    createMutation.mutate(
      { name: data.name, productIds: data.productIds },
      {
        onSuccess: () => {
          toast.success("Grupo criado com sucesso!");
          reset();
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(error.message || "Erro ao criar grupo.");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar Grupo de Produtos</DialogTitle>
          <DialogDescription>
            Agrupe produtos do mesmo tipo (ex: mesmo gel em sabores diferentes) para habilitar elevação de variante entre eles.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nome do grupo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex: Gel de Carbo"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Produtos */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Produtos <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Selecione 2 ou mais produtos que são o mesmo item em versões diferentes (sabores, cores, etc).
            </p>
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => (
                <ProductPicker
                  selectedIds={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.productIds && (
              <p className="text-destructive text-sm">{errors.productIds.message}</p>
            )}
          </div>

          <DialogActions
            isLoading={createMutation.isPending}
            loadingText="Criando..."
            submitLabel="Criar Grupo"
            onCancel={() => { reset(); onOpenChange(false); }}
            submitButtonProps={{ className: "min-w-[130px]" }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
