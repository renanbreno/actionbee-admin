export interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CustomerLastOrderItem {
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isBonus?: boolean;
}

export interface CustomerLastOrderGift {
  giftName: string;
  quantity: number;
}

export interface CustomerLastOrder {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: CustomerLastOrderItem[];
  gifts: CustomerLastOrderGift[];
}

export const CustomerType = {
  FINAL_CONSUMER: 'FINAL_CONSUMER',
  RETAILER_RESELLER: 'RETAILER_RESELLER',
  DISTRIBUTOR_RESELLER: 'DISTRIBUTOR_RESELLER',
} as const;

export type CustomerType = typeof CustomerType[keyof typeof CustomerType];

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  FINAL_CONSUMER: 'Consumidor Final',
  RETAILER_RESELLER: 'Lojista',
  DISTRIBUTOR_RESELLER: 'Distribuidor',
};

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  customerType?: CustomerType | null;
  stateRegistration?: string | null;
  isIeExempt?: boolean | null;
  birthDate?: string | null;
  emailVerified: boolean;
  ordersCount?: number;
  address?: CustomerAddress | null;
  createdAt: string;
  updatedAt?: string;
  lastOrderDate?: string | null;
  lastOrder?: CustomerLastOrder | null;
}

export interface PaginatedCustomers {
  customers: Customer[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
