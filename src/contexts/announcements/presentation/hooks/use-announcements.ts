"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnnouncementsUseCase } from "../../di";

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => getAnnouncementsUseCase.execute(),
  });
}
