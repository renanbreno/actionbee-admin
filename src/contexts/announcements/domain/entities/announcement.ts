import { AnnouncementType } from "../value-objects/announcement-type";

export interface Announcement {
  readonly id: string;
  readonly message: string;
  readonly type: AnnouncementType;
  readonly isActive: boolean;
  readonly startsAt: number;
  readonly endsAt: number | null;
  readonly isUnlimited: boolean;
  readonly isCurrentlyVisible: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}
