"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { useRelatedProducts } from "../hooks/use-related-products";
import { useSetRelatedProducts } from "../hooks/use-set-related-products";
import { RelatedProductsSection } from "./related-products-section";
import { RelatedProduct } from "../../domain/entities/product";

interface RelatedProductsDialogProps {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
}

export function RelatedProductsDialog({
  productId,
  productName,
  open,
  onClose,
}: RelatedProductsDialogProps) {
  const queryClient = useQueryClient();
  const { data: fetchedRelated } = useRelatedProducts(productId);
  const setRelatedMutation = useSetRelatedProducts(productId);

  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  useEffect(() => {
    if (fetchedRelated) {
      setRelatedProducts(fetchedRelated);
    }
  }, [fetchedRelated]);

  const handleSave = () => {
    const payload = relatedProducts.map((r, i) => ({
      productId: r.productId,
      order: i + 1,
    }));

    setRelatedMutation.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["products", productId, "related"],
        });
        toast.success("Produtos relacionados salvos!");
        onClose();
      },
      onError: (error) => {
        toast.error(
          error.message || "Erro ao salvar relacionados. Tente novamente.",
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="w-full max-w-lg sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Produtos Relacionados</DialogTitle>
          <p className="text-sm text-muted-foreground truncate">{productName}</p>
        </DialogHeader>

        <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-400">
          <Info className="h-3.5 w-3.5 shrink-0 mt-px" />
          <p>
            A relação é <strong>unidirecional</strong>: vincular A → B não cria B → A automaticamente.
            Os produtos exibidos abaixo podem incluir <strong>sugestões automáticas por categoria</strong> — remova os que não deseja manter antes de salvar.
          </p>
        </div>

        <RelatedProductsSection
          productId={productId}
          relatedProducts={relatedProducts}
          onChange={setRelatedProducts}
        />

        <div className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={setRelatedMutation.isPending}
            className="bg-bee-gold hover:bg-bee-amber text-black font-semibold"
          >
            {setRelatedMutation.isPending ? "Salvando..." : "Salvar Relacionados"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
