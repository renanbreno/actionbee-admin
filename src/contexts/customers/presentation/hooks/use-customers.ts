import { useQuery } from "@tanstack/react-query";
import { getAllCustomersUseCase } from "../../di";

export function useCustomers(page: number, limit: number, search?: string) {
  return useQuery({
    queryKey: ["customers", page, limit, search],
    queryFn: () => getAllCustomersUseCase.execute(page, limit, search),
  });
}
