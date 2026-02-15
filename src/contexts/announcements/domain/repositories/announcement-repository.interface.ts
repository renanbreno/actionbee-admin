import { Announcement } from "../entities/announcement";
import { AnnouncementType } from "../value-objects/announcement-type";

export interface CreateAnnouncementParams {
  message: string;
  type: AnnouncementType;
  isActive: boolean;
  startsAt: number;
  endsAt?: number | null;
}

export interface UpdateAnnouncementParams {
  message?: string;
  type?: AnnouncementType;
  isActive?: boolean;
  startsAt?: number;
  endsAt?: number | null;
}

export interface AnnouncementRepository {
  getAll(): Promise<Announcement[]>;
  create(params: CreateAnnouncementParams): Promise<Announcement>;
  update(id: string, params: UpdateAnnouncementParams): Promise<Announcement>;
  deactivate(id: string): Promise<void>;
}
