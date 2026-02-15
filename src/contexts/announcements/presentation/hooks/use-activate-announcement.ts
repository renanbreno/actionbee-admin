"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnnouncementUseCase } from "../../di";

export function useActivateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      updateAnnouncementUseCase.execute(id, { isActive: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
