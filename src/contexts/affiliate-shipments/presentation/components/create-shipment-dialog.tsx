"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Trash2,
  Search,
  Users,
  X,
  ChevronDown,
  Gift,
  Package,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MonthPicker } from "@/components/ui/month-picker";
import { useProducts } from "@/contexts/products/presentation/hooks/use-products";
import { useGiftTiers } from "@/contexts/gift-tiers/presentation/hooks/use-gift-tiers";
import { useAffiliates } from "@/contexts/affiliates/presentation/hooks/use-affiliates";
import {
  createShipmentSchema,
  CreateShipmentFormValues,
} from "../schemas/shipment.schema";
import { useCreateShipment } from "../hooks/use-create-shipment";
import type { ProductVariant } from "@/contexts/products/domain/entities/product";
import type { GiftTier } from "@/contexts/gift-tiers/domain/entities/gift-tier";

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

  // ─── Affiliate search ───────────────────────────────────────────────────────
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

  // ─── Item type toggle ───────────────────────────────────────────────────────
  const [itemType, setItemType] = useState<"variant" | "gift">("variant");

  // ─── Variant (product → variant) cascade ───────────────────────────────────
  const [productSearch, setProductSearch] = useState("");
  const [debouncedProductSearch, setDebouncedProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductVariants, setSelectedProductVariants] = useState<
    ProductVariant[]
  >([]);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedProductSearch(productSearch.trim()),
      400,
    );
    return () => clearTimeout(timer);
  }, [productSearch]);

  const { data: productSearchResults } = useProducts(
    1,
    8,
    debouncedProductSearch,
  );

  const activeVariants = useMemo(
    () => selectedProductVariants.filter((v) => v.isActive !== false),
    [selectedProductVariants],
  );

  const handleSelectProduct = (product: {
    id: string;
    name: string;
    variants: ProductVariant[];
  }) => {
    setSelectedProductId(product.id);
    setSelectedProductName(product.name);
    setSelectedProductVariants(product.variants);
    setProductSearch("");
    setShowProductDropdown(false);
  };

  const handleAddVariant = (variant: ProductVariant) => {
    const alreadyAdded = items.some((i) => i.variantId === variant.id);
    if (alreadyAdded) {
      toast.error("Variante já adicionada");
      return;
    }
    append({
      variantId: variant.id,
      productName: `${selectedProductName} - ${variant.name}`,
      quantity: 1,
      unitCost: variant.unitCost ?? 0,
      unitsPerVariant: variant.unitsPerVariant,
      unitAcronym: variant.unit?.acronym ?? variant.unit?.name,
    });
    resetProductSelection();
  };

  const resetProductSelection = () => {
    setSelectedProductId("");
    setSelectedProductName("");
    setSelectedProductVariants([]);
    setProductSearch("");
    setShowProductDropdown(false);
    setShowVariantDropdown(false);
  };

  // ─── Gift tier search ───────────────────────────────────────────────────────
  const [giftSearch, setGiftSearch] = useState("");
  const [debouncedGiftSearch, setDebouncedGiftSearch] = useState("");
  const [showGiftDropdown, setShowGiftDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedGiftSearch(giftSearch.trim().toLowerCase()),
      300,
    );
    return () => clearTimeout(timer);
  }, [giftSearch]);

  const { data: allGiftTiers = [] } = useGiftTiers();

  const filteredGiftTiers = useMemo(() => {
    if (!debouncedGiftSearch) return allGiftTiers;
    return allGiftTiers.filter((g) =>
      g.name.toLowerCase().includes(debouncedGiftSearch),
    );
  }, [allGiftTiers, debouncedGiftSearch]);

  const handleAddGift = (giftTier: GiftTier) => {
    const alreadyAdded = items.some((i) => i.giftTierId === giftTier.id);
    if (alreadyAdded) {
      toast.error("Brinde já adicionado");
      return;
    }
    append({
      giftTierId: giftTier.id,
      productName: giftTier.name,
      quantity: 1,
      unitCost: 0,
    });
    resetGiftSelection();
  };

  const resetGiftSelection = () => {
    setGiftSearch("");
    setShowGiftDropdown(false);
  };

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = form.handleSubmit((values) => {
    createShipment.mutate(
      {
        affiliateId: values.affiliateId,
        data: {
          referenceMonth: values.referenceMonth,
          notes: values.notes,
          items: values.items.map(({ variantId, giftTierId, quantity }) =>
            variantId ? { variantId, quantity } : { giftTierId, quantity },
          ),
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

  // ─── Close / reset ──────────────────────────────────────────────────────────
  const handleClose = () => {
    form.reset({
      affiliateId: defaultAffiliateId ?? "",
      referenceMonth: defaultMonth,
      notes: "",
      items: [],
    });
    setAffiliateSearch("");
    setItemType("variant");
    resetProductSelection();
    resetGiftSelection();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="w-full max-w-none sm:max-w-2xl max-h-[90dvh] overflow-y-auto"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="text-left">
          <DialogTitle className="text-base flex items-center gap-2">
            <Gift className="h-4 w-4 text-bee-gold shrink-0" />
            Nova Bonificação
          </DialogTitle>
          <DialogDescription className="pl-6">
            Lance envios de produtos para afiliados
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Afiliado + Mês */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                Afiliado <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                {selectedAffiliateId ? (
                  <div className="flex items-center h-11 rounded-lg border bg-muted/30 px-3 gap-2">
                    <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate flex-1">
                      {selectedAffiliateName}
                    </span>
                    <button
                      type="button"
                      onClick={handleClearAffiliate}
                      className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0 touch-manipulation"
                    >
                      <X className="h-4 w-4" />
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
                        }}
                        onFocus={() => setShowAffiliateDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowAffiliateDropdown(false), 200)
                        }
                        className="pl-9 h-11"
                      />
                    </div>
                    {showAffiliateDropdown && filteredAffiliates.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-lg divide-y max-h-48 overflow-y-auto">
                        {filteredAffiliates.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onMouseDown={() => handleSelectAffiliate(a.id)}
                            className="w-full flex items-center justify-between px-3 py-3 hover:bg-muted/50 transition-colors text-left touch-manipulation"
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
                        <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-sm px-3 py-3">
                          <p className="text-xs text-muted-foreground">
                            Nenhum afiliado encontrado.
                          </p>
                        </div>
                      )}
                  </>
                )}
              </div>
              {form.formState.errors.affiliateId && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.affiliateId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
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
                <p className="text-destructive text-sm">
                  {form.formState.errors.referenceMonth.message}
                </p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>
              Observações{" "}
              <span className="text-muted-foreground/60 font-normal">
                (opcional)
              </span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Observações opcionais sobre o envio..."
              rows={2}
              {...form.register("notes")}
              className="resize-none"
            />
          </div>

          {/* Itens */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>
                Itens <span className="text-destructive">*</span>
              </Label>
              {fields.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {fields.length} {fields.length === 1 ? "item" : "itens"}
                </Badge>
              )}
            </div>

            {form.formState.errors.items &&
              !Array.isArray(form.formState.errors.items) && (
                <p className="text-destructive text-sm">
                  {
                    (form.formState.errors.items as { message?: string })
                      .message
                  }
                </p>
              )}

            {/* Item type toggle */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setItemType("variant")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                  itemType === "variant"
                    ? "bg-bee-gold border-bee-gold text-black"
                    : "border-input bg-background hover:bg-muted/50 text-foreground"
                }`}
              >
                <Package className="h-3.5 w-3.5" />
                Produto com variante
              </button>
              <button
                type="button"
                onClick={() => setItemType("gift")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors ${
                  itemType === "gift"
                    ? "bg-bee-gold border-bee-gold text-black"
                    : "border-input bg-background hover:bg-muted/50 text-foreground"
                }`}
              >
                <Gift className="h-3.5 w-3.5" />
                Brinde
              </button>
            </div>

            {/* Variant item-add flow */}
            {itemType === "variant" && (
              <div className="relative">
                {!selectedProductId ? (
                  /* Step 1: search product */
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar produto..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDropdown(e.target.value.length > 0);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowProductDropdown(false), 200)
                      }
                      className="pl-9 h-11"
                    />
                    {showProductDropdown &&
                      debouncedProductSearch &&
                      ((productSearchResults?.data ?? []).length > 0 ? (
                        <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-lg divide-y max-h-48 overflow-y-auto">
                          {(productSearchResults?.data ?? []).map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onMouseDown={() =>
                                handleSelectProduct({
                                  id: p.id,
                                  name: p.name,
                                  variants: p.variants,
                                })
                              }
                              className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                            >
                              <span className="text-sm truncate">{p.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-sm px-3 py-2.5">
                          <p className="text-xs text-muted-foreground">
                            Nenhum produto encontrado.
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  /* Step 2: product selected, pick variant */
                  <div className="flex items-center gap-2">
                    <div className="flex items-center h-11 rounded-lg border bg-muted/30 px-3 gap-2 flex-1 min-w-0">
                      <span className="text-sm truncate flex-1">
                        {selectedProductName}
                      </span>
                      <button
                        type="button"
                        onClick={resetProductSelection}
                        className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0 touch-manipulation"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setShowVariantDropdown(!showVariantDropdown)
                        }
                        onBlur={() =>
                          setTimeout(() => setShowVariantDropdown(false), 200)
                        }
                        className="flex items-center h-11 rounded-lg border bg-card px-3 gap-1.5 text-sm hover:bg-muted/50 transition-colors whitespace-nowrap"
                      >
                        Selecionar variante
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {showVariantDropdown &&
                        (activeVariants.length > 0 ? (
                          <div className="absolute z-50 right-0 mt-1 rounded-lg border bg-card shadow-lg divide-y max-h-48 overflow-y-auto min-w-60">
                            {activeVariants.map((v) => (
                              <button
                                key={v.id}
                                type="button"
                                onMouseDown={() => handleAddVariant(v)}
                                className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                              >
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm">{v.name}</span>
                                  {v.sku && (
                                    <span className="text-xs text-muted-foreground">
                                      {v.sku}
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground ml-2 shrink-0">
                                  {v.unitCost ? brl.format(v.unitCost) : "-"}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="absolute z-50 right-0 mt-1 rounded-lg border bg-card shadow-sm px-3 py-2.5 min-w-60">
                            <p className="text-xs text-muted-foreground">
                              {selectedProductId
                                ? "Nenhuma variante ativa."
                                : "Carregando variantes..."}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Gift item-add flow */}
            {itemType === "gift" && (
              <div className="relative">
                <div className="relative">
                  <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar brinde..."
                    value={giftSearch}
                    onChange={(e) => {
                      setGiftSearch(e.target.value);
                      setShowGiftDropdown(e.target.value.length > 0);
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowGiftDropdown(false), 200)
                    }
                    className="pl-9 h-11"
                  />
                </div>
                {showGiftDropdown && filteredGiftTiers.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-lg divide-y max-h-48 overflow-y-auto">
                    {filteredGiftTiers.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onMouseDown={() => handleAddGift(g)}
                        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors text-left"
                      >
                        <span className="text-sm truncate">{g.name}</span>
                        <span className="text-xs text-muted-foreground ml-2 shrink-0">
                          Brinde
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {showGiftDropdown &&
                  debouncedGiftSearch &&
                  filteredGiftTiers.length === 0 && (
                    <div className="absolute z-50 w-full mt-1 rounded-lg border bg-card shadow-sm px-3 py-2.5">
                      <p className="text-xs text-muted-foreground">
                        Nenhum brinde encontrado.
                      </p>
                    </div>
                  )}
              </div>
            )}

            {/* Items table */}
            {fields.length > 0 && (
              <div className="rounded-lg border overflow-hidden">
                {/* Desktop: Tabela */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full table-fixed text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                          Produto
                        </th>
                        <th className="px-3 py-2 text-center font-medium text-muted-foreground w-20">
                          Quantidade
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
                        const qty = form.watch(`items.${index}.quantity`) || 0;
                        const cost = form.watch(`items.${index}.unitCost`) || 0;
                        const isGift = !!field.giftTierId;
                        return (
                          <tr
                            key={field.id}
                            className="hover:bg-muted/30 transition-colors group"
                          >
                            <td className="px-3 py-2">
                              <div className="flex flex-col min-w-0">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-sm font-medium line-clamp-1">
                                    {field.productName}
                                  </span>
                                  {isGift && (
                                    <Badge
                                      variant="secondary"
                                      className="h-5 gap-1 px-1.5 text-xs shrink-0"
                                    >
                                      <Gift className="h-3 w-3" />
                                      Brinde
                                    </Badge>
                                  )}
                                </div>
                                {!isGift && (
                                  <span className="text-xs text-muted-foreground">
                                    {field.unitsPerVariant}{" "}
                                    {field.unitAcronym ?? "un"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 w-20 min-w-0">
                              <Controller
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field: f }) => (
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-8 w-full text-center text-sm"
                                    value={f.value}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      // Permite valor vazio durante digitação
                                      if (value === "") {
                                        f.onChange("");
                                      } else {
                                        const parsed = parseInt(value);
                                        if (!isNaN(parsed)) {
                                          f.onChange(parsed);
                                        }
                                      }
                                    }}
                                    onBlur={(e) => {
                                      // Valida mínimo de 1 ao perder o foco
                                      const parsed = parseInt(e.target.value);
                                      f.onChange(Math.max(1, parsed || 1));
                                    }}
                                  />
                                )}
                              />
                            </td>
                            <td className="px-3 py-2 text-right text-muted-foreground w-24 min-w-0">
                              {isGift ? "—" : brl.format(cost)}
                            </td>
                            <td className="px-3 py-2 text-right font-medium w-24 min-w-0">
                              {isGift ? "—" : brl.format(qty * cost)}
                            </td>
                            <td className="px-3 py-2">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-1 rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
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

                {/* Mobile: Cards */}
                <div className="sm:hidden divide-y">
                  {fields.map((field, index) => {
                    const qty = form.watch(`items.${index}.quantity`) || 0;
                    const cost = form.watch(`items.${index}.unitCost`) || 0;
                    const isGift = !!field.giftTierId;
                    return (
                      <div key={field.id} className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-sm font-medium line-clamp-2">
                                {field.productName}
                              </span>
                              {isGift && (
                                <Badge
                                  variant="secondary"
                                  className="h-5 gap-1 px-1.5 text-xs shrink-0"
                                >
                                  <Gift className="h-3 w-3" />
                                  Brinde
                                </Badge>
                              )}
                            </div>
                            {!isGift && (
                              <span className="text-xs text-muted-foreground mt-0.5">
                                {field.unitsPerVariant} {field.unitAcronym ?? "un"}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors touch-manipulation shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 flex-1">
                            <Label htmlFor={`qty-mobile-${index}`} className="text-sm">
                              Quantidade
                            </Label>
                            <Controller
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field: f }) => (
                                <Input
                                  id={`qty-mobile-${index}`}
                                  type="number"
                                  min={1}
                                  className="h-11 w-20 text-center"
                                  value={f.value}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "") {
                                      f.onChange("");
                                    } else {
                                      const parsed = parseInt(value);
                                      if (!isNaN(parsed)) {
                                        f.onChange(parsed);
                                      }
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const parsed = parseInt(e.target.value);
                                    f.onChange(Math.max(1, parsed || 1));
                                  }}
                                />
                              )}
                            />
                          </div>

                          {!isGift && (
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm text-muted-foreground">Custo:</span>
                              <span className="text-sm font-medium">
                                {brl.format(cost)}
                              </span>
                            </div>
                          )}
                        </div>

                        {!isGift && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total:</span>
                            <span className="font-bold">{brl.format(qty * cost)}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {fields.length === 0 && (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhum item adicionado. Use a busca acima.
                </p>
              </div>
            )}
          </div>

          {/* Footer: total */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg bg-muted/50 px-4 py-3 gap-2 sm:gap-0">
            <span className="text-sm font-medium">Custo total do envio</span>
            <span className="text-base font-bold">{brl.format(totalCost)}</span>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 flex-col sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="w-full sm:w-auto h-11"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={createShipment.isPending}
              className="w-full sm:w-auto h-11 bg-bee-gold hover:bg-bee-amber text-black shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            >
              {createShipment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar bonificação"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
