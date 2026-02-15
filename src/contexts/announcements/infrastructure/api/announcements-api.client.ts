import { apiFetch } from "@/shared/infrastructure/api/api-client";

export interface AnnouncementApiResponse {
  id: string;
  message: string;
  type: "promotion" | "warning" | "info";
  isActive: boolean;
  startsAt: number;
  endsAt: number | null;
  isUnlimited: boolean;
  isCurrentlyVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnouncementApiRequest {
  message: string;
  type: "promotion" | "warning" | "info";
  isActive: boolean;
  startsAt: number;
  endsAt?: number | null;
}

export const announcementsApiClient = {
  getAll(): Promise<AnnouncementApiResponse[]> {
    return apiFetch<AnnouncementApiResponse[]>("/admin/announcements");
  },

  create(data: CreateAnnouncementApiRequest): Promise<AnnouncementApiResponse> {
    return apiFetch<AnnouncementApiResponse>("/admin/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: string, data: Partial<CreateAnnouncementApiRequest>): Promise<AnnouncementApiResponse> {
    return apiFetch<AnnouncementApiResponse>(`/admin/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deactivate(id: string): Promise<void> {
    return apiFetch<void>(`/admin/announcements/${id}/deactivate`, {
      method: "PATCH",
    });
  },
};
