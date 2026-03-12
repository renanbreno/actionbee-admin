"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  Minus,
  Package,
  Plus,
  Trash2,
  Truck,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/shared/infrastructure/api/api-client";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useUpdateOrder } from "@/contexts/orders/presentation/hooks/use-update-order";
import { useOrderDetail } from "@/contexts/orders/presentation/hooks/use-order-detail";
import { UpdateOrderDTO } from "@/contexts/orders/application/dto/update-order.dto";
import type { OrderDetail } from "@/contexts/orders/domain/entities/order";
import { CurrencyInput } from "@/shared/presentation/components/currency-input";

interface CustomerResult {
  id: string;
  name: string;
  email: string;
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  retailerPrice?: number;
  distributorPrice?: number;
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

function formatCurrency(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export default function EditOrderPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const { data: order, isLoading: isLoadingOrder } = useOrderDetail(orderId);
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();

  const [searchTerm, setSearchTerm] = useState("");
  const [productSearchResults, setProductSearchResults] = useState<ProductResult[]>([]);
  const [isSearchingProducts, setIsSearchingProducts] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [customerSearchResults, setCustomerSearchResults] = useState<CustomerResult[]>([]);
  const [isSearchingCustomers, setIsSearchingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResult | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [shippingInfo, setShippingInfo] = useState({
    carrier: "ADMIN",
    service: "ADMIN",
    price: 0,
    deliveryTime: 0,
  });

  const [couponCode, setCouponCode] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");

  const debouncedProductSearch = useDebounce(searchTerm, 300);
  const debouncedCustomerSearch = useDebounce(customerSearchTerm, 300);

  // Load order data and populate form
  useEffect(() => {
    if (order) {
      setCustomerId(order.customerId);
      setShippingAddress({
        street: order.shippingAddress.street || "",
        number: order.shippingAddress.number || "",
        complement: order.shippingAddress.complement || "",
        neighborhood: order.shippingAddress.neighborhood || "",
        city: order.shippingAddress.city || "",
        state: order.shippingAddress.state || "",
        zipCode: order.shippingAddress.zipCode || "",
      });
      setShippingInfo({
        carrier: order.shippingInfo.carrier,
        service: order.shippingInfo.service,
        price: order.shippingInfo.price,
        deliveryTime: order.shippingInfo.deliveryTime,
      });
      setCouponCode(order.couponCode || "");
      setCartItems(
        order.items
          .filter((item) => !item.isBonus)
          .map((item) => ({
            productId: item.productId,
            productName: item.productName,
            variantId: item.variantId,
            variantName: item.variantName,
            unitPrice: item.unitPrice,
            originalPrice: item.originalPrice,
            quantity: item.quantity,
          })),
      );
    }
  }, [order]);

  // Search products
  useEffect(() => {
    if (debouncedProductSearch.length < 2) {
      setProductSearchResults([]);
      return;
    }

    setIsSearchingProducts(true);
    apiFetch<{ products: ProductResult[] }>(`/admin/products?search=${encodeURIComponent(debouncedProductSearch)}&limit=10`)
      .then((data) => setProductSearchResults(data.products || []))
      .catch(() => setProductSearchResults([]))
      .finally(() => setIsSearchingProducts(false));
  }, [debouncedProductSearch]);

  // Search customers
  useEffect(() => {
    if (debouncedCustomerSearch.length < 2) {
      setCustomerSearchResults([]);
      return;
    }

    setIsSearchingCustomers(true);
    apiFetch<{ customers: CustomerResult[] }>(`/admin/customers?search=${encodeURIComponent(debouncedCustomerSearch)}&limit=10`)
      .then((data) => setCustomerSearchResults(data.customers || []))
      .catch(() => setCustomerSearchResults([]))
      .finally(() => setIsSearchingCustomers(false));
  }, [debouncedCustomerSearch]);

  // Load customer details when selected
  useEffect(() => {
    if (customerId) {
      apiFetch<CustomerDetail>(`/admin/customers/${customerId}`)
        .then((data) => setSelectedCustomer(data))
        .catch(() => setSelectedCustomer(null));
    }
  }, [customerId]);

  // Use customer address if available
  useEffect(() => {
    if (selectedCustomer?.address) {
      setShippingAddress({
        street: selectedCustomer.address.street,
        number: selectedCustomer.address.number,
        complement: selectedCustomer.address.complement || "",
        neighborhood: selectedCustomer.address.neighborhood,
        city: selectedCustomer.address.city,
        state: selectedCustomer.address.state,
        zipCode: selectedCustomer.address.zipCode,
      });
    }
  }, [selectedCustomer]);

  const handleAddProduct = useCallback((variant: ProductVariant, productId: string, productName: string) => {
    const existingIndex = cartItems.findIndex((item) => item.variantId === variant.id);
    const price = variant.offerPrice || variant.price;

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId,
          productName,
          variantId: variant.id,
          variantName: variant.name,
          unitPrice: price,
          originalPrice: variant.offerPrice ? variant.price : undefined,
          quantity: 1,
        },
      ]);
    }

    setSearchTerm("");
    setProductSearchResults([]);
  }, [cartItems]);

  const handleRemoveItem = useCallback((index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  }, [cartItems]);

  const handleUpdateQuantity = useCallback((index: number, delta: number) => {
    const updated = [...cartItems];
    const newQuantity = Math.max(1, updated[index].quantity + delta);
    updated[index] = { ...updated[index], quantity: newQuantity };
    setCartItems(updated);
  }, [cartItems]);

  const handleSubmit = useCallback(() => {
    if (!order) return;
    if (cartItems.length === 0) {
      alert("Adicione pelo menos um item ao pedido");
      return;
    }

    const updateData: UpdateOrderDTO = {
      customerId,
      items: cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: item.unitPrice,
        originalPrice: item.originalPrice,
      })),
      couponCode: couponCode || undefined,
      shippingAddress: {
        street: shippingAddress.street,
        number: shippingAddress.number,
        complement: shippingAddress.complement || undefined,
        neighborhood: shippingAddress.neighborhood,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
      },
      shippingInfo: {
        carrier: shippingInfo.carrier,
        service: shippingInfo.service,
        price: shippingInfo.price,
        deliveryTime: shippingInfo.deliveryTime,
      },
    };

    updateOrder(
      { id: orderId, params: updateData },
      {
        onSuccess: () => {
          router.push("/dashboard/orders");
        },
      },
    );
  }, [order, cartItems, customerId, couponCode, shippingAddress, shippingInfo, orderId, updateOrder, router]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountedAmount = totalAmount; // Will be calculated by backend based on coupon

  if (isLoadingOrder) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Pedido não encontrado</p>
          <Button variant="outline" onClick={() => router.push("/dashboard/orders")} className="mt-4">
            Voltar para Pedidos
          </Button>
        </div>
      </div>
    );
  }

  if (order.status === "SHIPPED") {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <Badge variant="destructive" className="mb-4">
            Não é possível editar pedidos enviados
          </Badge>
          <p className="text-muted-foreground">
            Este pedido já foi enviado e não pode ser editado.
          </p>
          <Button variant="outline" onClick={() => router.push("/dashboard/orders")} className="mt-4">
            Voltar para Pedidos
          </Button>
        </div>
      </div>
    );
  }

  if (order.commissionStatus === "PAID" || order.representativeCommissionStatus === "PAID") {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <Badge variant="destructive" className="mb-4">
            Não é possível editar pedidos com comissão paga
          </Badge>
          <p className="text-muted-foreground">
            Este pedido tem comissão paga e não pode ser editado.
          </p>
          <Button variant="outline" onClick={() => router.push("/dashboard/orders")} className="mt-4">
            Voltar para Pedidos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard/orders")} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Pedidos
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Editar Pedido {order.orderNumber}</h1>
        <p className="text-muted-foreground mt-1">
          Modifique os dados do pedido abaixo. As comissões serão recalculadas automaticamente.
        </p>
      </div>

      {/* Customer Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Buscar Cliente</Label>
            <div className="relative mt-2">
              <Input
                placeholder="Digite o nome ou email do cliente..."
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />
              {isSearchingCustomers && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin" />
              )}
            </div>
            {customerSearchResults.length > 0 && (
              <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                {customerSearchResults.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setCustomerId(customer.id);
                      setCustomerSearchTerm("");
                      setCustomerSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                    {customerId === customer.id && <Check className="h-4 w-4 text-green-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Itens
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Search */}
          <div>
            <Label>Adicionar Produto</Label>
            <div className="relative mt-2">
              <Input
                placeholder="Digite o nome do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {isSearchingProducts && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin" />
              )}
            </div>
            {productSearchResults.length > 0 && (
              <div className="mt-2 border rounded-md max-h-64 overflow-y-auto">
                {productSearchResults.map((product) => (
                  <div key={product.id} className="p-2 border-b">
                    <p className="font-medium">{product.name}</p>
                    <div className="mt-1 space-y-1">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => handleAddProduct(variant, product.id, product.name)}
                          className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors flex justify-between items-center text-sm"
                        >
                          <span className="flex-1">{variant.name}</span>
                          <span className="font-medium">
                            {variant.offerPrice ? (
                              <>
                                <span className="line-through text-muted-foreground mr-2">
                                  {formatCurrency(variant.price)}
                                </span>
                                {formatCurrency(variant.offerPrice)}
                              </>
                            ) : (
                              formatCurrency(variant.price)
                            )}
                          </span>
                          <Plus className="h-4 w-4 text-muted-foreground ml-2" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Items */}
          {cartItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum item adicionado
            </div>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">{item.variantName}</p>
                    {item.originalPrice && (
                      <p className="text-xs text-green-600">
                        de {formatCurrency(item.originalPrice)} por {formatCurrency(item.unitPrice)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(index, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(index, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold">{formatCurrency(item.unitPrice * item.quantity)}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Totals */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coupon */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cupom</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Código do cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            />
            {couponCode && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCouponCode("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço de Entrega
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={shippingAddress.number}
                onChange={(e) => setShippingAddress({ ...shippingAddress, number: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              value={shippingAddress.complement}
              onChange={(e) => setShippingAddress({ ...shippingAddress, complement: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={shippingAddress.neighborhood}
                onChange={(e) => setShippingAddress({ ...shippingAddress, neighborhood: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                value={shippingAddress.zipCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Informações de Frete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="carrier">Transportadora</Label>
              <Input
                id="carrier"
                value={shippingInfo.carrier}
                onChange={(e) => setShippingInfo({ ...shippingInfo, carrier: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="service">Serviço</Label>
              <Input
                id="service"
                value={shippingInfo.service}
                onChange={(e) => setShippingInfo({ ...shippingInfo, service: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shippingPrice">Preço do Frete</Label>
              <CurrencyInput
                id="shippingPrice"
                value={shippingInfo.price}
                onChange={(value) => setShippingInfo({ ...shippingInfo, price: value })}
              />
            </div>
            <div>
              <Label htmlFor="deliveryTime">Prazo de Entrega (dias)</Label>
              <Input
                id="deliveryTime"
                type="number"
                value={shippingInfo.deliveryTime}
                onChange={(e) => setShippingInfo({ ...shippingInfo, deliveryTime: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/orders")}
          className="flex-1"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isUpdating || cartItems.length === 0}
          className="flex-1"
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

interface CustomerDetail extends CustomerResult {
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}
