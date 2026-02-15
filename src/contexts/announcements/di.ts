import { AnnouncementRepositoryImpl } from "./infrastructure/repositories/announcement-repository.impl";
import { GetAnnouncementsUseCase } from "./application/use-cases/get-announcements.use-case";
import { CreateAnnouncementUseCase } from "./application/use-cases/create-announcement.use-case";
import { DeactivateAnnouncementUseCase } from "./application/use-cases/deactivate-announcement.use-case";
import { UpdateAnnouncementUseCase } from "./application/use-cases/update-announcement.use-case";

const announcementRepository = new AnnouncementRepositoryImpl();

export const getAnnouncementsUseCase = new GetAnnouncementsUseCase(announcementRepository);
export const createAnnouncementUseCase = new CreateAnnouncementUseCase(announcementRepository);
export const deactivateAnnouncementUseCase = new DeactivateAnnouncementUseCase(announcementRepository);
export const updateAnnouncementUseCase = new UpdateAnnouncementUseCase(announcementRepository);
