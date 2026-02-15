"use client";

import { useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnouncementsTable } from "@/contexts/announcements/presentation/components/announcements-table";
import { CreateAnnouncementDialog } from "@/contexts/announcements/presentation/components/create-announcement-dialog";

export default function AnnouncementsPage() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-bee-gold/10">
            <Megaphone className="h-5 w-5 sm:h-6 sm:w-6 text-bee-gold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Anúncios</h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Gerencie os banners e avisos exibidos no site.
            </p>
          </div>
        </div>

        {/* Desktop button */}
        <Button
          onClick={() => setCreateOpen(true)}
          className="hidden sm:inline-flex gap-2 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          Novo Anúncio
        </Button>
      </div>

      <AnnouncementsTable />

      {/* Mobile FAB */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-bee-gold text-black shadow-lg shadow-bee-gold/30 transition-all duration-200 hover:shadow-xl hover:scale-110 active:scale-95 sm:hidden"
        aria-label="Novo Anúncio"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </button>

      <CreateAnnouncementDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
