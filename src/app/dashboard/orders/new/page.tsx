"use client";

import { useState, useCallback, Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Gift,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
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

/* ─── Types ─── */
interface GiftTier {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  minOrderValue: number;
  isActive: boolean;
}

/* ─── Gift Image Dialog ─── */
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

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
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
}

type DeliveryType = "PICKUP" | "DELIVERY" | "NONE" | "";

const DELIVERY_TYPES = [
  { value: "PICKUP" as const, label: "Retirada", icon: MapPin },
  { value: "DELIVERY" as const, label: "Entrega", icon: Truck },
  { value: "NONE" as const, label: "Sem frete", icon: Ban },
];

const PAYMENT_METHODS = [
  { value: "PIX", label: "Pix" },
  { value: "CASH", label: "Dinheiro" },
  { value: "CARD", label: "Cartão" },
  { value: "BOLETO", label: "Boleto" },
];

const STEPS = [
  { id: 1, label: "Cliente", icon: User },
  { id: 2, label: "Itens & Brindes", icon: Package },
  { id: 3, label: "Pagamento", icon: CreditCard },
];

const STEP_META = [
  { title: "Cliente", description: "Selecione o cliente para o pedido" },
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

/* ─── Step Indicator ─── */
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start w-full">
      {STEPS.map((step, idx) => {
        const isCompleted = current > step.id;
        const isActive = current === step.id;
        return (
          <Fragment key={step.id}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className={[
                  "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-200",
                  isCompleted
                    ? "bg-bee-gold border-bee-gold text-black"
                    : isActive
                      ? "border-bee-gold text-bee-gold bg-bee-gold/10"
                      : "border-muted text-muted-foreground",
                ].join(" ")}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
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

/* ─── Customer Search ─── */
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

/* ─── Product Search ─── */
function ProductSearch({ onAddItem }: { onAddItem: (item: CartItem) => void }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResult | null>(
    null,
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [qty, setQty] = useState(1);
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
    onAddItem({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      unitPrice: selectedVariant.offerPrice ?? selectedVariant.price,
      originalPrice: selectedVariant.offerPrice
        ? selectedVariant.price
        : undefined,
      quantity: qty,
    });
    setSelectedProduct(null);
    setSelectedVariant(null);
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
          <Label className="text-xs">Variante</Label>
          <div className="flex flex-wrap gap-2">
            {selectedProduct.variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const effectivePrice = v.offerPrice ?? v.price;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={[
                    "flex flex-col items-start rounded-lg border px-3 py-2 text-left transition-all",
                    isSelected
                      ? "border-bee-gold bg-bee-gold/10 ring-1 ring-bee-gold"
                      : "border-border hover:border-muted-foreground/50 hover:bg-muted/40",
                  ].join(" ")}
                >
                  <span className="text-xs font-medium leading-tight">
                    {v.name}
                  </span>
                  <span className="text-sm font-bold text-bee-gold leading-tight">
                    {formatCurrency(effectivePrice)}
                  </span>
                  {v.offerPrice && (
                    <span className="text-[10px] leading-tight line-through text-muted-foreground">
                      {formatCurrency(v.price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

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

/* ─── Page ─── */
export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerResult | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
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
    price: "0",
    deliveryTime: "0",
  });

  const createOrderMutation = useCreateOrder();

  const { data: customerDetail } = useQuery({
    queryKey: ["customer-detail", selectedCustomer?.id],
    queryFn: () =>
      apiFetch<CustomerDetail>(`/admin/customers/${selectedCustomer!.id}`),
    enabled: !!selectedCustomer?.id,
  });

  // Derived state — user edits override customer defaults, no effect needed
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
  // Auto-select "DELIVERY" when the customer has a saved address and user hasn't chosen yet
  const effectiveDeliveryType: DeliveryType =
    deliveryType || (customerAddress ? "DELIVERY" : "");

  const { data: giftTiersData } = useQuery({
    queryKey: ["gift-tiers"],
    queryFn: () => apiFetch<GiftTier[]>("/admin/gift-tiers"),
  });
  const activeGiftTiers = giftTiersData?.filter((g) => g.isActive) ?? [];

  function toggleGift(id: string) {
    setSelectedGiftIds((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
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

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return !!selectedCustomer;
      case 2:
        return cartItems.length > 0;
      case 3:
        return (
          !!paymentMethod &&
          !!effectiveDeliveryType &&
          (effectiveDeliveryType !== "DELIVERY" ||
            (!!effectiveAddress.street &&
              !!effectiveAddress.number &&
              !!shippingInfo.carrier))
        );
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
    if (!selectedCustomer || !paymentMethod) return;
    createOrderMutation.mutate(
      {
        customerId: selectedCustomer.id,
        items: cartItems.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
          price: i.unitPrice,
          originalPrice: i.originalPrice,
        })),
        paymentMethod,
        couponCode: couponCode || undefined,
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
                price: parseFloat(shippingInfo.price) || 0,
                deliveryTime: parseInt(shippingInfo.deliveryTime) || 0,
              }
            : undefined,
        giftTierIds: selectedGiftIds.length > 0 ? selectedGiftIds : undefined,
        notes: notes || undefined,
      },
      { onSuccess: () => router.push("/dashboard/orders") },
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-8">
      {/* Header */}
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

      {/* Step Indicator */}
      <StepIndicator current={step} />

      {/* Step Content */}
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
          {/* ── Step 1: Customer ── */}
          {step === 1 && (
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

          {/* ── Step 2: Items ── */}
          {step === 2 && (
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
                      {/* Header row: product name and delete button */}
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

                      {/* Variant and price row */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span className="flex-1 min-w-0">
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

                      {/* Controls row: quantity and total */}
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

              {/* Gifts */}
              {activeGiftTiers.length > 0 && (
                <div className="space-y-2 pt-2">
                  <Separator />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-1">
                    Brindes{" "}
                    <span className="font-normal normal-case">(opcional)</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeGiftTiers.map((gift) => {
                      const isSelected = selectedGiftIds.includes(gift.id);
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
                            <Check className="h-4 w-4 text-bee-gold shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Payment & Shipping ── */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Order summary */}
              <div className="rounded-lg bg-muted/40 border p-3 space-y-1.5 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resumo do pedido
                </p>
                <div className="space-y-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex justify-between items-start"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="text-muted-foreground text-sm">
                          {item.productName} — {item.variantName} ×{" "}
                          {item.quantity}
                        </p>
                        {item.originalPrice && (
                          <p className="text-xs text-muted-foreground/70 line-through">
                            {formatCurrency(item.originalPrice)} / un.
                          </p>
                        )}
                      </div>
                      <span
                        className={
                          item.originalPrice
                            ? "shrink-0 tabular-nums font-semibold text-green-600"
                            : "shrink-0 tabular-nums font-medium"
                        }
                      >
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Desconto ({couponLookup?.discountPercentage}% —{" "}
                      {couponLookup?.code})
                    </span>
                    <span>− {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-1 border-t">
                  <span>Total</span>
                  <span className="text-bee-gold">
                    {formatCurrency(discountedTotal)}
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div className="space-y-1.5">
                <Label>Forma de Pagamento *</Label>
                <div className="flex flex-wrap gap-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setPaymentMethod(m.value)}
                      className={[
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                        paymentMethod === m.value
                          ? "border-bee-gold bg-bee-gold/10 ring-1 ring-bee-gold text-bee-gold"
                          : "border-border hover:border-muted-foreground/50 hover:bg-muted/40",
                      ].join(" ")}
                    >
                      {m.label}
                    </button>
                  ))}
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
                        Cupom válido — {couponLookup!.discountPercentage}% de
                        desconto
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
                        <div className="space-y-1.5 sm:col-span-2">
                          <Label htmlFor="street" className="text-sm">
                            Rua *
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
                        <div className="space-y-1.5">
                          <Label htmlFor="number" className="text-sm">
                            Número *
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
                        <div className="space-y-1.5">
                          <Label htmlFor="neighborhood" className="text-sm">
                            Bairro *
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
                        <div className="space-y-1.5">
                          <Label htmlFor="city" className="text-sm">
                            Cidade *
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
                        <div className="space-y-1.5">
                          <Label htmlFor="state" className="text-sm">
                            Estado *
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
                        <div className="space-y-1.5">
                          <Label htmlFor="zipCode" className="text-sm">
                            CEP *
                          </Label>
                          <Input
                            id="zipCode"
                            placeholder="00000-000"
                            value={effectiveAddress.zipCode}
                            onChange={(e) =>
                              setAddressOverrides((s) => ({
                                ...s,
                                zipCode: e.target.value,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <Separator />

                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Transportadora
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="carrier" className="text-sm">
                            Transportadora *
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
                            Serviço
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
                          <Label htmlFor="shippingPrice" className="text-sm">
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
                          <Label htmlFor="deliveryTime" className="text-sm">
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

      {/* Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
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
            ? "Criando pedido..."
            : step === STEPS.length
              ? "Criar Pedido"
              : "Próximo"}
        </Button>
      </div>
    </div>
  );
}
