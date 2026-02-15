"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnnouncementUseCase } from "../../di";
import { CreateAnnouncementDto } from "../../application/dto/create-announcement.dto";

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementDto) =>
      createAnnouncementUseCase.execute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
