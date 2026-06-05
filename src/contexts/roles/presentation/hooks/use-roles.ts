import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { rolesApiClient } from "../../infrastructure/api/roles-api.client";
import { CreateRoleInput, UpdateRoleInput } from "../../domain/types";

const ROLES_KEY = ["roles"];

export function useRoles() {
  return useQuery({
    queryKey: ROLES_KEY,
    queryFn: () => rolesApiClient.getAll(),
  });
}

export function usePermissionsCatalog() {
  return useQuery({
    queryKey: ["permissions-catalog"],
    queryFn: () => rolesApiClient.getPermissionsCatalog(),
    staleTime: 60 * 60 * 1000,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRoleInput) => rolesApiClient.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success("Cargo criado com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRoleInput }) =>
      rolesApiClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success("Cargo atualizado com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rolesApiClient.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_KEY });
      toast.success("Cargo excluído com sucesso");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}
