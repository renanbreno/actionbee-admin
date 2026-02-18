import { Affiliate } from "../../domain/entities/affiliate";
import { AffiliateRepository } from "../../domain/repositories/affiliate-repository.interface";
import { CreateAffiliateDto } from "../dto/create-affiliate.dto";

export class CreateAffiliateUseCase {
  constructor(private readonly repository: AffiliateRepository) {}

  async execute(dto: CreateAffiliateDto): Promise<Affiliate> {
    return this.repository.create(dto);
  }
}
