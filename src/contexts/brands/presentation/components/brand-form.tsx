"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrandSchema, updateBrandSchema } from "../schemas/brand.schema";
import { useBrand, useCreateBrand, useUpdateBrand } from "../hooks";
import { Loader2, Package } from "lucide-react";
import { toast } from "sonner";

interface BrandFormProps {
  brandId?: string;
}

type CreateFormValues = {
  name: string;
};

type UpdateFormValues = {
  name: string;
  isActive: boolean;
};

export function BrandForm({ brandId }: BrandFormProps) {
  const router = useRouter();
  const { data: brand, isLoading: isLoadingBrand } = useBrand(brandId ?? "");
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  const isEditing = !!brandId;

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: { name: "" },
  });

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateBrandSchema),
    defaultValues: { name: "", isActive: true },
  });

  useEffect(() => {
    if (brand && isEditing) {
      updateForm.setValue("name", brand.name);
      updateForm.setValue("isActive", brand.isActive);
    }
  }, [brand, isEditing, updateForm]);

  const onSubmit = (values: CreateFormValues | UpdateFormValues) => {
    if (brandId) {
      updateMutation.mutate(
        { id: brandId, data: values as UpdateFormValues },
        {
          onSuccess: () => {
            toast.success("Marca atualizada com sucesso");
            router.push("/dashboard/products/brands");
          },
          onError: () => {
            toast.error("Erro ao atualizar marca");
          },
        }
      );
    } else {
      createMutation.mutate(values as CreateFormValues, {
        onSuccess: () => {
          toast.success("Marca criada com sucesso");
          router.push("/dashboard/products/brands");
        },
        onError: () => {
          toast.error("Erro ao criar marca");
        },
      });
    }
  };

  const isLoading = isLoadingBrand || createForm.formState.isSubmitting || updateForm.formState.isSubmitting;

  // Create form
  if (!isEditing) {
    return (
      <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            Nome da marca
          </Label>
          <Input
            id="name"
            placeholder="Ex: ActionBee"
            disabled={isLoading}
            {...createForm.register("name")}
          />
          {createForm.formState.errors.name && (
            <p className="text-sm text-destructive">{createForm.formState.errors.name.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
            className="w-full sm:w-auto hover:bg-muted hover:text-foreground hover:border-muted-foreground/20"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-bee-gold text-black hover:bg-bee-amber"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar marca
          </Button>
        </div>
      </form>
    );
  }

  // Update form
  return (
    <form onSubmit={updateForm.handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          Nome da marca
        </Label>
        <Input
          id="name"
          placeholder="Ex: ActionBee"
          disabled={isLoading}
          {...updateForm.register("name")}
        />
        {updateForm.formState.errors.name && (
          <p className="text-sm text-destructive">{updateForm.formState.errors.name.message}</p>
        )}
      </div>

      {/* isActive Switch */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="isActive">Status</Label>
          <p className="text-sm text-muted-foreground">
            Marcas ativas aparecem nas seleções de produtos
          </p>
        </div>
        <Switch
          id="isActive"
          checked={updateForm.watch("isActive")}
          onCheckedChange={(checked) => updateForm.setValue("isActive", checked)}
          disabled={isLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-bee-gold text-black hover:bg-bee-amber"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}

export function BrandFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-11" />
      </div>
      <div className="flex gap-2 justify-end">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
