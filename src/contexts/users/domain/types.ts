export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  roleId: string | null;
  roleName: string | null;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleId?: string;
  isActive?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  roleId?: string | null;
  isActive?: boolean;
}
