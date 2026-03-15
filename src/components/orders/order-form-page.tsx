"use client";

import { useState, useCallback, Fragment, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Banknote,
  Ban,
  Barcode,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Gift,
  Instagram,
  Loader2,
  MapPin,
  MessageSquare,
  Minus,
  Package,
  Percent,
  Plus,
  QrCode,
  Search,
  ShoppingCart,
  Globe,
  Store,
  Trash2,
  Truck,
  User,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useCreateOrder } from "@/contexts/orders/presentation/hooks/use-create-order";
import { useUpdateOrder } from "@/contexts/orders/presentation/hooks/use-update-order";
import type { OrderDetail } from "@/contexts/orders/domain/entities/order";
import { ShippingOptionsSelector } from "@/shared/presentation/components/shipping-options-selector";
import type { ShippingOption } from "@/shared/infrastructure/api/shipping/types";
import { useAddressLookup } from "@/shared/presentation/hooks/use-address-lookup";
import { CurrencyInput } from "@/shared/presentation/components/currency-input";
import { useRepresentatives } from "@/contexts/representatives/presentation/hooks/use-representatives";
import { useRepresentativeCustomers } from "@/contexts/representatives/presentation/hooks/use-representative-customers";
import { useVendedores } from "@/contexts/vendedores/presentation/hooks/use-vendedores";

interface GiftTier {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  minOrderValue: number;
  isActive: boolean;
}

interface OrderFormPageProps {
  mode: 'create' | 'edit';
  initialData?: OrderDetail;
  orderId?: string;
}

function GiftImageWithDialog({ src, alt }: { src?: string; alt: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) {
    return (
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
        <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 group"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg border-2 border-transparent group-hover:border-bee-gold/50 transition-all duration-200"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-lg max-h-[90dvh] overflow-y-auto p-2">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <DialogDescription className="sr-only">
            Imagem do brinde {alt}
          </DialogDescription>
          <img src={src} alt={alt} className="w-full h-auto rounded-lg" />
        </DialogContent>
      </Dialog>
    </>
  );
}

interface CustomerResult {
  id: string;
  name: string;
  email: string;
}

interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

interface CustomerDetail extends CustomerResult {
  address?: CustomerAddress;
}

type PriceType = "common" | "retailer" | "distributor";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  retailerPrice?: number;
  distributorPrice?: number;
  isRetailerVariant?: boolean;
  hasFreeShipping?: boolean;
  unitsPerVariant?: number;
  unitCost?: number;
}

interface ProductResult {
  id: string;
  name: string;
  variants: ProductVariant[];
}

interface CartItem {
  itemKey: string;
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  priceType?: "COMMON" | "RETAILER" | "DISTRIBUTOR";
  isGift?: boolean;
}

type DeliveryType = "PICKUP" | "DELIVERY" | "NONE" | "";

const DELIVERY_TYPES = [
  { value: "PICKUP" as const, label: "Retirada", icon: MapPin },
  { value: "DELIVERY" as const, label: "Entrega", icon: Truck },
  { value: "NONE" as const, label: "Sem frete", icon: Ban },
];

const ORDER_SOURCES = [
  { value: "WHATSAPP" as const, label: "WhatsApp", icon: MessageSquare },
  { value: "IN_STORE" as const, label: "Loja Física", icon: Store },
  { value: "INSTAGRAM" as const, label: "Instagram", icon: Instagram },
  { value: "REPRESENTATIVE" as const, label: "Representante", icon: Briefcase },
];

const PAYMENT_METHODS = [
  { value: "PIX", label: "Pix", icon: QrCode },
  { value: "CASH", label: "Dinheiro", icon: Banknote },
  { value: "CREDIT_CARD", label: "Crédito", icon: CreditCard },
  { value: "DEBIT_CARD", label: "Débito", icon: CreditCard },
  { value: "BOLETO", label: "Boleto", icon: Barcode },
];

const PAYMENT_METHODS_FOR_PAYMENTS = [
  { value: "PIX", label: "Pix", icon: QrCode },
  { value: "CREDIT_CARD", label: "Crédito", icon: CreditCard },
  { value: "DEBIT_CARD", label: "Débito", icon: CreditCard },
  { value: "BOLETO", label: "Boleto", icon: Barcode },
];

interface PaymentEntry {
  id: string;
  method: string;
  amount: number;
  boletoDueDays: 30 | 60;
}

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function CustomerSearch({
  onSelect,
  selected,
  onClear,
}: {
  onSelect: (customer: CustomerResult) => void;
  selected: CustomerResult | null;
  onClear: () => void;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["customers-search", debouncedSearch],
    queryFn: () =>
      apiFetch<{ customers: CustomerResult[] }>(
        `/admin/customers?search=${encodeURIComponent(debouncedSearch)}&limit=8&page=1`,
      ),
    enabled: debouncedSearch.length >= 2,
  });

  if (selected) {
    return (
      <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{selected.name}</p>
            <p className="text-xs text-muted-foreground">{selected.email}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClear}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cliente por nome ou e-mail..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="pl-9"
        />
      </div>
      {open && debouncedSearch.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          {isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
          )}
          {!isLoading && (!data?.customers || data.customers.length === 0) && (
            <p className="p-3 text-sm text-muted-foreground">
              Nenhum cliente encontrado.
            </p>
          )}
          {data?.customers.map((c) => (
            <button
              key={c.id}
              className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
              onMouseDown={() => {
                onSelect(c);
                setSearch("");
                setOpen(false);
              }}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-muted-foreground">{c.email}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductSearch({ onAddItem, mode = "product" }: { onAddItem: (item: CartItem) => void; mode?: "product" | "gift" }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(
    null,
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType>("common");
  const [qty, setQty] = useState(1);

  function handleSelectVariant(v: ProductVariant) {
    setSelectedVariant(v);
    setSelectedPriceType(
      v.isRetailerVariant && v.retailerPrice != null ? "retailer" : "common",
    );
  }
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["products-search-order", debouncedSearch],
    queryFn: () =>
      apiFetch<{ data: ProductResult[] }>(
        `/admin/products?search=${encodeURIComponent(debouncedSearch)}&limit=8`,
      ),
    enabled: debouncedSearch.length >= 2,
  });

  function handleAdd() {
    if (!selectedProduct || !selectedVariant) return;

    let unitPrice: number;
    let originalPrice: number | undefined;
    let priceType: "COMMON" | "RETAILER" | "DISTRIBUTOR";

    if (mode === "gift") {
      unitPrice = selectedVariant.unitCost ?? 0;
      priceType = "COMMON";
    } else if (selectedPriceType === "retailer") {
      unitPrice = selectedVariant.retailerPrice!;
      priceType = "RETAILER";
    } else if (selectedPriceType === "distributor") {
      unitPrice = selectedVariant.distributorPrice!;
      priceType = "DISTRIBUTOR";
    } else {
      unitPrice = selectedVariant.offerPrice ?? selectedVariant.price;
      originalPrice = selectedVariant.offerPrice ? selectedVariant.price : undefined;
      priceType = "COMMON";
    }

    onAddItem({
      itemKey: `${selectedVariant.id}-${mode}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      unitPrice,
      originalPrice,
      quantity: qty,
      priceType,
      isGift: mode === "gift",
    });
    setSelectedProduct(null);
    setSelectedVariant(null);
    setSelectedPriceType("common");
    setSearch("");
    setQty(1);
  }

  if (selectedProduct) {
    return (
      <div className="rounded-lg border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{selectedProduct.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              setSelectedProduct(null);
              setSelectedVariant(null);
            }}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Escolha uma opção</Label>
          <div className="space-y-2">
            {[...selectedProduct.variants]
              .sort((a, b) => (b.unitsPerVariant ?? 0) - (a.unitsPerVariant ?? 0))
              .map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const isRetailer = v.isRetailerVariant && v.retailerPrice != null;
              const effectivePrice = isRetailer
                ? v.retailerPrice!
                : (v.offerPrice ?? v.price);
              const hasDiscount = !isRetailer && v.offerPrice != null;
              const savingsAmount = hasDiscount ? v.price - v.offerPrice! : 0;
              const savingsPct = hasDiscount ? Math.round((savingsAmount / v.price) * 100) : 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleSelectVariant(v)}
                  className={[
                    "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    isSelected
                      ? "border-bee-gold bg-bee-gold/5 ring-1 ring-bee-gold"
                      : "border-border hover:border-muted-foreground/40 hover:bg-muted/30",
                  ].join(" ")}
                >
                  {/* Radio */}
                  <div className={[
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    isSelected ? "border-bee-gold" : "border-muted-foreground/40",
                  ].join(" ")}>
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-bee-gold" />}
                  </div>

                  {/* Nome + badges + economia */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm">{v.name}</span>
                      {v.hasFreeShipping && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 dark:bg-green-950/40 dark:border-green-900 dark:text-green-400">
                          <Truck className="h-3 w-3" />
                          Frete grátis
                        </span>
                      )}
                      {isRetailer && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 dark:bg-amber-950/40 dark:border-amber-900">
                          Revendedor
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <p className="text-xs text-green-600 mt-0.5">
                        ↓ Economize {formatCurrency(savingsAmount)} ({savingsPct}%)
                      </p>
                    )}
                  </div>

                  {/* Preços */}
                  {mode !== "gift" && (
                  <div className="text-right shrink-0">
                    <>
                      {hasDiscount && (
                        <p className="text-xs text-muted-foreground line-through leading-tight">
                          {formatCurrency(v.price)}
                        </p>
                      )}
                      <p className={[
                        "font-bold text-base leading-tight",
                        hasDiscount ? "text-green-600" : "",
                      ].join(" ")}>
                        {formatCurrency(effectivePrice)}
                      </p>
                    </>
                    {v.unitsPerVariant && v.unitsPerVariant > 1 && (
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {v.unitsPerVariant} unidades
                      </p>
                    )}
                  </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {mode !== "gift" && selectedVariant?.isRetailerVariant && (
          <div className="space-y-1.5">
            <Label className="text-xs">Tipo de preço</Label>
            <div className="flex flex-wrap gap-2">
              {!selectedVariant.isRetailerVariant && (
                <button
                  type="button"
                  onClick={() => setSelectedPriceType("common")}
                  className={[
                    "flex-1 min-w-24 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                    selectedPriceType === "common"
                      ? "border-bee-gold bg-bee-gold/10 text-bee-gold"
                      : "border-border hover:border-muted-foreground/40",
                  ].join(" ")}
                >
                  <span className="block font-semibold">Comum</span>
                  <span className="text-muted-foreground font-normal">
                    {formatCurrency(selectedVariant.offerPrice ?? selectedVariant.price)}
                  </span>
                </button>
              )}
              {selectedVariant.retailerPrice != null && (
                <button
                  type="button"
                  onClick={() => setSelectedPriceType("retailer")}
                  className={[
                    "flex-1 min-w-24 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                    selectedPriceType === "retailer"
                      ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                      : "border-border hover:border-muted-foreground/40",
                  ].join(" ")}
                >
                  <span className="block font-semibold">Lojista</span>
                  <span className="text-muted-foreground font-normal">
                    {formatCurrency(selectedVariant.retailerPrice)}
                  </span>
                </button>
              )}
              {selectedVariant.distributorPrice != null && (
                <button
                  type="button"
                  onClick={() => setSelectedPriceType("distributor")}
                  className={[
                    "flex-1 min-w-24 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                    selectedPriceType === "distributor"
                      ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                      : "border-border hover:border-muted-foreground/40",
                  ].join(" ")}
                >
                  <span className="block font-semibold">Distribuidor</span>
                  <span className="text-muted-foreground font-normal">
                    {formatCurrency(selectedVariant.distributorPrice)}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="space-y-1.5 flex-1">
            <Label className="text-xs">Quantidade</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQty((q) => q + 1)}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <Button
            size="sm"
            className="self-end"
            disabled={!selectedVariant}
            onClick={handleAdd}
          >
            Adicionar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="pl-9"
        />
      </div>
      {open && debouncedSearch.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
          {isLoading && (
            <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
          )}
          {!isLoading && (!data?.data || data.data.length === 0) && (
            <p className="p-3 text-sm text-muted-foreground">
              Nenhum produto encontrado.
            </p>
          )}
          {data?.data.map((p) => (
            <button
              key={p.id}
              className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
              onMouseDown={() => {
                setSelectedProduct(p);
                setOpen(false);
              }}
            >
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.variants.length} variante(s)
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrderFormPage({ mode, initialData, orderId }: OrderFormPageProps) {
  const router = useRouter();

  // Edit mode flags derived from initialData
  const isPaid = mode === 'edit' && initialData?.paymentStatus === 'PAID';
  const isShipped = mode === 'edit' && !isPaid && (
    !!(initialData?.meShipmentId || initialData?.shippingInfo?.trackingCode) ||
    initialData?.status === 'SHIPPED' ||
    initialData?.status === 'DELIVERED'
  );
  const isReadOnly = isPaid;
  const isPaymentOnlyEdit = mode === 'edit' && !isPaid && isShipped;

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResult | null>(
      initialData ? { id: initialData.customerId, name: initialData.customerName, email: initialData.customerEmail } : null
    );
  const [cartItems, setCartItems] = useState<CartItem[]>(
    initialData
      ? initialData.items.map((item) => ({
          itemKey: item.variantId,
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantName: item.variantName,
          unitPrice: item.unitPrice,
          originalPrice: item.originalPrice,
          quantity: item.quantity,
          priceType: item.priceType as "COMMON" | "RETAILER" | "DISTRIBUTOR" | undefined,
        }))
      : []
  );
  const [bonusItems, setBonusItems] = useState<CartItem[]>(
    initialData
      ? (initialData.bonusItems ?? []).map((item) => ({
          itemKey: `${item.variantName}-bonus`,
          productId: item.productId,
          productName: item.productName,
          variantId: item.variantId,
          variantName: item.variantName,
          unitPrice: item.unitCost ?? 0,
          quantity: item.quantity,
          isGift: true,
        }))
      : []
  );
  const [giftBonusTab, setGiftBonusTab] = useState<"brinde" | "bonus">("brinde");
  const [giftSearch, setGiftSearch] = useState("");
  const [giftSearchOpen, setGiftSearchOpen] = useState(false);
  const [payments, setPayments] = useState<PaymentEntry[]>(
    initialData
      ? initialData.payments.map((p) => ({
          id: crypto.randomUUID(),
          method: p.paymentMethod,
          amount: p.amount,
          boletoDueDays: 30 as 30 | 60,
        }))
      : []
  );
  const isEcommerceOrder = initialData?.source === "ECOMMERCE";
  const [orderSource, setOrderSource] = useState<
    "WHATSAPP" | "IN_STORE" | "INSTAGRAM" | "REPRESENTATIVE" | "ECOMMERCE" | ""
  >(
    initialData?.source ?? ""
  );
  const [selectedRepresentative, setSelectedRepresentative] = useState<{ id: string; name: string } | null>(
    initialData?.representativeId ? { id: initialData.representativeId, name: initialData.representativeName ?? '' } : null
  );
  const [selectedVendedor, setSelectedVendedor] = useState<{ id: string; name: string } | null>(
    initialData?.vendedorId ? { id: initialData.vendedorId, name: initialData.vendedorName ?? '' } : null
  );
  const [couponCode, setCouponCode] = useState(initialData?.couponCode ?? "");
  const [discount, setDiscount] = useState<{ type: "ABSOLUTE" | "PERCENTAGE"; value: number } | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedGifts, setSelectedGifts] = useState<Record<string, number>>(
    initialData
      ? Object.fromEntries((initialData.gifts ?? []).map((g) => [g.giftTierId, g.quantity]))
      : {}
  );
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(
    initialData ? (initialData.shippingInfo.price > 0 ? "DELIVERY" : "NONE") : ""
  );
  const [shippingFormOpen, setShippingFormOpen] = useState(false);
  const [addressOverrides, setAddressOverrides] = useState<
    Partial<
      Record<
        | "street"
        | "number"
        | "complement"
        | "neighborhood"
        | "city"
        | "state"
        | "zipCode",
        string
      >
    >
  >(
    initialData
      ? {
          street: initialData.shippingAddress.street,
          number: initialData.shippingAddress.number,
          complement: initialData.shippingAddress.complement ?? "",
          neighborhood: initialData.shippingAddress.neighborhood,
          city: initialData.shippingAddress.city,
          state: initialData.shippingAddress.state,
          zipCode: initialData.shippingAddress.zipCode,
        }
      : {}
  );
  const [shippingInfo, setShippingInfo] = useState({
    carrier: initialData?.shippingInfo.carrier ?? "",
    service: initialData?.shippingInfo.service ?? "",
    serviceCode: undefined as number | undefined,
    price: String(initialData?.shippingInfo.price ?? "0"),
    deliveryTime: String(initialData?.shippingInfo.deliveryTime ?? "0"),
  });
  const [selectedShippingOption, setSelectedShippingOption] =
    useState<ShippingOption | null>(null);
  const [useManualShipping, setUseManualShipping] = useState(false);
  const [addressAutoFilled, setAddressAutoFilled] = useState(false);

  // Layout states for collapsibles
  const [isIdentificationOpen, setIsIdentificationOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(true);

  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder(orderId ?? '');
  const addressLookup = useAddressLookup();

  const isRepresentativeSource = orderSource === "REPRESENTATIVE";
  const isVendedorSource = orderSource && orderSource !== "REPRESENTATIVE" && orderSource !== "ECOMMERCE";
  const [repSearch, setRepSearch] = useState("");
  const debouncedRepSearch = useDebounce(repSearch, 300);
  const [repCustomerSearch, setRepCustomerSearch] = useState("");
  const [vendSearch, setVendSearch] = useState("");
  const debouncedVendSearch = useDebounce(vendSearch, 300);
  const { data: representatives, isLoading: representativesLoading } = useRepresentatives(
    isRepresentativeSource && debouncedRepSearch.length >= 2 ? debouncedRepSearch : undefined,
  );
  const { data: representativeCustomers, isLoading: repCustomersLoading } = useRepresentativeCustomers(
    isRepresentativeSource ? selectedRepresentative?.id ?? null : null,
  );
  const { data: vendedores, isLoading: vendedoresLoading } = useVendedores(
    isVendedorSource && debouncedVendSearch.length >= 2 ? debouncedVendSearch : undefined,
  );

  const { data: customerDetail } = useQuery({
    queryKey: ["customer-detail", selectedCustomer?.id],
    queryFn: () =>
      apiFetch<CustomerDetail>(`/admin/customers/${selectedCustomer!.id}`),
    enabled: !!selectedCustomer?.id,
  });

  const customerAddress = customerDetail?.address;
  const effectiveAddress = {
    street: addressOverrides.street ?? customerAddress?.street ?? "",
    number: addressOverrides.number ?? customerAddress?.number ?? "",
    complement:
      addressOverrides.complement ?? customerAddress?.complement ?? "",
    neighborhood:
      addressOverrides.neighborhood ?? customerAddress?.neighborhood ?? "",
    city: addressOverrides.city ?? customerAddress?.city ?? "",
    state: addressOverrides.state ?? customerAddress?.state ?? "",
    zipCode: addressOverrides.zipCode ?? customerAddress?.zipCode ?? "",
  };
  const effectiveDeliveryType: DeliveryType =
    deliveryType || (customerAddress ? "DELIVERY" : "");

  const prevZipCodeRef = useRef(effectiveAddress.zipCode.replace(/\D/g, ""));

  function handleZipCodeChange(rawValue: string) {
    const digits = rawValue.replace(/\D/g, "");
    let formatted = digits;
    if (digits.length > 5) {
      formatted = `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
    }

    if (digits.length === 8 && digits !== prevZipCodeRef.current) {
      prevZipCodeRef.current = digits;
      setAddressOverrides((prev) => ({
        ...prev,
        zipCode: formatted,
        number: "",
        complement: "",
        street: "",
        neighborhood: "",
        city: "",
        state: "",
      }));
      setAddressAutoFilled(false);
      addressLookup.mutate(digits, {
        onSuccess: (data) => {
          setAddressOverrides((prev) => ({
            ...prev,
            street: data.street,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
          }));
          setAddressAutoFilled(true);
          setTimeout(() => setAddressAutoFilled(false), 3000);
        },
      });
    } else {
      setAddressOverrides((s) => ({
        ...s,
        zipCode: formatted,
      }));
      setAddressAutoFilled(false);
    }
  }

  const { data: giftTiersData } = useQuery({
    queryKey: ["gift-tiers"],
    queryFn: () => apiFetch<GiftTier[]>("/admin/gift-tiers"),
  });
  const activeGiftTiers = giftTiersData?.filter((g) => g.isActive) ?? [];

  function toggleGift(id: string) {
    setSelectedGifts((prev) => {
      if (id in prev) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: 1 };
    });
  }

  function setGiftQuantity(id: string, qty: number) {
    if (qty < 1) return;
    setSelectedGifts((prev) => ({ ...prev, [id]: qty }));
  }

  const debouncedCouponCode = useDebounce(couponCode, 500);
  const {
    data: couponLookup,
    isFetching: couponFetching,
    isError: couponError,
  } = useQuery({
    queryKey: ["coupon-lookup", debouncedCouponCode],
    queryFn: () =>
      apiFetch<{
        found: boolean;
        isActive?: boolean;
        code?: string;
        discountPercentage?: number;
        minCartValue?: number;
        expiresAt?: string;
      }>(`/admin/coupons/lookup/${encodeURIComponent(debouncedCouponCode)}`),
    enabled: debouncedCouponCode.length >= 2,
    retry: false,
  });

  const showCouponFeedback = debouncedCouponCode.length >= 2 && !couponFetching;
  const couponIsValid =
    showCouponFeedback &&
    !couponError &&
    couponLookup?.found &&
    couponLookup.isActive;
  const couponIsInvalid =
    showCouponFeedback &&
    (couponError ||
      (couponLookup && (!couponLookup.found || !couponLookup.isActive)));

  const handleAddItem = useCallback((item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.itemKey === item.itemKey);
      if (existing) {
        return prev.map((i) =>
          i.itemKey === item.itemKey
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const handleAddBonusItem = useCallback((item: CartItem) => {
    setBonusItems((prev) => {
      const existing = prev.find((i) => i.itemKey === item.itemKey);
      if (existing) {
        return prev.map((i) =>
          i.itemKey === item.itemKey
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  function removeItem(itemKey: string) {
    setCartItems((prev) => prev.filter((i) => i.itemKey !== itemKey));
  }

  function removeBonusItem(itemKey: string) {
    setBonusItems((prev) => prev.filter((i) => i.itemKey !== itemKey));
  }

  function updateQty(itemKey: string, qty: number) {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((i) => (i.itemKey === itemKey ? { ...i, quantity: qty } : i)),
    );
  }

  function updateBonusQty(itemKey: string, qty: number) {
    if (qty < 1) return;
    setBonusItems((prev) =>
      prev.map((i) => (i.itemKey === itemKey ? { ...i, quantity: qty } : i)),
    );
  }

  const total = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discountAmount =
    couponIsValid && couponLookup?.discountPercentage
      ? (total * couponLookup.discountPercentage) / 100
      : 0;
  const discountedTotal = total - discountAmount;
  const manualDiscountAmount = discount
    ? discount.type === "PERCENTAGE"
      ? Math.round((discountedTotal * discount.value) / 100 * 100) / 100
      : discount.value
    : 0;
  const discountExceedsTotal =
    discount !== null &&
    discount.value > 0 &&
    (discount.type === "ABSOLUTE"
      ? discount.value >= discountedTotal
      : discount.value >= 100);
  const finalTotal = Math.max(0, discountedTotal - manualDiscountAmount);

  const shippingPrice =
    effectiveDeliveryType === "DELIVERY"
      ? parseFloat(shippingInfo.price) || 0
      : 0;
  const orderTotal = finalTotal + shippingPrice;
  const paymentsSum = payments.reduce((sum, p) => sum + p.amount, 0);
  const paymentsMatch = Math.abs(paymentsSum - orderTotal) <= 0.01;

  function addPayment(method = "") {
    const remaining = Math.max(0, orderTotal - paymentsSum);
    setPayments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), method, amount: prev.length === 0 && remaining === 0 ? orderTotal : remaining, boletoDueDays: 30 },
    ]);
  }

  function removePayment(id: string) {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  }

  function updatePayment(id: string, changes: Partial<Omit<PaymentEntry, "id">>) {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );
  }

  const handleSelectShippingOption = useCallback((option: ShippingOption) => {
    setSelectedShippingOption(option);
    setShippingInfo({
      carrier: option.carrier,
      service: option.service,
      serviceCode: option.serviceCode,
      price: String(option.price),
      deliveryTime: String(option.deliveryTime),
    });
    setUseManualShipping(false);
  }, []);

  const handleManualShippingFallback = useCallback(() => {
    setUseManualShipping(true);
    setSelectedShippingOption(null);
    setShippingInfo({
      carrier: "",
      service: "",
      serviceCode: undefined,
      price: "0",
      deliveryTime: "0",
    });
  }, []);

  function canProceed(): boolean {
    if (!orderSource || !selectedCustomer) return false;
    if (isRepresentativeSource && !selectedRepresentative) return false;
    if (cartItems.length === 0) return false;
    if (!effectiveDeliveryType) return false;
    if (payments.length === 0) return false;
    const allPaymentsValid = payments.every(
      (p) => p.method && p.amount > 0,
    );
    if (!allPaymentsValid || !paymentsMatch) return false;
    if (discountExceedsTotal) return false;
    if (effectiveDeliveryType !== "DELIVERY") return true;
    return (
      !!effectiveAddress.street &&
      !!effectiveAddress.number &&
      !!shippingInfo.carrier &&
      !!shippingInfo.service
    );
  }

  function handleSubmit() {
    if (isReadOnly) return;
    if (isPaymentOnlyEdit) {
      updateOrderMutation.mutate(
        {
          payments: payments.map((p) => ({
            method: p.method,
            amount: p.amount,
            ...(p.method === "BOLETO" ? { boletoDueDays: p.boletoDueDays } : {}),
          })),
        },
        { onSuccess: () => router.push("/dashboard/orders") },
      );
      return;
    }
    if (!selectedCustomer || !orderSource) return;
    const payload = {
      customerId: selectedCustomer.id,
      items: cartItems.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
        price: i.unitPrice,
        originalPrice: i.originalPrice,
        priceType: i.priceType,
      })),
      bonusItems: bonusItems.length > 0
        ? bonusItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            unitCost: i.unitPrice > 0 ? i.unitPrice : undefined,
          }))
        : undefined,
      payments: payments.map((p) => ({
        method: p.method,
        amount: p.amount,
        ...(p.method === "BOLETO" ? { boletoDueDays: p.boletoDueDays } : {}),
      })),
      source: orderSource,
      couponCode: couponCode || undefined,
      discount: discount && discount.value > 0 ? discount : undefined,
      shippingAddress:
        effectiveDeliveryType === "DELIVERY"
          ? {
              street: effectiveAddress.street,
              number: effectiveAddress.number,
              complement: effectiveAddress.complement || undefined,
              neighborhood: effectiveAddress.neighborhood,
              city: effectiveAddress.city,
              state: effectiveAddress.state,
              zipCode: effectiveAddress.zipCode,
            }
          : undefined,
      shippingInfo:
        effectiveDeliveryType === "DELIVERY"
          ? {
              carrier: shippingInfo.carrier,
              service: shippingInfo.service,
              serviceCode: shippingInfo.serviceCode,
              price: parseFloat(shippingInfo.price) || 0,
              deliveryTime: parseInt(shippingInfo.deliveryTime) || 0,
            }
          : undefined,
      gifts: Object.keys(selectedGifts).length > 0
        ? Object.entries(selectedGifts).map(([giftTierId, quantity]) => ({ giftTierId, quantity }))
        : undefined,
      notes: notes || undefined,
      representativeId: selectedRepresentative?.id || undefined,
      vendedorId: selectedVendedor?.id || undefined,
    };
    if (mode === 'edit') {
      updateOrderMutation.mutate(payload, { onSuccess: () => router.push("/dashboard/orders") });
    } else {
      createOrderMutation.mutate(payload, { onSuccess: () => router.push("/dashboard/orders") });
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bee-gold/10 shrink-0">
            <Package className="h-5 w-5 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {mode === 'edit' ? `Editar Pedido #${initialData?.orderNumber ?? ''}` : 'Novo Pedido'}
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {mode === 'edit' ? 'Edite os dados do pedido' : 'Crie um pedido manual para vendas externas'}
            </p>
          </div>
        </div>
      </div>

      {/* Read-only banner */}
      {isReadOnly && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Este pedido já foi pago e não pode ser editado.
        </div>
      )}

      {/* Payment-only edit banner */}
      {isPaymentOnlyEdit && (
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
          Este pedido já foi enviado à transportadora. Apenas a forma de pagamento pode ser alterada.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* IDENTIFICATION CARD */}
          <div className={isPaymentOnlyEdit ? "pointer-events-none opacity-60" : ""}>
          <CollapsibleCard
            className="w-full"
            title="Identificação"
            description="Selecione a origem e o cliente para o pedido"
            open={isIdentificationOpen}
            onOpenChange={setIsIdentificationOpen}
          >
            <div className="space-y-5">
                  {/* Order source selection */}
                  <div className="space-y-1.5">
                    <Label>Origem do Pedido *</Label>
                    {isEcommerceOrder ? (
                      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-3 text-sm font-medium text-muted-foreground">
                        <Globe className="h-5 w-5" />
                        E-commerce
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {ORDER_SOURCES.map((source) => {
                          const Icon = source.icon;
                          const isSelected = orderSource === source.value;
                          return (
                            <button
                              key={source.value}
                              type="button"
                              onClick={() => {
                                setOrderSource(source.value);
                                if (source.value !== "REPRESENTATIVE") {
                                  setSelectedRepresentative(null);
                                  setSelectedCustomer(null);
                                  setAddressOverrides({});
                                  setDeliveryType("");
                                } else {
                                  setSelectedVendedor(null);
                                  setVendSearch("");
                                  setSelectedCustomer(null);
                                  setAddressOverrides({});
                                  setDeliveryType("");
                                }
                              }}
                              className={[
                                "flex flex-col items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all cursor-pointer",
                                isSelected
                                  ? "border-bee-gold bg-bee-gold/10 ring-1 ring-bee-gold text-bee-gold"
                                  : "border-border hover:border-muted-foreground/50 hover:bg-muted/40 text-foreground",
                              ].join(" ")}
                            >
                              <Icon className="h-5 w-5" />
                              {source.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Representative selector (only when source is REPRESENTATIVE) */}
                  {isRepresentativeSource && (
                    <div className="space-y-1.5">
                      <Label>Representante *</Label>
                      {selectedRepresentative ? (
                        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">{selectedRepresentative.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setSelectedRepresentative(null);
                              setSelectedCustomer(null);
                              setRepSearch("");
                              setRepCustomerSearch("");
                              setAddressOverrides({});
                              setDeliveryType("");
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar representante por nome..."
                              value={repSearch}
                              onChange={(e) => setRepSearch(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          {debouncedRepSearch.length >= 2 && (
                            <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
                              {representativesLoading && (
                                <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
                              )}
                              {!representativesLoading && (!representatives || representatives.length === 0) && (
                                <p className="p-3 text-sm text-muted-foreground">
                                  Nenhum representante encontrado.
                                </p>
                              )}
                              {representatives?.map((rep) => (
                                <button
                                  key={rep.id}
                                  type="button"
                                  className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
                                  onClick={() => {
                                    setSelectedRepresentative({ id: rep.id, name: rep.name });
                                    setSelectedCustomer(null);
                                    setRepSearch("");
                                    setRepCustomerSearch("");
                                    setAddressOverrides({});
                                    setDeliveryType("");
                                  }}
                                >
                                  <p className="font-medium">{rep.name}</p>
                                  <p className="text-xs text-muted-foreground">{rep.email}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Vendedor selector (only for non-representative, non-ecommerce sources) */}
                  {isVendedorSource && (
                    <div className="space-y-1.5">
                      <Label>Vendedor</Label>
                      {selectedVendedor ? (
                        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">{selectedVendedor.name}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => {
                              setSelectedVendedor(null);
                              setVendSearch("");
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar vendedor por nome..."
                              value={vendSearch}
                              onChange={(e) => setVendSearch(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                          {debouncedVendSearch.length >= 2 && (
                            <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
                              {vendedoresLoading && (
                                <p className="p-3 text-sm text-muted-foreground">Buscando...</p>
                              )}
                              {!vendedoresLoading && (!vendedores || vendedores.length === 0) && (
                                <p className="p-3 text-sm text-muted-foreground">
                                  Nenhum vendedor encontrado.
                                </p>
                              )}
                              {vendedores?.map((vend) => (
                                <button
                                  key={vend.id}
                                  type="button"
                                  className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
                                  onClick={() => {
                                    setSelectedVendedor({ id: vend.id, name: vend.name });
                                    setVendSearch("");
                                  }}
                                >
                                  <p className="font-medium">{vend.name}</p>
                                  <p className="text-xs text-muted-foreground">{vend.email}</p>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Customer selection */}
                  {orderSource && (!isRepresentativeSource || selectedRepresentative) && (
                    <div className="space-y-1.5">
                      <Label>Cliente *</Label>
                      {isRepresentativeSource && selectedRepresentative ? (
                        /* Representative customers - search with filtered dropdown */
                        selectedCustomer ? (
                          <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-sm font-medium">{selectedCustomer.name}</p>
                                <p className="text-xs text-muted-foreground">{selectedCustomer.email}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => {
                                setSelectedCustomer(null);
                                setRepCustomerSearch("");
                                setAddressOverrides({});
                                setDeliveryType("");
                              }}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : repCustomersLoading ? (
                          <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando clientes...
                          </div>
                        ) : !representativeCustomers || representativeCustomers.length === 0 ? (
                          <p className="text-sm text-muted-foreground p-3">
                            Nenhum cliente associado a este representante.
                          </p>
                        ) : (() => {
                          const searchLower = repCustomerSearch.toLowerCase();
                          const filtered = searchLower.length >= 2
                            ? representativeCustomers.filter(
                                (c) =>
                                  c.name.toLowerCase().includes(searchLower) ||
                                  c.email.toLowerCase().includes(searchLower),
                              )
                            : [];
                          return (
                            <div className="relative">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  placeholder="Buscar cliente por nome ou e-mail..."
                                  value={repCustomerSearch}
                                  onChange={(e) => setRepCustomerSearch(e.target.value)}
                                  className="pl-9"
                                />
                              </div>
                              {repCustomerSearch.length >= 2 && (
                                <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border bg-popover shadow-lg">
                                  {filtered.length === 0 ? (
                                    <p className="p-3 text-sm text-muted-foreground">
                                      Nenhum cliente encontrado.
                                    </p>
                                  ) : (
                                    filtered.map((c) => (
                                      <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCustomer({ id: c.id, name: c.name, email: c.email });
                                          setRepCustomerSearch("");
                                          setAddressOverrides({});
                                          setDeliveryType("");
                                        }}
                                        className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm border-b last:border-b-0"
                                      >
                                        <p className="font-medium">{c.name}</p>
                                        <p className="text-xs text-muted-foreground">{c.email}</p>
                                      </button>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        /* Normal customer search */
                        <CustomerSearch
                          selected={selectedCustomer}
                          onSelect={(customer) => {
                            setSelectedCustomer(customer);
                            setAddressOverrides({});
                            setDeliveryType("");
                          }}
                          onClear={() => {
                            setSelectedCustomer(null);
                            setAddressOverrides({});
                            setDeliveryType("");
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
          </CollapsibleCard>
          </div>

        {/* PRODUCTS CARD */}
        <div className={isPaymentOnlyEdit ? "pointer-events-none opacity-60" : ""}>
        <CollapsibleCard
          className="w-full"
          title="Itens & Brindes"
          description="Adicione produtos e brindes ao pedido"
          open={isProductsOpen}
          onOpenChange={setIsProductsOpen}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Coluna esquerda: produtos */}
                  <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Produtos
                    </p>
                    <ProductSearch onAddItem={handleAddItem} />

                    {cartItems.length > 0 && (
                      <div className="space-y-2">
                        <Separator />
                        {cartItems.map((item) => (
                          <div
                            key={item.itemKey}
                            className="rounded-lg border bg-card p-3"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  <p className="text-sm font-medium">
                                    {item.productName}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                                onClick={() => removeItem(item.itemKey)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                              <span className="flex-1 min-w-0">
                                <span className="font-medium">Variante:</span>{" "}
                                {item.variantName}
                              </span>
                              <div className="flex items-center gap-2 shrink-0">
                                {item.originalPrice && (
                                  <span className="line-through text-xs text-muted-foreground/70">
                                    {formatCurrency(item.originalPrice)}
                                  </span>
                                )}
                                <span
                                  className={
                                    item.originalPrice
                                      ? "text-green-600 font-semibold"
                                      : ""
                                  }
                                >
                                  {formatCurrency(item.unitPrice)} / un.
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    updateQty(item.itemKey, item.quantity - 1)
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-7 text-center text-sm tabular-nums font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() =>
                                    updateQty(item.itemKey, item.quantity + 1)
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <span className="text-sm font-semibold tabular-nums">
                                {formatCurrency(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}

                        <div className="rounded-lg bg-muted/50 p-3 text-sm">
                          <div className="flex justify-between font-semibold">
                            <span>Subtotal</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {cartItems.length === 0 && (
                      <div className="text-center py-10 text-muted-foreground text-sm">
                        Nenhum produto adicionado. Busque um produto acima.
                      </div>
                    )}
                  </div>

                  {/* Coluna direita: Brinde & Bonificação */}
                  <div className="space-y-3">
                    {/* Tab selector */}
                    <div className="flex rounded-lg border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setGiftBonusTab("brinde")}
                        className={[
                          "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all",
                          giftBonusTab === "brinde"
                            ? "bg-bee-gold/10 text-bee-gold"
                            : "hover:bg-muted/50 text-muted-foreground",
                        ].join(" ")}
                      >
                        <Gift className="h-4 w-4" />
                        Brinde
                        {Object.keys(selectedGifts).length > 0 && (
                          <span className={[
                            "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[1.25rem]",
                            giftBonusTab === "brinde"
                              ? "bg-bee-gold text-white"
                              : "bg-muted-foreground/20 text-muted-foreground",
                          ].join(" ")}>
                            {Object.keys(selectedGifts).length}
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGiftBonusTab("bonus")}
                        className={[
                          "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all border-l",
                          giftBonusTab === "bonus"
                            ? "bg-bee-gold/10 text-bee-gold"
                            : "hover:bg-muted/50 text-muted-foreground",
                        ].join(" ")}
                      >
                        <Package className="h-4 w-4" />
                        Bonificação
                        {bonusItems.length > 0 && (
                          <span className={[
                            "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold min-w-[1.25rem]",
                            giftBonusTab === "bonus"
                              ? "bg-bee-gold text-white"
                              : "bg-muted-foreground/20 text-muted-foreground",
                          ].join(" ")}>
                            {bonusItems.length}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Aba Brinde */}
                    {giftBonusTab === "brinde" && (
                      <div className="space-y-3">
                        {/* Campo de busca */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Buscar brinde..."
                            value={giftSearch}
                            onChange={(e) => {
                              setGiftSearch(e.target.value);
                              setGiftSearchOpen(true);
                            }}
                            onFocus={() => setGiftSearchOpen(true)}
                            onBlur={() => setTimeout(() => setGiftSearchOpen(false), 150)}
                            className="pl-9"
                          />
                          {giftSearchOpen && giftSearch.length >= 1 && (
                            <div className="absolute z-50 mt-1 w-full rounded-lg border bg-popover shadow-lg">
                              {(() => {
                                const filtered = activeGiftTiers.filter(
                                  (g) =>
                                    !(g.id in selectedGifts) &&
                                    g.name.toLowerCase().includes(giftSearch.toLowerCase()),
                                );
                                if (filtered.length === 0) {
                                  return (
                                    <p className="p-3 text-sm text-muted-foreground">
                                      Nenhum brinde encontrado.
                                    </p>
                                  );
                                }
                                return filtered.map((gift) => (
                                  <button
                                    key={gift.id}
                                    type="button"
                                    className="w-full text-left px-3 py-2.5 hover:bg-muted/50 transition-colors text-sm"
                                    onMouseDown={() => {
                                      toggleGift(gift.id);
                                      setGiftSearch("");
                                      setGiftSearchOpen(false);
                                    }}
                                  >
                                    <p className="font-medium">{gift.name}</p>
                                    {gift.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-1">
                                        {gift.description}
                                      </p>
                                    )}
                                  </button>
                                ));
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Brindes selecionados */}
                        {Object.keys(selectedGifts).length > 0 && (
                          <div className="space-y-2">
                            <Separator />
                            {Object.entries(selectedGifts).map(([id, qty]) => {
                              const gift = activeGiftTiers.find((g) => g.id === id);
                              if (!gift) return null;
                              return (
                                <div key={id} className="rounded-lg border bg-card p-3">
                                  <div className="flex items-start gap-2 mb-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <Gift className="h-3.5 w-3.5 text-bee-gold shrink-0" />
                                        <p className="text-sm font-medium">{gift.name}</p>
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                                      onClick={() => toggleGift(id)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>

                                  {gift.description && (
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                      <span className="flex-1 min-w-0 line-clamp-2">
                                        {gift.description}
                                      </span>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => {
                                          if (qty <= 1) toggleGift(id);
                                          else setGiftQuantity(id, qty - 1);
                                        }}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </Button>
                                      <span className="w-7 text-center text-sm tabular-nums font-medium">
                                        {qty}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => setGiftQuantity(id, qty + 1)}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {Object.keys(selectedGifts).length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            Nenhum brinde selecionado.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Aba Bonificação */}
                    {giftBonusTab === "bonus" && (
                      <div className="space-y-3">
                        <ProductSearch onAddItem={handleAddBonusItem} mode="gift" />
                        {bonusItems.length > 0 && (
                          <div className="space-y-2">
                            <Separator />
                            {bonusItems.map((item) => (
                              <div
                                key={item.itemKey}
                                className="rounded-lg border bg-card p-3"
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <Gift className="h-3.5 w-3.5 text-bee-gold shrink-0" />
                                      <p className="text-sm font-medium">{item.productName}</p>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                                    onClick={() => removeBonusItem(item.itemKey)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>

                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                  <span className="flex-1 min-w-0">
                                    <span className="font-medium">Variante:</span>{" "}
                                    {item.variantName}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => updateBonusQty(item.itemKey, item.quantity - 1)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-7 text-center text-sm tabular-nums font-medium">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => updateBonusQty(item.itemKey, item.quantity + 1)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {bonusItems.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            Nenhuma bonificação adicionada.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
              </div>
          </CollapsibleCard>
        </div>

      {/* PAYMENT & SHIPPING CARD */}
      <CollapsibleCard
        className="w-full"
        title="Pagamento & Entrega"
        description="Finalize as informações do pedido"
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
      >
        <div className="space-y-5">
                  {/* Mobile-only order summary collapsible */}
                  <div className="lg:hidden">
                    <Collapsible defaultOpen={false}>
                      <CollapsibleTrigger className="w-full group">
                        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3 text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-medium">
                              {cartItems.length}{" "}
                              {cartItems.length === 1 ? "item" : "itens"} ·{" "}
                              {formatCurrency(finalTotal)}
                            </span>
                            {(discountAmount > 0 || manualDiscountAmount > 0) && (
                              <span className="text-green-600 text-xs shrink-0">
                                − {formatCurrency(discountAmount + manualDiscountAmount)}
                              </span>
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0 ml-2" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-2 rounded-lg border bg-card p-4 space-y-3">
                          {/* Representative info */}
                          {selectedRepresentative && (
                            <div className="flex items-center gap-2 rounded-lg bg-bee-gold/5 border border-bee-gold/20 px-3 py-2">
                              <Briefcase className="h-3.5 w-3.5 text-bee-gold shrink-0" />
                              <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Representante</p>
                                <p className="text-sm font-medium truncate">{selectedRepresentative.name}</p>
                              </div>
                            </div>
                          )}
                          {/* Items list */}
                          {cartItems.length > 0 && (
                            <div className="space-y-2">
                              {cartItems.map((item) => (
                                <div
                                  key={item.itemKey}
                                  className="flex items-start justify-between text-sm gap-2"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium truncate">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-medium">
                                        Variante:
                                      </span>{" "}
                                      {item.variantName} × {item.quantity}
                                    </p>
                                  </div>
                                  <div className="shrink-0 text-right tabular-nums">
                                    {item.originalPrice && (
                                      <p className="text-xs line-through text-muted-foreground/70">
                                        {formatCurrency(
                                          item.originalPrice * item.quantity,
                                        )}
                                      </p>
                                    )}
                                    <p
                                      className={
                                        item.originalPrice
                                          ? "font-semibold text-green-600"
                                          : "font-medium"
                                      }
                                    >
                                      {formatCurrency(
                                        item.unitPrice * item.quantity,
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Totals */}
                          {cartItems.length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    Subtotal
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(total)}
                                  </span>
                                </div>
                                {discountAmount > 0 && (
                                  <div className="flex justify-between text-sm text-green-600">
                                    <span>Cupom ({couponCode})</span>
                                    <span className="font-medium">
                                      − {formatCurrency(discountAmount)}
                                    </span>
                                  </div>
                                )}
                                {manualDiscountAmount > 0 && (
                                  <div className="flex justify-between text-sm text-green-600">
                                    <span>
                                      Desconto avulso{discount?.type === "PERCENTAGE" ? ` (${discount.value}%)` : ""}
                                    </span>
                                    <span className="font-medium">
                                      − {formatCurrency(manualDiscountAmount)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between font-bold">
                                  <span>Total</span>
                                  <span className="text-bee-gold">
                                    {formatCurrency(finalTotal)}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                          {/* Payments */}
                          {payments.some((p) => p.method) && (
                            <>
                              <Separator />
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">
                                  Pagamento
                                </span>
                                {payments
                                  .filter((p) => p.method)
                                  .map((p) => {
                                    const m = PAYMENT_METHODS.find(
                                      (x) => x.value === p.method,
                                    );
                                    const Icon = m?.icon;
                                    return (
                                      <div
                                        key={p.id}
                                        className="flex items-center justify-between text-sm"
                                      >
                                        <span className="flex items-center gap-1.5 font-medium">
                                          {Icon && <Icon className="h-3.5 w-3.5" />}
                                          {m?.label}
                                        </span>
                                        {p.amount > 0 && (
                                          <span className="tabular-nums">
                                            {formatCurrency(p.amount)}
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </>
                          )}
                          {/* Delivery type */}
                          {effectiveDeliveryType && (
                            <>
                              <Separator />
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  Entrega
                                </span>
                                <span className="font-medium">
                                  {
                                    DELIVERY_TYPES.find(
                                      (t) => t.value === effectiveDeliveryType,
                                    )?.label
                                  }
                                </span>
                              </div>
                            </>
                          )}
                          {/* Brindes & Bonificações */}
                          {(Object.keys(selectedGifts).length > 0 || bonusItems.length > 0) && (
                            <>
                              <Separator />
                              <div className="space-y-1.5">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Brindes & Bonificações
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(selectedGifts)
                                    .map(([id, qty]) => {
                                      const gift = activeGiftTiers.find((g) => g.id === id);
                                      return gift ? { ...gift, qty } : null;
                                    })
                                    .filter(Boolean)
                                    .map((gift) => (
                                      <div
                                        key={gift!.id}
                                        className="flex items-center gap-1 px-2 py-1 rounded-full bg-bee-gold/10 text-xs"
                                      >
                                        <Gift className="h-3 w-3 text-bee-gold" />
                                        <span className="truncate max-w-25">
                                          {gift!.name}{gift!.qty > 1 ? ` x${gift!.qty}` : ''}
                                        </span>
                                      </div>
                                    ))}
                                  {bonusItems.map((item) => (
                                    <div
                                      key={item.itemKey}
                                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-xs"
                                    >
                                      <Package className="h-3 w-3 text-amber-600" />
                                      <span className="truncate max-w-25">
                                        {item.productName}{item.quantity > 1 ? ` x${item.quantity}` : ''}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    <Separator className="mt-4" />
                  </div>

                  {/* Payments */}
                  <div className="space-y-4">
                    <Label>Formas de Pagamento *</Label>
                    
                    {payments.length === 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {PAYMENT_METHODS_FOR_PAYMENTS.map((m) => {
                          const Icon = m.icon;
                          return (
                            <button
                              key={m.value}
                              type="button"
                              onClick={() => addPayment(m.value)}
                              className="flex flex-col items-center justify-center gap-2 group rounded-xl border border-border p-4 text-sm font-medium transition-all hover:border-bee-gold hover:bg-bee-gold/5"
                            >
                              <div className="p-2 rounded-full bg-muted group-hover:bg-bee-gold/10 transition-colors">
                                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-bee-gold" />
                              </div>
                              <span className="text-center">{m.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Lista de Pagamentos Ativos (Estilo Tabela/ListGroup) */}
                        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                          {payments.map((entry) => {
                            const methodDef = PAYMENT_METHODS_FOR_PAYMENTS.find(
                              (m) => m.value === entry.method
                            );
                            const Icon = methodDef?.icon || CreditCard;

                            return (
                              <div
                                key={entry.id}
                                className="group flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:px-4 sm:py-3 border-b border-border/50 last:border-0 transition-colors hover:bg-muted/30"
                              >
                                {/* Left Side: Icon + Method Select */}
                                <div className="flex flex-1 items-center gap-3">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border/50 bg-muted/40 text-muted-foreground group-hover:text-foreground group-hover:bg-background transition-colors">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{methodDef?.label || "Selecione..."}</span>
                                    {entry.method === "BOLETO" && (
                                      <div className="mt-0.5 flex items-center gap-1.5">
                                        <span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Vencimento:</span>
                                        <Select
                                          value={String(entry.boletoDueDays)}
                                          onValueChange={(val) =>
                                            updatePayment(entry.id, {
                                              boletoDueDays: Number(val) as 30 | 60,
                                            })
                                          }
                                        >
                                          <SelectTrigger className="h-5 w-[70px] rounded border-0 bg-transparent p-0 text-[11px] text-muted-foreground shadow-none hover:text-foreground transition-colors focus:ring-0 [&>svg]:ml-0.5">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="30">30 dias</SelectItem>
                                            <SelectItem value="60">60 dias</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Right Side: Amount + Actions */}
                                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0 justify-between sm:justify-end">
                                  <div className="relative w-[140px]">
                                    <CurrencyInput
                                      value={entry.amount}
                                      onChange={(val) =>
                                        updatePayment(entry.id, { amount: val })
                                      }
                                      className="h-9 w-full sm:w-[140px] text-right"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:text-muted-foreground"
                                    onClick={() => removePayment(entry.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Visual Feedback and Add Next Payment */}
                        {(cartItems.length > 0 || orderTotal > 0) && (
                          <div className="space-y-3 mt-4 p-4 rounded-lg bg-muted/30 border border-muted">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              {orderTotal > paymentsSum ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="gap-1.5 self-start bg-background"
                                    >
                                      <Plus className="h-4 w-4" />
                                      Adicionar pagamento ({formatCurrency(orderTotal - paymentsSum)})
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start" className="w-[200px]">
                                    {PAYMENT_METHODS_FOR_PAYMENTS.map((m) => {
                                      const MIcon = m.icon;
                                      return (
                                        <DropdownMenuItem 
                                          key={m.value} 
                                          onSelect={() => addPayment(m.value)}
                                          className="cursor-pointer"
                                        >
                                          <MIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                          {m.label}
                                        </DropdownMenuItem>
                                      );
                                    })}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <div className="text-sm font-medium text-green-600 flex items-center gap-1.5">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Total do pedido atingido
                                </div>
                              )}
                              
                              <div className="text-sm tabular-nums font-medium text-right flex flex-col items-end">
                                <span>
                                  {formatCurrency(paymentsSum)} / {formatCurrency(orderTotal)}
                                </span>
                                {paymentsSum > orderTotal && (
                                  <span className="text-xs text-destructive">
                                    Excede o total em {formatCurrency(paymentsSum - orderTotal)}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Visual Progress Bar */}
                            <div className="w-full h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full transition-all duration-300",
                                  paymentsMatch ? "bg-green-500" : paymentsSum > orderTotal ? "bg-destructive" : "bg-bee-gold"
                                )}
                                style={{ width: `${Math.min(100, (paymentsSum / (orderTotal || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Coupon */}
                  <div className="space-y-2">
                    <Label htmlFor="couponCode">
                      Cupom{" "}
                      <span className="text-muted-foreground text-xs">
                        (opcional)
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="couponCode"
                        placeholder="Ex: DESCONTO10"
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        className={[
                          "pr-9",
                          couponIsValid
                            ? "border-green-500 focus-visible:ring-green-500/30"
                            : "",
                          couponIsInvalid
                            ? "border-destructive focus-visible:ring-destructive/30"
                            : "",
                        ].join(" ")}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {couponFetching && debouncedCouponCode.length >= 2 && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                        {couponIsValid && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        {couponIsInvalid && (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                    </div>

                    {couponIsValid && (
                      <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 dark:border-green-900 dark:bg-green-950/40">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                        <div>
                          <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                            Cupom válido — {couponLookup!.discountPercentage}%
                            de desconto
                          </p>
                          {couponLookup!.minCartValue ? (
                            <p className="text-xs text-green-600 dark:text-green-500">
                              Pedido mínimo:{" "}
                              {formatCurrency(couponLookup!.minCartValue)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    )}

                    {couponIsInvalid && (
                      <div className="flex items-center gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5">
                        <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <div>
                          <p className="text-sm font-semibold text-destructive">
                            {couponError || !couponLookup?.found
                              ? "Cupom não encontrado"
                              : "Cupom inativo"}
                          </p>
                          <p className="text-xs text-destructive/80">
                            {couponError || !couponLookup?.found
                              ? "Verifique o código e tente novamente"
                              : "Este cupom está desativado"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual discount */}
                  <div className="space-y-2">
                    <Label>
                      Desconto Avulso{" "}
                      <span className="text-muted-foreground text-xs">(opcional)</span>
                    </Label>
                    {!discount ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setDiscount({ type: "ABSOLUTE", value: 0 })}
                          className="flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
                        >
                          R$ Valor fixo
                        </button>
                        <button
                          type="button"
                          onClick={() => setDiscount({ type: "PERCENTAGE", value: 0 })}
                          className="flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground hover:border-foreground/40 hover:text-foreground transition-colors"
                        >
                          <Percent className="h-3.5 w-3.5" />
                          Percentual
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDiscount((d) =>
                              d ? { ...d, type: d.type === "ABSOLUTE" ? "PERCENTAGE" : "ABSOLUTE", value: 0 } : null
                            )
                          }
                          className="shrink-0 rounded-lg border px-3 py-2 text-sm font-medium min-w-[4rem] text-center hover:bg-muted transition-colors"
                        >
                          {discount.type === "ABSOLUTE" ? "R$" : "%"}
                        </button>
                        {discount.type === "ABSOLUTE" ? (
                          <CurrencyInput
                            value={discount.value}
                            onChange={(val) => setDiscount((d) => d ? { ...d, value: val } : null)}
                          />
                        ) : (
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={discount.value || ""}
                            onChange={(e) => {
                              const v = Math.min(100, Math.max(0, parseFloat(e.target.value) || 0));
                              setDiscount((d) => d ? { ...d, value: v } : null);
                            }}
                            placeholder="0 – 100"
                          />
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-9 w-9 text-muted-foreground hover:text-destructive"
                          onClick={() => setDiscount(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {discountExceedsTotal && (
                      <p className="text-xs text-destructive font-medium">
                        O desconto não pode ser maior que o valor da venda ({formatCurrency(discountedTotal)}).
                      </p>
                    )}
                    {discount && !discountExceedsTotal && manualDiscountAmount > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        − {formatCurrency(manualDiscountAmount)} aplicados sobre o subtotal
                      </p>
                    )}
                  </div>

                  {/* Delivery type */}
                  <div className="space-y-1.5">
                    <Label>Tipo de Entrega *</Label>
                    <div className="flex flex-wrap gap-2">
                      {DELIVERY_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = effectiveDeliveryType === type.value;
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setDeliveryType(type.value)}
                            className={[
                              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                              isSelected
                                ? "border-bee-gold bg-bee-gold/10 ring-1 ring-bee-gold text-bee-gold"
                                : "border-border hover:border-muted-foreground/50 hover:bg-muted/40",
                            ].join(" ")}
                          >
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping form — only when delivery type is "DELIVERY" */}
                  {effectiveDeliveryType === "DELIVERY" && (
                    <Collapsible
                      open={shippingFormOpen}
                      onOpenChange={setShippingFormOpen}
                    >
                      <CollapsibleTrigger className="w-full group">
                        <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors">
                          <span>Dados de entrega</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="rounded-b-lg border border-t-0 p-4 space-y-4">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Endereço
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* CEP - Primeiro campo */}
                            <div className="space-y-1.5 sm:col-span-2">
                              <Label htmlFor="zipCode" className="text-sm">
                                CEP <span className="text-destructive">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="zipCode"
                                  placeholder="00000-000"
                                  value={effectiveAddress.zipCode}
                                  onChange={(e) =>
                                    handleZipCodeChange(e.target.value)
                                  }
                                  maxLength={9}
                                  className={
                                    addressLookup.isPending || addressAutoFilled
                                      ? "pr-10"
                                      : ""
                                  }
                                />
                                {addressLookup.isPending && (
                                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                )}
                                {addressAutoFilled &&
                                  !addressLookup.isPending && (
                                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                  )}
                              </div>
                              {addressLookup.error && (
                                <p className="text-xs text-destructive">
                                  CEP não encontrado. Preencha o endereço
                                  manualmente.
                                </p>
                              )}
                              {addressAutoFilled &&
                                !addressLookup.isPending &&
                                !addressLookup.error && (
                                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Endereço preenchido automaticamente
                                  </p>
                                )}
                            </div>

                            {/* Rua */}
                            <div className="space-y-1.5 sm:col-span-2">
                              <Label htmlFor="street" className="text-sm">
                                Rua <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="street"
                                value={effectiveAddress.street}
                                onChange={(e) =>
                                  setAddressOverrides((s) => ({
                                    ...s,
                                    street: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            {/* Número */}
                            <div className="space-y-1.5">
                              <Label htmlFor="number" className="text-sm">
                                Número{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="number"
                                value={effectiveAddress.number}
                                onChange={(e) =>
                                  setAddressOverrides((s) => ({
                                    ...s,
                                    number: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            {/* Complemento */}
                            <div className="space-y-1.5">
                              <Label htmlFor="complement" className="text-sm">
                                Complemento
                              </Label>
                              <Input
                                id="complement"
                                value={effectiveAddress.complement}
                                onChange={(e) =>
                                  setAddressOverrides((s) => ({
                                    ...s,
                                    complement: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            {/* Bairro */}
                            <div className="space-y-1.5">
                              <Label htmlFor="neighborhood" className="text-sm">
                                Bairro{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="neighborhood"
                                value={effectiveAddress.neighborhood}
                                onChange={(e) =>
                                  setAddressOverrides((s) => ({
                                    ...s,
                                    neighborhood: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            {/* Cidade */}
                            <div className="space-y-1.5">
                              <Label htmlFor="city" className="text-sm">
                                Cidade{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="city"
                                value={effectiveAddress.city}
                                onChange={(e) =>
                                  setAddressOverrides((s) => ({
                                    ...s,
                                    city: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            {/* Estado */}
                            <div className="space-y-1.5">
                              <Label htmlFor="state" className="text-sm">
                                Estado{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="state"
                                placeholder="Ex: SP"
                                maxLength={2}
                                value={effectiveAddress.state}
                                onChange={(e) =>
                                  setAddressOverrides((s) => ({
                                    ...s,
                                    state: e.target.value.toUpperCase(),
                                  }))
                                }
                              />
                            </div>
                          </div>

                          <Separator />

                          {/* Shipping Options Selector */}
                          {!useManualShipping ? (
                            <ShippingOptionsSelector
                              cartItems={cartItems.map((item) => ({
                                productId: item.productId,
                                variantId: item.variantId,
                                quantity: item.quantity,
                              }))}
                              zipCode={effectiveAddress.zipCode}
                              isAddressLookupPending={addressLookup.isPending}
                              selectedOption={selectedShippingOption}
                              onSelectOption={handleSelectShippingOption}
                              onManualFallback={handleManualShippingFallback}
                            />
                          ) : (
                            <>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Transportadora (preenchimento manual)
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                  <Label htmlFor="carrier" className="text-sm">
                                    Transportadora{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="carrier"
                                    placeholder="Ex: Correios"
                                    value={shippingInfo.carrier}
                                    onChange={(e) =>
                                      setShippingInfo((s) => ({
                                        ...s,
                                        carrier: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label htmlFor="service" className="text-sm">
                                    Serviço{" "}
                                    <span className="text-destructive">*</span>
                                  </Label>
                                  <Input
                                    id="service"
                                    placeholder="Ex: PAC"
                                    value={shippingInfo.service}
                                    onChange={(e) =>
                                      setShippingInfo((s) => ({
                                        ...s,
                                        service: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label
                                    htmlFor="shippingPrice"
                                    className="text-sm"
                                  >
                                    Valor do Frete (R$)
                                  </Label>
                                  <Input
                                    id="shippingPrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={shippingInfo.price}
                                    onChange={(e) =>
                                      setShippingInfo((s) => ({
                                        ...s,
                                        price: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <Label
                                    htmlFor="deliveryTime"
                                    className="text-sm"
                                  >
                                    Prazo (dias)
                                  </Label>
                                  <Input
                                    id="deliveryTime"
                                    type="number"
                                    min="0"
                                    value={shippingInfo.deliveryTime}
                                    onChange={(e) =>
                                      setShippingInfo((s) => ({
                                        ...s,
                                        deliveryTime: e.target.value,
                                      }))
                                    }
                                  />
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setUseManualShipping(false)}
                              >
                                Voltar para cálculo de frete
                              </Button>
                            </>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">
                      Observações{" "}
                      <span className="text-muted-foreground text-xs">
                        (opcional)
                      </span>
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Observações sobre o pedido..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
          </CollapsibleCard>

        {/* Mobile Navigation */}
          <div className="flex gap-3 lg:hidden">
            <Button
              variant="outline"
              className="flex-1 hover:bg-muted hover:text-foreground hover:border-muted-foreground/20"
              onClick={() => router.back()}
              disabled={createOrderMutation.isPending || updateOrderMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 shadow-md"
              disabled={isReadOnly || (!canProceed() && !isPaymentOnlyEdit) || createOrderMutation.isPending || updateOrderMutation.isPending}
              onClick={handleSubmit}
            >
              {(createOrderMutation.isPending || updateOrderMutation.isPending)
                ? (mode === 'edit' ? "Salvando..." : "Criando...")
                : (mode === 'edit' ? "Salvar Alterações" : "Criar Pedido")}
            </Button>
          </div>
        </div>

        {/* ========== RIGHT COLUMN (1/3) - Sidebar with Order Summary ========== */}
        <div className="hidden lg:block lg:col-span-1 space-y-4">
          {/* Order Summary Card - Sticky on desktop */}
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              {selectedCustomer ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Cliente
                  </p>
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {selectedCustomer.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {selectedCustomer.email}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setAddressOverrides({});
                        setDeliveryType("");
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <User className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    Nenhum cliente selecionado
                  </p>
                </div>
              )}

              {/* Representative Info */}
              {selectedRepresentative && (
                <div className="flex items-center gap-2 rounded-lg bg-bee-gold/5 border border-bee-gold/20 px-3 py-2">
                  <Briefcase className="h-4 w-4 text-bee-gold shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Representante</p>
                    <p className="text-sm font-medium truncate">{selectedRepresentative.name}</p>
                  </div>
                </div>
              )}

              {selectedCustomer && <Separator />}

              {/* Items Summary */}
              {cartItems.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Itens ({cartItems.length})
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.itemKey}
                        className="flex items-start justify-between text-sm gap-2"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {item.productName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium">Variante:</span>{" "}
                            {item.variantName} × {item.quantity}
                          </p>
                        </div>
                        <div className="shrink-0 text-right tabular-nums">
                          {item.originalPrice && (
                            <p className="text-xs line-through text-muted-foreground/70">
                              {formatCurrency(
                                item.originalPrice * item.quantity,
                              )}
                            </p>
                          )}
                          <p
                            className={
                              item.originalPrice
                                ? "text-sm font-semibold text-green-600"
                                : "text-sm font-medium"
                            }
                          >
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Package className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    Nenhum item adicionado
                  </p>
                </div>
              )}

              {cartItems.length > 0 && <Separator />}

              {/* Totals */}
              {cartItems.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(total)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Cupom ({couponCode})</span>
                      <span className="font-medium">
                        − {formatCurrency(discountAmount)}
                      </span>
                    </div>
                  )}
                  {manualDiscountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>
                        Desconto avulso{discount?.type === "PERCENTAGE" ? ` (${discount.value}%)` : ""}
                      </span>
                      <span className="font-medium">
                        − {formatCurrency(manualDiscountAmount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-bee-gold">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>
              )}

              {/* Payments */}
              {payments.some((p) => p.method) && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Pagamento
                    </span>
                    {payments
                      .filter((p) => p.method)
                      .map((p) => {
                        const m = PAYMENT_METHODS.find(
                          (x) => x.value === p.method,
                        );
                        const Icon = m?.icon;
                        return (
                          <div
                            key={p.id}
                            className="flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5 text-sm font-medium">
                              {Icon && <Icon className="h-4 w-4" />}
                              {m?.label}
                            </span>
                            {p.amount > 0 && (
                              <span className="text-sm tabular-nums">
                                {formatCurrency(p.amount)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </>
              )}

              {/* Delivery Type */}
              {effectiveDeliveryType && (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Entrega
                    </span>
                    <span className="text-sm font-medium">
                      {
                        DELIVERY_TYPES.find(
                          (t) => t.value === effectiveDeliveryType,
                        )?.label
                      }
                    </span>
                  </div>
                </>
              )}

              {/* Brindes & Bonificações */}
              {(Object.keys(selectedGifts).length > 0 || bonusItems.length > 0) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Brindes & Bonificações
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(selectedGifts)
                        .map(([id, qty]) => {
                          const gift = activeGiftTiers.find((g) => g.id === id);
                          return gift ? { ...gift, qty } : null;
                        })
                        .filter(Boolean)
                        .map((gift) => (
                          <div
                            key={gift!.id}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-bee-gold/10 text-xs"
                          >
                            <Gift className="h-3 w-3 text-bee-gold" />
                            <span className="truncate max-w-25">
                              {gift!.name}{gift!.qty > 1 ? ` x${gift!.qty}` : ''}
                            </span>
                          </div>
                        ))}
                      {bonusItems.map((item) => (
                        <div
                          key={item.itemKey}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-xs"
                        >
                          <Package className="h-3 w-3 text-amber-600" />
                          <span className="truncate max-w-25">
                            {item.productName}{item.quantity > 1 ? ` x${item.quantity}` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Desktop Navigation Buttons */}
              <div className="hidden lg:block pt-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 hover:bg-muted hover:text-foreground hover:border-muted-foreground/20"
                    onClick={() => router.back()}
                    disabled={createOrderMutation.isPending || updateOrderMutation.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 shadow-md"
                    disabled={isReadOnly || (!canProceed() && !isPaymentOnlyEdit) || createOrderMutation.isPending || updateOrderMutation.isPending}
                    onClick={handleSubmit}
                  >
                    {(createOrderMutation.isPending || updateOrderMutation.isPending)
                      ? (mode === 'edit' ? "Salvando..." : "Criando...")
                      : (mode === 'edit' ? "Salvar Alterações" : "Criar Pedido")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default OrderFormPage;
