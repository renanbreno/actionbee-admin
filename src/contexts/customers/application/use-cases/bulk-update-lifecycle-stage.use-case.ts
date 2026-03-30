import type { CustomerRepository } from "../../domain/repositories/customer-repository.interface";
import type { CustomerLifecycleStage } from "../../domain/entities/customer";

export class BulkUpdateLifecycleStageUseCase {
  constructor(private readonly repository: CustomerRepository) {}

  async execute(ids: string[], stage: CustomerLifecycleStage): Promise<void> {
    return this.repository.bulkUpdateLifecycleStage(ids, stage);
  }
}
