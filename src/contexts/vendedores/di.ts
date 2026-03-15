import { VendedorRepositoryImpl } from "./infrastructure/repositories/vendedor-repository.impl";
import { GetAllVendedoresUseCase } from "./application/use-cases/get-all-vendedores.use-case";
import { CreateVendedorUseCase } from "./application/use-cases/create-vendedor.use-case";
import { UpdateVendedorUseCase } from "./application/use-cases/update-vendedor.use-case";
import { DeleteVendedorUseCase } from "./application/use-cases/delete-vendedor.use-case";
import { GetVendedorSalesReportUseCase } from "./application/use-cases/get-sales-report.use-case";
import { GetVendedorCommissionSummaryUseCase } from "./application/use-cases/get-commission-summary.use-case";

const vendedorRepository = new VendedorRepositoryImpl();

export const getAllVendedoresUseCase = new GetAllVendedoresUseCase(vendedorRepository);
export const createVendedorUseCase = new CreateVendedorUseCase(vendedorRepository);
export const updateVendedorUseCase = new UpdateVendedorUseCase(vendedorRepository);
export const deleteVendedorUseCase = new DeleteVendedorUseCase(vendedorRepository);
export const getVendedorSalesReportUseCase = new GetVendedorSalesReportUseCase(vendedorRepository);
export const getVendedorCommissionSummaryUseCase = new GetVendedorCommissionSummaryUseCase(vendedorRepository);
export const vendedorRepoForCommissions = vendedorRepository;
