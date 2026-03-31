import { crmApiClient } from "../api/crm-api.client";
import type {
  ICrmPipelineRepository,
  CreatePipelineDTO,
  UpdatePipelineDTO,
  AddStageDTO,
  UpdateStageDTO,
} from "../../domain/repositories/crm-pipeline-repository.interface";
import type { PipelineType } from "../../domain/enums";

export class CrmPipelineRepositoryImpl implements ICrmPipelineRepository {
  getAll(type?: PipelineType) { return crmApiClient.getPipelines(type); }
  getById(id: string) { return crmApiClient.getPipelineById(id); }
  create(dto: CreatePipelineDTO) { return crmApiClient.createPipeline(dto); }
  update(id: string, dto: UpdatePipelineDTO) { return crmApiClient.updatePipeline(id, dto); }
  delete(id: string) { return crmApiClient.deletePipeline(id); }
  addStage(pipelineId: string, dto: AddStageDTO) { return crmApiClient.addStage(pipelineId, dto); }
  updateStage(pipelineId: string, stageId: string, dto: UpdateStageDTO) { return crmApiClient.updateStage(pipelineId, stageId, dto); }
  deleteStage(pipelineId: string, stageId: string) { return crmApiClient.deleteStage(pipelineId, stageId); }
}
