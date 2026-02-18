import { Affiliate } from "../../domain/entities/affiliate";
import { AffiliateRepository } from "../../domain/repositories/affiliate-repository.interface";
import { UpdateAffiliateDto } from "../dto/update-affiliate.dto";

export class UpdateAffiliateUseCase {
  constructor(private readonly repository: AffiliateRepository) {}

  async execute(id: string, dto: UpdateAffiliateDto): Promise<Affiliate> {
    return this.repository.update(id, dto);
  }
}
