import { AffiliateRepositoryImpl } from "./infrastructure/repositories/affiliate-repository.impl";
import { GetAllAffiliatesUseCase } from "./application/use-cases/get-all-affiliates.use-case";
import { CreateAffiliateUseCase } from "./application/use-cases/create-affiliate.use-case";
import { UpdateAffiliateUseCase } from "./application/use-cases/update-affiliate.use-case";
import { DeleteAffiliateUseCase } from "./application/use-cases/delete-affiliate.use-case";

const affiliateRepository = new AffiliateRepositoryImpl();

export const getAllAffiliatesUseCase = new GetAllAffiliatesUseCase(
  affiliateRepository,
);
export const createAffiliateUseCase = new CreateAffiliateUseCase(
  affiliateRepository,
);
export const updateAffiliateUseCase = new UpdateAffiliateUseCase(
  affiliateRepository,
);
export const deleteAffiliateUseCase = new DeleteAffiliateUseCase(
  affiliateRepository,
);
