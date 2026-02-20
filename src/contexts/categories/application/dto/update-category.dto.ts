export interface UpdateCategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
  featured?: boolean;
  isFoodProduct?: boolean;
  parentId?: string;
}
