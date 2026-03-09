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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useCreateOrder } from "@/contexts/orders/presentation/hooks/use-create-order";
import { ShippingOptionsSelector } from "@/shared/presentation/components/shipping-options-selector";
import type { ShippingOption } from "@/shared/infrastructure/api/shipping/types";
import { useAddressLookup } from "@/shared/presentation/hooks/use-address-lookup";
import { CurrencyInput } from "@/shared/presentation/components/currency-input";
import { useRepresentatives } from "@/contexts/representatives/presentation/hooks/use-representatives";
import { useRepresentativeCustomers } from "@/contexts/representatives/presentation/hooks/use-representative-customers";

interface GiftTier {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  minOrderValue: number;
  isActive: boolean;
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
}

interface ProductResult {
  id: string;
  name: string;
  variants: ProductVariant[];
}

interface CartItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  unitPrice: number;
  originalPrice?: number;
  quantity: number;
  priceType?: "COMMON" | "RETAILER" | "DISTRIBUTOR";
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

const STEPS = [
  { id: 1, label: "Identificação", icon: User },
  { id: 2, label: "Itens & Brindes", icon: Package },
  { id: 3, label: "Pagamento", icon: CreditCard },
];

const STEP_META = [
  { title: "Identificação", description: "Selecione a origem e o cliente para o pedido" },
  {
    title: "Itens & Brindes",
    description: "Adicione produtos e brindes ao pedido",
  },
  {
    title: "Pagamento & Entrega",
    description: "Finalize as informações do pedido",
  },
];

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start w-full">
      {STEPS.map((step, idx) => {
        const isCompleted = current > step.id;
        const isActive = current === step.id;
        const Icon = step.icon;
        return (
          <Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={[
                  "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                  isCompleted
                    ? "bg-bee-gold border-bee-gold text-black"
                    : isActive
                      ? "border-bee-gold text-bee-gold bg-bee-gold/10"
                      : "border-muted text-muted-foreground",
                ].join(" ")}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={[
                  "text-[10px] sm:text-xs font-medium",
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={[
                  "flex-1 h-0.5 mt-4.5 mx-1.5 transition-all duration-300",
                  current > step.id ? "bg-bee-gold" : "bg-muted",
                ].join(" ")}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
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

function ProductSearch({ onAddItem }: { onAddItem: (item: CartItem) => void }) {
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
    if (selectedPriceType === "retailer") {
      unitPrice = selectedVariant.retailerPrice!;
    } else if (selectedPriceType === "distributor") {
      unitPrice = selectedVariant.distributorPrice!;
    } else {
      unitPrice = selectedVariant.offerPrice ?? selectedVariant.price;
      originalPrice = selectedVariant.offerPrice ? selectedVariant.price : undefined;
    }

    const priceType =
      selectedPriceType === "retailer" ? "RETAILER" as const :
      selectedPriceType === "distributor" ? "DISTRIBUTOR" as const :
      "COMMON" as const;

    onAddItem({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      unitPrice,
      originalPrice,
      quantity: qty,
      priceType,
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
                  <div className="text-right shrink-0">
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
                    {v.unitsPerVariant && v.unitsPerVariant > 1 && (
                      <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                        {v.unitsPerVariant} unidades
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedVariant?.isRetailerVariant && (
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

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResult | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [payments, setPayments] = useState<PaymentEntry[]>([
    { id: crypto.randomUUID(), method: "", amount: 0, boletoDueDays: 30 },
  ]);
  const [orderSource, setOrderSource] = useState<
    "WHATSAPP" | "IN_STORE" | "INSTAGRAM" | "REPRESENTATIVE" | ""
  >("");
  const [selectedRepresentative, setSelectedRepresentative] = useState<{ id: string; name: string } | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState<{ type: "ABSOLUTE" | "PERCENTAGE"; value: number } | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedGifts, setSelectedGifts] = useState<Record<string, number>>({});
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("");
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
  >({});
  const [shippingInfo, setShippingInfo] = useState({
    carrier: "",
    service: "",
    serviceCode: undefined as number | undefined,
    price: "0",
    deliveryTime: "0",
  });
  const [selectedShippingOption, setSelectedShippingOption] =
    useState<ShippingOption | null>(null);
  const [useManualShipping, setUseManualShipping] = useState(false);
  const [addressAutoFilled, setAddressAutoFilled] = useState(false);

  const createOrderMutation = useCreateOrder();
  const addressLookup = useAddressLookup();

  const isRepresentativeSource = orderSource === "REPRESENTATIVE";
  const [repSearch, setRepSearch] = useState("");
  const debouncedRepSearch = useDebounce(repSearch, 300);
  const [repCustomerSearch, setRepCustomerSearch] = useState("");
  const { data: representatives, isLoading: representativesLoading } = useRepresentatives(
    isRepresentativeSource && debouncedRepSearch.length >= 2 ? debouncedRepSearch : undefined,
  );
  const { data: representativeCustomers, isLoading: repCustomersLoading } = useRepresentativeCustomers(
    isRepresentativeSource ? selectedRepresentative?.id ?? null : null,
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
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  function removeItem(variantId: string) {
    setCartItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }

  function updateQty(variantId: string, qty: number) {
    if (qty < 1) return;
    setCartItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId ? { ...i, quantity: qty } : i,
      ),
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

  function addPayment() {
    setPayments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), method: "", amount: 0, boletoDueDays: 30 },
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
    switch (step) {
      case 1: {
        if (!orderSource || !selectedCustomer) return false;
        if (isRepresentativeSource && !selectedRepresentative) return false;
        return true;
      }
      case 2:
        return cartItems.length > 0;
      case 3: {
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
      default:
        return false;
    }
  }

  function handleNext() {
    if (step < STEPS.length) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
    else router.back();
  }

  function handleSubmit() {
    if (!selectedCustomer || !orderSource) return;
    createOrderMutation.mutate(
      {
        customerId: selectedCustomer.id,
        items: cartItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.unitPrice,
          originalPrice: i.originalPrice,
          priceType: i.priceType,
        })),
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
      },
      { onSuccess: () => router.push("/dashboard/orders") },
    );
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
              Novo Pedido
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Crie um pedido manual para vendas externas
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <StepIndicator current={step} />
          </div>

          <Card>
            <CardHeader className="pb-3 border-b">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Etapa {step} de {STEPS.length}
              </p>
              <CardTitle className="text-lg mt-0.5">
                {STEP_META[step - 1].title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {STEP_META[step - 1].description}
              </p>
            </CardHeader>

            <CardContent>
              {step === 1 && (
                <div className="space-y-5">
                  {/* Order source selection */}
                  <div className="space-y-1.5">
                    <Label>Origem do Pedido *</Label>
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
              )}

              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Coluna esquerda: busca + carrinho */}
                  <div className="space-y-4">
                  <ProductSearch onAddItem={handleAddItem} />

                  {cartItems.length > 0 && (
                    <div className="space-y-2">
                      <Separator />
                      {cartItems.map((item) => (
                        <div
                          key={item.variantId}
                          className="rounded-lg border bg-card p-3"
                        >
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                {item.productName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                              onClick={() => removeItem(item.variantId)}
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
                                  updateQty(item.variantId, item.quantity - 1)
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
                                  updateQty(item.variantId, item.quantity + 1)
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
                      Nenhum item adicionado. Busque um produto acima.
                    </div>
                  )}
                  </div>

                  {/* Coluna direita: brindes */}
                  {activeGiftTiers.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Brindes{" "}
                        <span className="font-normal normal-case">
                          (opcional)
                        </span>
                      </p>
                      <div className="space-y-2">
                        {activeGiftTiers.map((gift) => {
                          const isSelected = gift.id in selectedGifts;
                          return (
                            <div
                              key={gift.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleGift(gift.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  toggleGift(gift.id);
                                }
                              }}
                              className={[
                                "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer",
                                isSelected
                                  ? "border-bee-gold bg-bee-gold/10 ring-1 ring-bee-gold"
                                  : "border-border hover:border-muted-foreground/50 hover:bg-muted/40",
                              ].join(" ")}
                            >
                              <GiftImageWithDialog
                                src={gift.imageUrl}
                                alt={gift.name}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold leading-tight">
                                  {gift.name}
                                </p>
                                {gift.description && (
                                  <p className="text-[10px] text-muted-foreground leading-tight line-clamp-2">
                                    {gift.description}
                                  </p>
                                )}
                              </div>
                              {isSelected && (
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    className="h-6 w-6 rounded border flex items-center justify-center text-xs hover:bg-muted"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const qty = selectedGifts[gift.id];
                                      if (qty <= 1) {
                                        toggleGift(gift.id);
                                      } else {
                                        setGiftQuantity(gift.id, qty - 1);
                                      }
                                    }}
                                  >
                                    {selectedGifts[gift.id] <= 1 ? <X className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                  </button>
                                  <span className="text-xs font-semibold w-5 text-center tabular-nums">
                                    {selectedGifts[gift.id]}
                                  </span>
                                  <button
                                    type="button"
                                    className="h-6 w-6 rounded border flex items-center justify-center text-xs hover:bg-muted"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGiftQuantity(gift.id, selectedGifts[gift.id] + 1);
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Mobile Step 3: Payment & Shipping ── */}
              {step === 3 && (
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
                                  key={item.variantId}
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
                          {/* Gifts */}
                          {Object.keys(selectedGifts).length > 0 && (
                            <>
                              <Separator />
                              <div className="space-y-1.5">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                  Brindes ({Object.keys(selectedGifts).length})
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
                  <div className="space-y-3">
                    <Label>Formas de Pagamento *</Label>
                    <div className="space-y-2">
                      {payments.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex flex-row gap-2 rounded-xl border p-3"
                        >
                          {/* Method select */}
                          <Select
                            value={entry.method}
                            onValueChange={(val) =>
                              updatePayment(entry.id, { method: val })
                            }
                          >
                            <SelectTrigger className="w-36 shrink-0">
                              <SelectValue placeholder="Método" />
                            </SelectTrigger>
                            <SelectContent>
                              {PAYMENT_METHODS_FOR_PAYMENTS.map((m) => {
                                const Icon = m.icon;
                                return (
                                  <SelectItem key={m.value} value={m.value}>
                                    <span className="flex items-center gap-2">
                                      <Icon className="h-4 w-4" />
                                      {m.label}
                                    </span>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>

                          {/* Amount input */}
                          <div className="flex-1">
                            <CurrencyInput
                              value={entry.amount}
                              onChange={(val) =>
                                updatePayment(entry.id, { amount: val })
                              }
                            />
                          </div>

                          {/* Boleto due days */}
                          {entry.method === "BOLETO" && (
                            <Select
                              value={String(entry.boletoDueDays)}
                              onValueChange={(val) =>
                                updatePayment(entry.id, {
                                  boletoDueDays: Number(val) as 30 | 60,
                                })
                              }
                            >
                              <SelectTrigger className="sm:w-32 shrink-0">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30">30 dias</SelectItem>
                                <SelectItem value="60">60 dias</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          {/* Remove button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 h-9 w-9 text-muted-foreground hover:text-destructive"
                            disabled={payments.length === 1}
                            onClick={() => removePayment(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Add payment + sum feedback */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1.5 self-start"
                        onClick={addPayment}
                      >
                        <Plus className="h-4 w-4" />
                        Adicionar forma de pagamento
                      </Button>
                      {cartItems.length > 0 && (
                        <div
                          className={[
                            "ml-auto text-sm tabular-nums font-medium",
                            paymentsMatch ? "text-green-600" : "text-destructive",
                          ].join(" ")}
                        >
                          {formatCurrency(paymentsSum)}
                          {" / "}
                          {formatCurrency(orderTotal)}
                          {!paymentsMatch && (
                            <span className="text-xs ml-1">
                              (diferença:{" "}
                              {formatCurrency(
                                Math.abs(paymentsSum - orderTotal),
                              )}
                              )
                            </span>
                          )}
                        </div>
                      )}
                    </div>
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
              )}
            </CardContent>
          </Card>

          {/* Mobile Navigation */}
          <div className="flex gap-3 lg:hidden">
            <Button
              variant="outline"
              className="flex-1 hover:bg-muted hover:text-foreground hover:border-muted-foreground/20"
              onClick={handleBack}
              disabled={createOrderMutation.isPending}
            >
              {step > 1 ? "Voltar" : "Cancelar"}
            </Button>
            <Button
              className="flex-1 shadow-md"
              disabled={!canProceed() || createOrderMutation.isPending}
              onClick={handleNext}
            >
              {createOrderMutation.isPending
                ? "Criando..."
                : step === STEPS.length
                  ? "Criar Pedido"
                  : "Próximo"}
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
                        key={item.variantId}
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

              {/* Selected Gifts */}
              {Object.keys(selectedGifts).length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Brindes ({Object.keys(selectedGifts).length})
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
                    onClick={handleBack}
                    disabled={createOrderMutation.isPending}
                  >
                    {step > 1 ? "Voltar" : "Cancelar"}
                  </Button>
                  <Button
                    className="flex-1 shadow-md"
                    disabled={!canProceed() || createOrderMutation.isPending}
                    onClick={handleNext}
                  >
                    {createOrderMutation.isPending
                      ? "Criando..."
                      : step === STEPS.length
                        ? "Criar Pedido"
                        : "Próximo"}
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
