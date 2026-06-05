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
import { createFlavorSchema, updateFlavorSchema } from "../schemas/flavor.schema";
import { useFlavor, useCreateFlavor, useUpdateFlavor } from "../hooks";
import { Loader2, Droplets } from "lucide-react";
import { toast } from "sonner";

interface FlavorFormProps {
  flavorId?: string;
}

type CreateFormValues = {
  name: string;
  color?: string;
};

type UpdateFormValues = {
  name: string;
  color?: string;
  isActive: boolean;
};

export function FlavorForm({ flavorId }: FlavorFormProps) {
  const router = useRouter();
  const { data: flavor, isLoading: isLoadingFlavor } = useFlavor(flavorId ?? "");
  const createMutation = useCreateFlavor();
  const updateMutation = useUpdateFlavor();

  const isEditing = !!flavorId;

  const createForm = useForm<CreateFormValues>({
    resolver: zodResolver(createFlavorSchema),
    defaultValues: { name: "", color: "" },
  });

  const updateForm = useForm<UpdateFormValues>({
    resolver: zodResolver(updateFlavorSchema),
    defaultValues: { name: "", color: "", isActive: true },
  });

  useEffect(() => {
    if (flavor && isEditing) {
      updateForm.setValue("name", flavor.name);
      updateForm.setValue("color", flavor.color ?? "");
      updateForm.setValue("isActive", flavor.isActive);
    }
  }, [flavor, isEditing, updateForm]);

  const onSubmit = (values: CreateFormValues | UpdateFormValues) => {
    const payload = {
      ...values,
      color: values.color || undefined,
    };

    if (flavorId) {
      updateMutation.mutate(
        { id: flavorId, data: payload as UpdateFormValues },
        {
          onSuccess: () => {
            toast.success("Sabor atualizado com sucesso");
            router.push("/dashboard/products/flavors");
          },
          onError: () => {
            toast.error("Erro ao atualizar sabor");
          },
        }
      );
    } else {
      createMutation.mutate(payload as CreateFormValues, {
        onSuccess: () => {
          toast.success("Sabor criado com sucesso");
          router.push("/dashboard/products/flavors");
        },
        onError: () => {
          toast.error("Erro ao criar sabor");
        },
      });
    }
  };

  const isLoading = isLoadingFlavor || createForm.formState.isSubmitting || updateForm.formState.isSubmitting;

  if (!isEditing) {
    return (
      <form onSubmit={createForm.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            Nome do sabor
          </Label>
          <Input
            id="name"
            placeholder="Ex: Morango"
            disabled={isLoading}
            {...createForm.register("name")}
          />
          {createForm.formState.errors.name && (
            <p className="text-sm text-destructive">{createForm.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Cor (opcional)</Label>
          <div className="flex items-center gap-3">
            <Input
              id="color"
              placeholder="#E74C3C"
              disabled={isLoading}
              className="flex-1 font-mono"
              {...createForm.register("color")}
            />
            {createForm.watch("color") && /^#[0-9A-Fa-f]{6}$/.test(createForm.watch("color") ?? "") && (
              <span
                className="h-10 w-10 rounded-lg border border-border shrink-0"
                style={{ backgroundColor: createForm.watch("color") }}
              />
            )}
          </div>
          {createForm.formState.errors.color && (
            <p className="text-sm text-destructive">{createForm.formState.errors.color.message}</p>
          )}
        </div>

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
            Criar sabor
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={updateForm.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-muted-foreground" />
          Nome do sabor
        </Label>
        <Input
          id="name"
          placeholder="Ex: Morango"
          disabled={isLoading}
          {...updateForm.register("name")}
        />
        {updateForm.formState.errors.name && (
          <p className="text-sm text-destructive">{updateForm.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor (opcional)</Label>
        <div className="flex items-center gap-3">
          <Input
            id="color"
            placeholder="#E74C3C"
            disabled={isLoading}
            className="flex-1 font-mono"
            {...updateForm.register("color")}
          />
          {updateForm.watch("color") && /^#[0-9A-Fa-f]{6}$/.test(updateForm.watch("color") ?? "") && (
            <span
              className="h-10 w-10 rounded-lg border border-border shrink-0"
              style={{ backgroundColor: updateForm.watch("color") }}
            />
          )}
        </div>
        {updateForm.formState.errors.color && (
          <p className="text-sm text-destructive">{updateForm.formState.errors.color.message}</p>
        )}
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor="isActive">Status</Label>
          <p className="text-sm text-muted-foreground">
            Sabores ativos aparecem nas seleções de produtos
          </p>
        </div>
        <Switch
          id="isActive"
          checked={updateForm.watch("isActive")}
          onCheckedChange={(checked) => updateForm.setValue("isActive", checked)}
          disabled={isLoading}
        />
      </div>

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

export function FlavorFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
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
