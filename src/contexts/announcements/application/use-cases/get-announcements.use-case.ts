import { Announcement } from "../../domain/entities/announcement";
import { AnnouncementRepository } from "../../domain/repositories/announcement-repository.interface";

export class GetAnnouncementsUseCase {
  constructor(private readonly repository: AnnouncementRepository) {}

  async execute(): Promise<Announcement[]> {
    return this.repository.getAll();
  }
}
