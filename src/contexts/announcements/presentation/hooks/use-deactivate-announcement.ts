"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deactivateAnnouncementUseCase } from "../../di";

export function useDeactivateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deactivateAnnouncementUseCase.execute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}
