"use client";

import { toast } from "sonner";
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
import { ProductGroup } from "../../domain/entities/product-group";
import { useDeleteProductGroup } from "../hooks/use-delete-product-group";

interface DeleteProductGroupDialogProps {
  group: ProductGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteProductGroupDialog({
  group,
  open,
  onOpenChange,
}: DeleteProductGroupDialogProps) {
  const deleteMutation = useDeleteProductGroup();

  const handleDelete = () => {
    deleteMutation.mutate(group.id, {
      onSuccess: () => {
        toast.success("Grupo excluído com sucesso!");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Erro ao excluir grupo.");
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir grupo</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o grupo{" "}
            <strong className="text-foreground">{group.name}</strong>?
            {group.productIds.length > 0 && (
              <span className="mt-2 block text-amber-600 font-medium">
                Os {group.productIds.length} produto(s) do grupo serão desvinculados, mas não excluídos.
              </span>
            )}
            <span className="mt-2 block">Esta ação não pode ser desfeita.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
