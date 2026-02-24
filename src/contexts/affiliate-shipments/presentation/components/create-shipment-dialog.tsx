"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Trash2, Search, Users, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MonthPicker } from "@/components/ui/month-picker";
import { useProducts } from "@/contexts/products/presentation/hooks/use-products";
import { useAffiliates } from "@/contexts/affiliates/presentation/hooks/use-affiliates";
import {
  createShipmentSchema,
  CreateShipmentFormValues,
} from "../schemas/shipment.schema";
import { useCreateShipment } from "../hooks/use-create-shipment";

interface CreateShipmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultAffiliateId?: string;
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function CreateShipmentDialog({
  open,
  onOpenChange,
  defaultAffiliateId,
}: CreateShipmentDialogProps) {
  const createShipment = useCreateShipment();
  const { data: affiliates = [] } = useAffiliates();

  const defaultMonth = new Date().toISOString().slice(0, 7);

  const form = useForm<CreateShipmentFormValues>({
    resolver: zodResolver(createShipmentSchema),
    defaultValues: {
      affiliateId: defaultAffiliateId ?? "",
      referenceMonth: defaultMonth,
      notes: "",
      items: [],
    },
  });

  // Reset affiliateId when defaultAffiliateId changes
  useEffect(() => {
    if (defaultAffiliateId) {
      form.setValue("affiliateId", defaultAffiliateId);
    }
  }, [defaultAffiliateId, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items");
  const totalCost = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unitCost || 0),
    0,
  );

  // Affiliate search state
  const [affiliateSearch, setAffiliateSearch] = useState("");
  const [debouncedAffiliateSearch, setDebouncedAffiliateSearch] = useState("");
  const [showAffiliateDropdown, setShowAffiliateDropdown] = useState(false);
  const selectedAffiliateId = form.watch("affiliateId");
  const selectedAffiliateName = useMemo(
    () => affiliates.find((a) => a.id === selectedAffiliateId)?.name ?? "",
    [affiliates, selectedAffiliateId],
  );

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedAffiliateSearch(affiliateSearch.trim().toLowerCase()),
      300,
    );
    return () => clearTimeout(timer);
  }, [affiliateSearch]);

  const filteredAffiliates = useMemo(() => {
    if (!debouncedAffiliateSearch) return affiliates;
    return affiliates.filter((a) =>
      a.name.toLowerCase().includes(debouncedAffiliateSearch),
    );
  }, [affiliates, debouncedAffiliateSearch]);

  const handleSelectAffiliate = (id: string) => {
    form.setValue("affiliateId", id, { shouldValidate: true });
    setAffiliateSearch("");
    setShowAffiliateDropdown(false);
  };

  const handleClearAffiliate = () => {
    form.setValue("affiliateId", "", { shouldValidate: true });
    setAffiliateSearch("");
  };

  // Product search state
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      400,
    );
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: searchResults } = useProducts(1, 8, debouncedSearch);

  const handleAddProduct = (product: {
    id: string;
    name: string;
    costPrice?: number;
  }) => {
    const alreadyAdded = items.some((i) => i.productId === product.id);
    if (alreadyAdded) {
      toast.error("Produto já adicionado");
      return;
    }
    append({
      productId: product.id,
      productName: product.name,
      quantity: 1,
      unitCost: product.costPrice ?? 0,
    });
    setSearchInput("");
    setDebouncedSearch("");
    setShowDropdown(false);
  };

  const handleSubmit = form.handleSubmit((values) => {
    createShipment.mutate(
      {
        affiliateId: values.affiliateId,
        data: {
          referenceMonth: values.referenceMonth,
          notes: values.notes,
          items: values.items.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
        },
      },
      {
        onSuccess: () => {
          toast.success("Bonificação criada com sucesso!");
          form.reset({
            affiliateId: defaultAffiliateId ?? "",
            referenceMonth: defaultMonth,
            notes: "",
            items: [],
          });
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(err.message || "Erro ao criar bonificação");
        },
      },
    );
  });

  const handleClose = () => {
    form.reset({
      affiliateId: defaultAffiliateId ?? "",
      referenceMonth: defaultMonth,
      notes: "",
      items: [],
    });
    setAffiliateSearch("");
    setSearchInput("");
    setDebouncedSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Bonificação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Afiliado + Mês */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Afiliado <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                {selectedAffiliateId ? (
                  <div className="flex items-center h-9 rounded-md border bg-card px-3 gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate flex-1">
                      {selectedAffiliateName}
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAffiliate}
                      className="p-0.5 rounded hover:bg-muted transition-colors shrink-0"
                    >
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar afiliado..."
                        value={affiliateSearch}
                        onChange={(e) => {
                          setAffiliateSearch(e.target.value);
                          setShowAffiliateDropdown(true);
                        }}
                        onFocus={() => setShowAffiliateDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowAffiliateDropdown(false), 200)
                        }
                        className="pl-9"
                      />
                    </div>
                    {showAffiliateDropdown && filteredAffiliates.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-lg divide-y max-h-48 overflow-y-auto">
                        {filteredAffiliates.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onMouseDown={() => handleSelectAffiliate(a.id)}
                            className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                          >
                            <span className="text-sm truncate">{a.name}</span>
                            {a.categoryName && (
                              <span className="text-xs text-muted-foreground ml-2 shrink-0">
                                {a.categoryName}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {showAffiliateDropdown &&
                      debouncedAffiliateSearch &&
                      filteredAffiliates.length === 0 && (
                        <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-sm px-3 py-2.5">
                          <p className="text-xs text-muted-foreground">
                            Nenhum afiliado encontrado.
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
              {form.formState.errors.affiliateId && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.affiliateId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Mês de referência <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={form.control}
                name="referenceMonth"
                render={({ field }) => (
                  <MonthPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione o mês"
                  />
                )}
              />
              {form.formState.errors.referenceMonth && (
                <p className="text-destructive text-xs">
                  {form.formState.errors.referenceMonth.message}
                </p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-1.5">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Observações opcionais sobre o envio..."
              rows={2}
              {...form.register("notes")}
            />
          </div>

          {/* Produtos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Produtos <span className="text-destructive">*</span>
              </Label>
            </div>

            {form.formState.errors.items &&
              !Array.isArray(form.formState.errors.items) && (
                <p className="text-destructive text-xs">
                  {
                    (form.formState.errors.items as { message?: string })
                      .message
                  }
                </p>
              )}

            {/* Product search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produto para adicionar..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowDropdown(false), 200)
                  }
                  className="pl-9"
                />
              </div>
              {showDropdown &&
                debouncedSearch &&
                (searchResults?.data ?? []).length > 0 && (
                  <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-lg divide-y max-h-48 overflow-y-auto">
                    {(searchResults?.data ?? []).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onMouseDown={() => handleAddProduct(p)}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                      >
                        <span className="text-sm truncate">{p.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 shrink-0">
                          {p.costPrice != null
                            ? brl.format(p.costPrice)
                            : "—"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              {showDropdown &&
                debouncedSearch &&
                (searchResults?.data ?? []).length === 0 && (
                  <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-sm px-3 py-2.5">
                    <p className="text-xs text-muted-foreground">
                      Nenhum produto encontrado.
                    </p>
                  </div>
                )}
            </div>

            {/* Items table */}
            {fields.length > 0 && (
              <div className="rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                          Produto
                        </th>
                        <th className="px-3 py-2 text-center font-medium text-muted-foreground w-20">
                          Qtd
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground w-24">
                          Custo unit.
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-muted-foreground w-24">
                          Total
                        </th>
                        <th className="px-3 py-2 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {fields.map((field, index) => {
                        const qty =
                          form.watch(`items.${index}.quantity`) || 0;
                        const cost =
                          form.watch(`items.${index}.unitCost`) || 0;
                        return (
                          <tr key={field.id} className="hover:bg-muted/30">
                            <td className="px-3 py-2">
                              <span className="text-sm font-medium line-clamp-1">
                                {field.productName}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <Controller
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field: f }) => (
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-7 w-16 text-center text-sm mx-auto"
                                    value={f.value}
                                    onChange={(e) =>
                                      f.onChange(
                                        Math.max(
                                          1,
                                          parseInt(e.target.value) || 1,
                                        ),
                                      )
                                    }
                                  />
                                )}
                              />
                            </td>
                            <td className="px-3 py-2 text-right text-muted-foreground">
                              {brl.format(cost)}
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              {brl.format(qty * cost)}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1 rounded text-destructive hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {fields.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum produto adicionado. Use a busca acima.
                </p>
              </div>
            )}
          </div>

          {/* Footer: total */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <span className="text-sm font-medium">Custo total do envio</span>
            <span className="text-base font-bold">
              {brl.format(totalCost)}
            </span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createShipment.isPending}
              className="bg-bee-gold hover:bg-bee-amber text-black font-semibold"
            >
              {createShipment.isPending
                ? "Salvando..."
                : "Salvar bonificação"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
