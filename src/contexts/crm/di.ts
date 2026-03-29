import { CrmPipelineRepositoryImpl } from "./infrastructure/repositories/crm-pipeline-repository.impl";
import { CrmDealRepositoryImpl } from "./infrastructure/repositories/crm-deal-repository.impl";
import { CrmInteractionRepositoryImpl } from "./infrastructure/repositories/crm-interaction-repository.impl";
import { CrmTaskRepositoryImpl } from "./infrastructure/repositories/crm-task-repository.impl";

import { GetPipelinesUseCase } from "./application/use-cases/get-pipelines.use-case";
import { GetPipelineByIdUseCase } from "./application/use-cases/get-pipeline-by-id.use-case";
import { CreatePipelineUseCase } from "./application/use-cases/create-pipeline.use-case";
import { UpdatePipelineUseCase } from "./application/use-cases/update-pipeline.use-case";
import { DeletePipelineUseCase } from "./application/use-cases/delete-pipeline.use-case";
import { AddPipelineStageUseCase } from "./application/use-cases/add-pipeline-stage.use-case";
import { UpdatePipelineStageUseCase } from "./application/use-cases/update-pipeline-stage.use-case";
import { DeletePipelineStageUseCase } from "./application/use-cases/delete-pipeline-stage.use-case";

import { GetDealsUseCase } from "./application/use-cases/get-deals.use-case";
import { GetDealByIdUseCase } from "./application/use-cases/get-deal-by-id.use-case";
import { CreateDealUseCase } from "./application/use-cases/create-deal.use-case";
import { UpdateDealUseCase } from "./application/use-cases/update-deal.use-case";
import { MoveDealStageUseCase } from "./application/use-cases/move-deal-stage.use-case";
import { DeleteDealUseCase } from "./application/use-cases/delete-deal.use-case";

import { GetInteractionsUseCase } from "./application/use-cases/get-interactions.use-case";
import { CreateInteractionUseCase } from "./application/use-cases/create-interaction.use-case";
import { UpdateInteractionUseCase } from "./application/use-cases/update-interaction.use-case";
import { DeleteInteractionUseCase } from "./application/use-cases/delete-interaction.use-case";

import { GetTasksUseCase } from "./application/use-cases/get-tasks.use-case";
import { CreateTaskUseCase } from "./application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "./application/use-cases/update-task.use-case";
import { DeleteTaskUseCase } from "./application/use-cases/delete-task.use-case";

const pipelineRepo = new CrmPipelineRepositoryImpl();
const dealRepo = new CrmDealRepositoryImpl();
const interactionRepo = new CrmInteractionRepositoryImpl();
const taskRepo = new CrmTaskRepositoryImpl();

// Pipelines
export const getPipelinesUseCase = new GetPipelinesUseCase(pipelineRepo);
export const getPipelineByIdUseCase = new GetPipelineByIdUseCase(pipelineRepo);
export const createPipelineUseCase = new CreatePipelineUseCase(pipelineRepo);
export const updatePipelineUseCase = new UpdatePipelineUseCase(pipelineRepo);
export const deletePipelineUseCase = new DeletePipelineUseCase(pipelineRepo);
export const addPipelineStageUseCase = new AddPipelineStageUseCase(pipelineRepo);
export const updatePipelineStageUseCase = new UpdatePipelineStageUseCase(pipelineRepo);
export const deletePipelineStageUseCase = new DeletePipelineStageUseCase(pipelineRepo);

// Deals
export const getDealsUseCase = new GetDealsUseCase(dealRepo);
export const getDealByIdUseCase = new GetDealByIdUseCase(dealRepo);
export const createDealUseCase = new CreateDealUseCase(dealRepo);
export const updateDealUseCase = new UpdateDealUseCase(dealRepo);
export const moveDealStageUseCase = new MoveDealStageUseCase(dealRepo);
export const deleteDealUseCase = new DeleteDealUseCase(dealRepo);

// Interactions
export const getInteractionsUseCase = new GetInteractionsUseCase(interactionRepo);
export const createInteractionUseCase = new CreateInteractionUseCase(interactionRepo);
export const updateInteractionUseCase = new UpdateInteractionUseCase(interactionRepo);
export const deleteInteractionUseCase = new DeleteInteractionUseCase(interactionRepo);

// Tasks
export const getTasksUseCase = new GetTasksUseCase(taskRepo);
export const createTaskUseCase = new CreateTaskUseCase(taskRepo);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepo);
export const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo);
