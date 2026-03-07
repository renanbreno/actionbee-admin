import { useQuery } from "@tanstack/react-query";
import { getAllCustomersUseCase } from "../../di";

export function useCustomers(page: number, limit: number, search?: string, inactiveOnly?: boolean) {
  return useQuery({
    queryKey: ["customers", page, limit, search, inactiveOnly],
    queryFn: () => getAllCustomersUseCase.execute(page, limit, search, inactiveOnly),
  });
}
