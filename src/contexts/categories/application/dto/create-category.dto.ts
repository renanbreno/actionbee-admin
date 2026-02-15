export interface CreateCategoryDto {
  name: string;
  description?: string;
  featured?: boolean;
  parentId?: string;
}
