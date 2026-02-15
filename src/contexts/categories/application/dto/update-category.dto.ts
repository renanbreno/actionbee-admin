export interface UpdateCategoryDto {
  name: string;
  description?: string;
  isActive?: boolean;
  featured?: boolean;
  parentId?: string;
}
