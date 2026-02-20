export interface CreateCategoryDto {
  name: string;
  description?: string;
  featured?: boolean;
  isFoodProduct?: boolean;
  parentId?: string;
}
