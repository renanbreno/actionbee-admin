import { PaginatedProducts, Product, RelatedProduct } from "../entities/product";
import { StorySection } from "../entities/story-section";

export interface ProductVariantDTO {
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
  hasFreeShipping?: boolean;
  isRetailerVariant?: boolean;
}

export interface CreateProductDTO {
  name: string;
  description?: string | null;
  costPrice: number;
  brandId?: string | null;
  flavorId?: string | null;
  variationType?: string | null;
  isActive?: boolean;
  showOnEcommerce?: boolean;
  categoryId?: string | null;
  storySections?: StorySection[];
  variants: ProductVariantDTO[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string | null;
  costPrice?: number;
  brandId?: string | null;
  flavorId?: string | null;
  variationType?: string | null;
  isActive?: boolean;
  showOnEcommerce?: boolean;
  categoryId?: string | null;
  storySections?: StorySection[];
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
