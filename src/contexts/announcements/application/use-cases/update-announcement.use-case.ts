import { Announcement } from "../../domain/entities/announcement";
import { AnnouncementRepository } from "../../domain/repositories/announcement-repository.interface";
import { UpdateAnnouncementDto } from "../dto/update-announcement.dto";

export class UpdateAnnouncementUseCase {
  constructor(private readonly repository: AnnouncementRepository) {}

  async execute(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    return this.repository.update(id, dto);
  }
}
