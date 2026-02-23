export interface Unit {
  id: string;
  acronym: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitInput {
  acronym: string;
  name: string;
}

export interface UpdateUnitInput {
  acronym?: string;
  name?: string;
  isActive?: boolean;
}
