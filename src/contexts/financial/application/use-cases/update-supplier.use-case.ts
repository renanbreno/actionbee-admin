import type { Supplier } from "../../domain/entities/supplier";
import { financialApiClient } from "../../infrastructure/api/financial-api.client";

export class UpdateSupplierUseCase {
  execute(
    id: string,
    data: {
      razaoSocial?: string;
      nomeFantasia?: string;
      cnpj?: string;
      inscricaoEstadual?: string;
      email?: string;
      phone?: string;
      street?: string;
      number?: string;
      complement?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
      notes?: string;
      active?: boolean;
    },
  ): Promise<Supplier> {
    return financialApiClient.updateSupplier(id, data);
  }
}
