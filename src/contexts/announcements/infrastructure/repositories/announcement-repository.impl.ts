import { Announcement } from "../../domain/entities/announcement";
import {
  AnnouncementRepository,
  CreateAnnouncementParams,
  UpdateAnnouncementParams,
} from "../../domain/repositories/announcement-repository.interface";
import { announcementsApiClient } from "../api/announcements-api.client";

export class AnnouncementRepositoryImpl implements AnnouncementRepository {
  async getAll(): Promise<Announcement[]> {
    return announcementsApiClient.getAll();
  }

  async create(params: CreateAnnouncementParams): Promise<Announcement> {
    return announcementsApiClient.create(params);
  }

  async update(id: string, params: UpdateAnnouncementParams): Promise<Announcement> {
    return announcementsApiClient.update(id, params);
  }

  async deactivate(id: string): Promise<void> {
    return announcementsApiClient.deactivate(id);
  }
}
