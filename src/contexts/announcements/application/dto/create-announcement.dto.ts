import { AnnouncementType } from "../../domain/value-objects/announcement-type";

export interface CreateAnnouncementDto {
  message: string;
  type: AnnouncementType;
  isActive: boolean;
  startsAt: number;
  endsAt?: number | null;
}
