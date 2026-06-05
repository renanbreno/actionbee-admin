export interface Role {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  permissions: string[];
  isSystem: boolean;
  adminsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionDefinition {
  key: string;
  resource: string;
  action: string;
  description: string;
}

export interface PermissionGroup {
  resource: string;
  label: string;
  permissions: PermissionDefinition[];
}

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions: string[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: string[];
}
