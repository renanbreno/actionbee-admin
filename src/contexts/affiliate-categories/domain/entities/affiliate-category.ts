export type AffiliateCategoryStatus = "ACTIVE" | "INACTIVE";

export interface AffiliateCategory {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
