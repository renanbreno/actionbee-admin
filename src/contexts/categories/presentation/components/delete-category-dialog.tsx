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
import { Category } from "../../domain/entities/category";
import { useDeleteCategory } from "../hooks/use-delete-category";

interface DeleteCategoryDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog({
  category,
  open,
  onOpenChange,
}: DeleteCategoryDialogProps) {
  const deleteMutation = useDeleteCategory();

  const handleDelete = () => {
    deleteMutation.mutate(category.id, {
      onSuccess: () => {
        toast.success("Categoria excluída com sucesso!");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(error.message || "Erro ao excluir categoria. Tente novamente.");
      },
    });
  };

  const hasSubcategories =
    category.subcategories && category.subcategories.length > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria{" "}
            <strong className="text-foreground">{category.name}</strong>?
            {hasSubcategories && (
              <span className="mt-2 block text-destructive font-medium">
                Esta categoria possui {category.subcategories!.length}{" "}
                subcategoria(s) que também serão afetadas.
              </span>
            )}
            <span className="mt-2 block">
              Esta ação não pode ser desfeita.
            </span>
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
