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
  height?: number | null;
  width?: number | null;
  depth?: number | null;
  weight?: number | null;
  ean?: string | null;
  unit?: string | null;
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
  brand?: string | null;
  variationType?: string | null;
  isActive: boolean;
  categoryId?: string | null;
  categoryName?: string | null;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
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
