import { AnnouncementRepository } from "../../domain/repositories/announcement-repository.interface";

export class DeactivateAnnouncementUseCase {
  constructor(private readonly repository: AnnouncementRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deactivate(id);
  }
}
