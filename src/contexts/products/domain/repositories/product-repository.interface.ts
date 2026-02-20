import { PaginatedProducts, Product, RelatedProduct } from "../entities/product";

export interface ProductVariantDTO {
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
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  brand?: string | null;
  variationType?: string | null;
  isActive?: boolean;
  showOnEcommerce?: boolean;
  categoryId?: string | null;
  variants: ProductVariantDTO[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  brand?: string | null;
  variationType?: string | null;
  isActive?: boolean;
  showOnEcommerce?: boolean;
  categoryId?: string | null;
  variants?: ProductVariantDTO[];
  images?: { url: string; order?: number }[];
}

export interface ProductRepository {
  getAllPaginated(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
  ): Promise<PaginatedProducts>;
  getById(id: string): Promise<Product>;
  create(
    data: CreateProductDTO,
    images: File[],
    nutritionalTableImage?: File,
  ): Promise<Product>;
  update(
    id: string,
    data: UpdateProductDTO,
    images?: File[],
    nutritionalTableImage?: File,
  ): Promise<Product>;
  getRelatedProducts(id: string): Promise<RelatedProduct[]>;
  setRelatedProducts(
    id: string,
    relatedProducts: { productId: string; order?: number }[],
  ): Promise<void>;
}
