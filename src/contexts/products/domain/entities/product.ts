export interface ProductImage {
  id: string;
  url: string;
  order: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  unitsPerVariant: number;
  price: number;
  offerPrice?: number | null;
  retailerPrice?: number | null;
  height?: number | null;
  width?: number | null;
  depth?: number | null;
  weight?: number | null;
  ean?: string | null;
  unitId?: string | null;
  unit?: {
    id: string;
    acronym: string;
    name: string;
  };
  unitCost?: number;
  hasFreeShipping?: boolean;
  isRetailerVariant?: boolean;
  availableStock?: number;
  isActive?: boolean;
  order?: number;
}

export interface RelatedProduct {
  productId: string;
  name: string;
  order?: number;
  isAutomatic?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  ingredients?: string | null;
  usageRecommendation?: string | null;
  brandId?: string | null;
  brandName?: string | null;
  variationType?: string | null;
  isActive: boolean;
  showOnEcommerce?: boolean;
  categoryId?: string | null;
  categoryName?: string | null;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  costPrice?: number;
  stockUnits?: number;
  variants: ProductVariant[];
  images: ProductImage[];
  relatedProducts?: RelatedProduct[];
  nutritionalTableImage?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedProducts {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
