"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnnouncementUseCase } from "../../di";
import { UpdateAnnouncementDto } from "../../application/dto/update-announcement.dto";

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAnnouncementDto }) =>
      updateAnnouncementUseCase.execute(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
