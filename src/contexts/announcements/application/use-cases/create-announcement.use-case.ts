import { Announcement } from "../../domain/entities/announcement";
import { AnnouncementRepository } from "../../domain/repositories/announcement-repository.interface";
import { CreateAnnouncementDto } from "../dto/create-announcement.dto";

export class CreateAnnouncementUseCase {
  constructor(private readonly repository: AnnouncementRepository) {}

  async execute(dto: CreateAnnouncementDto): Promise<Announcement> {
    return this.repository.create(dto);
  }
}
