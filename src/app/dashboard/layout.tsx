"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/shared/presentation/components/admin-sidebar";
import { ProtectedRoute } from "@/contexts/auth/presentation/components/protected-route";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-muted/30">
          <AdminSidebar />
          <main className="flex-1 flex flex-col">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-6">
              <SidebarTrigger className="-ml-2" />
              <Separator orientation="vertical" className="mx-2 h-5" />
              <span className="text-muted-foreground text-sm font-medium">
                Painel Administrativo
              </span>
            </header>
            <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
          </main>
        </div>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </ProtectedRoute>
  );
}
