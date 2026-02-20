export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  featured: boolean;
  isFoodProduct: boolean;
  parentId?: string;
  parent?: Category;
  subcategories?: Category[];
  createdAt: string;
  updatedAt: string;
}
