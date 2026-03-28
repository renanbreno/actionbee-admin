"use client";

import Image from "next/image";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/shared/presentation/components/admin-sidebar";
import { ProtectedRoute } from "@/contexts/auth/presentation/components/protected-route";
import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider style={{ "--sidebar-width-icon": "4rem" } as React.CSSProperties}>
        <div className="flex min-h-screen w-full overflow-hidden bg-muted/30">
          <AdminSidebar />
          <main className="flex-1 flex flex-col min-w-0">
            {/* Header visível apenas no mobile para abrir a sidebar */}
            <header className="flex md:hidden h-14 shrink-0 items-center border-b bg-background px-4">
              <SidebarTrigger />
              <div className="flex-1 flex justify-center">
                <Image src="/logo.png" alt="ActionBee" width={100} height={32} className="object-contain" priority />
              </div>
              {/* Placeholder para equilibrar o SidebarTrigger e centralizar a logo */}
              <div className="w-8" />
            </header>
            <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </ProtectedRoute>
  );
}
