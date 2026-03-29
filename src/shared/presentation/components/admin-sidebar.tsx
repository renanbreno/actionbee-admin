"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Megaphone,
  Package,
  ShoppingCart,
  LogOut,
  Percent,
  ChevronDown,
  Network,
  Briefcase,
  BadgeDollarSign,
  UserRound,
  Gift,
  Settings,
  Boxes,
  PanelLeftClose,
  PanelLeftOpen,
  Kanban,
} from "lucide-react";
import { useAuthContext } from "@/contexts/auth/presentation/providers/auth-provider";
import { useLogout } from "@/contexts/auth/presentation/hooks/use-logout";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SubMenuItem {
  title: string;
  href: string;
}

interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  submenu?: SubMenuItem[];
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    label: "Geral",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Anúncios", href: "/dashboard/announcements", icon: Megaphone },
    ],
  },
  {
    label: "Catálogo",
    items: [
      {
        title: "Produtos",
        icon: Package,
        submenu: [
          { title: "Lista de Produtos", href: "/dashboard/products" },
          { title: "Categorias", href: "/dashboard/products/categories" },
          { title: "Marcas", href: "/dashboard/products/brands" },
          { title: "Unidades de Medida", href: "/dashboard/units" },
        ],
      },
      { title: "Estoque", href: "/dashboard/inventory", icon: Boxes },
      { title: "Brindes", href: "/dashboard/gift-tiers", icon: Gift },
    ],
  },
  {
    label: "Vendas",
    items: [
      {
        title: "Pedidos",
        icon: ShoppingCart,
        submenu: [
          { title: "Lista de Pedidos", href: "/dashboard/orders" },
          { title: "Carrinhos Abandonados", href: "/dashboard/abandoned-carts" },
        ],
      },
      { title: "Cupons", href: "/dashboard/coupons", icon: Percent },
    ],
  },
  {
    label: "CRM",
    items: [
      {
        title: "CRM",
        icon: Kanban,
        submenu: [
          { title: "Pipelines", href: "/dashboard/crm/pipelines" },
          { title: "Negócios", href: "/dashboard/crm/deals" },
          { title: "Interações", href: "/dashboard/crm/interactions" },
          { title: "Tarefas", href: "/dashboard/crm/tasks" },
        ],
      },
    ],
  },
  {
    label: "Pessoas",
    items: [
      {
        title: "Afiliados",
        icon: Network,
        submenu: [
          { title: "Lista de Afiliados", href: "/dashboard/affiliates/list" },
          { title: "Categorias de Afiliados", href: "/dashboard/affiliates/categories" },
          { title: "Bonificações", href: "/dashboard/affiliates/bonificacoes" },
        ],
      },
      { title: "Representantes", href: "/dashboard/representatives", icon: Briefcase },
      { title: "Vendedores", href: "/dashboard/vendedores", icon: BadgeDollarSign },
      { title: "Clientes", href: "/dashboard/customers", icon: UserRound },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Configurações", href: "/dashboard/store-settings", icon: Settings },
    ],
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuthContext();
  const logoutMutation = useLogout();
  const router = useRouter();
  const { setOpenMobile, state, toggleSidebar } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    menuGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.submenu) {
          const hasActiveRoute = item.submenu.some((sub) =>
            pathname.startsWith(sub.href)
          );
          if (hasActiveRoute && !expandedItems.has(item.title)) {
            setExpandedItems((prev) => new Set(prev).add(item.title));
          }
        }
      });
    });
  }, [pathname]);

  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  const isSubmenuActive = (submenu?: SubMenuItem[]) => {
    if (!submenu) return false;
    return submenu.some((item) => pathname.startsWith(item.href));
  };

  const getSubItemActive = (subitem: SubMenuItem, siblings: SubMenuItem[]) =>
    pathname.startsWith(subitem.href) &&
    !siblings.some(
      (s) =>
        s.href !== subitem.href &&
        pathname.startsWith(s.href) &&
        s.href.length > subitem.href.length
    );

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-[2px_0_12px_0_rgba(0,0,0,0.06)]">
      {/* Header com logo + botão de toggle */}
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center">
          {/* Placeholder para equilibrar o botão e centralizar a logo */}
          <div className="w-8 shrink-0 group-data-[collapsible=icon]:hidden" />

          {/* Logo centralizada — oculta no modo recolhido */}
          <Link
            href="/dashboard"
            onClick={() => setOpenMobile(false)}
            className="flex-1 flex justify-center group-data-[collapsible=icon]:hidden"
          >
            <Image
              src="/logo.png"
              alt="ActionBee"
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          {/* Botão toggle customizado */}
          <button
            onClick={toggleSidebar}
            title={state === "expanded" ? "Recolher menu" : "Expandir menu"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/40 hover:bg-white/70 hover:text-sidebar-foreground transition-all"
          >
            {state === "expanded" ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </div>
      </SidebarHeader>

      <div className="mx-3 h-px bg-sidebar-foreground/8" />

      {/* Nav */}
      <SidebarContent className="px-2 py-2 overflow-hidden">
        <ScrollArea className="h-full [&_[data-slot=scroll-area-thumb]]:bg-sidebar-foreground/20">
          {menuGroups.map((group, groupIndex) => (
            <SidebarGroup key={group.label} className={cn("py-1", groupIndex > 0 && "mt-1")}>
              <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 group-data-[collapsible=icon]:hidden">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5 group-data-[collapsible=icon]:items-center">
                  {group.items.map((item) => {
                    const hasSubmenu = !!item.submenu;
                    const isActive = item.href
                      ? item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href)
                      : isSubmenuActive(item.submenu);
                    const isExpanded = expandedItems.has(item.title);

                    return (
                      <SidebarMenuItem key={item.title}>
                        {hasSubmenu ? (
                          <>
                            {/* Parent with submenu */}
                            <SidebarMenuButton
                              onClick={() => toggleSubmenu(item.title)}
                              tooltip={item.title}
                              isActive={isActive}
                              className={cn(
                                "h-10 rounded-xl px-3 transition-all duration-150 cursor-pointer",
                                isActive
                                  ? "bg-white shadow-sm text-sidebar-foreground font-medium"
                                  : "hover:bg-white/70 text-sidebar-foreground/60",
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "h-[18px] w-[18px] shrink-0 stroke-[1.5]",
                                  isActive
                                    ? "text-bee-gold"
                                    : "text-sidebar-foreground/40",
                                )}
                              />
                              <span
                                className={cn(
                                  "flex-1 text-sm",
                                  isActive
                                    ? "font-medium text-sidebar-foreground"
                                    : "font-normal text-sidebar-foreground/60",
                                )}
                              >
                                {item.title}
                              </span>
                              <ChevronDown
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0 transition-transform duration-200 text-sidebar-foreground/30 group-data-[collapsible=icon]:hidden",
                                  isExpanded && "rotate-180",
                                )}
                              />
                            </SidebarMenuButton>

                            {/* Submenu — always rendered, animated via grid-rows */}
                            <div
                              className={cn(
                                "grid transition-[grid-template-rows] duration-200 ease-in-out group-data-[collapsible=icon]:hidden",
                                isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                              )}
                            >
                              <div className="overflow-hidden">
                                <div className="mt-2 mb-2">
                                  <div className="flex flex-col gap-1 pl-4">
                                    {item.submenu!.map((subitem) => {
                                      const isSubActive = getSubItemActive(subitem, item.submenu!);
                                      return (
                                        <Link
                                          key={subitem.href}
                                          href={subitem.href}
                                          onClick={() => setOpenMobile(false)}
                                          className={cn(
                                            "relative flex items-center h-9 rounded-lg px-2.5 text-sm transition-all duration-150",
                                            isSubActive
                                              ? "bg-white shadow-sm font-semibold text-sidebar-foreground"
                                              : "font-normal text-sidebar-foreground/50 hover:bg-white/60 hover:text-sidebar-foreground/80",
                                          )}
                                        >
                                          {/* Dot indicator */}
                                          <span
                                            className={cn(
                                              "mr-2.5 h-1.5 w-1.5 rounded-full shrink-0 transition-colors",
                                              isSubActive
                                                ? "bg-bee-gold"
                                                : "bg-sidebar-foreground/20",
                                            )}
                                          />
                                          {subitem.title}
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Simple item */
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.title}
                            className={cn(
                              "h-10 rounded-xl px-3 transition-all duration-150",
                              isActive
                                ? "bg-white shadow-sm text-sidebar-foreground font-medium"
                                : "hover:bg-white/70 text-sidebar-foreground/60",
                            )}
                          >
                            <Link href={item.href!} onClick={() => setOpenMobile(false)}>
                              <item.icon
                                className={cn(
                                  "h-[18px] w-[18px] shrink-0 stroke-[1.5]",
                                  isActive
                                    ? "text-bee-gold"
                                    : "text-sidebar-foreground/40",
                                )}
                              />
                              <span
                                className={cn(
                                  "flex-1 text-sm",
                                  isActive
                                    ? "font-medium text-sidebar-foreground"
                                    : "font-normal text-sidebar-foreground/60",
                                )}
                              >
                                {item.title}
                              </span>
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>

      <div className="mx-3 h-px bg-sidebar-foreground/8" />

      {/* Footer */}
      <SidebarFooter className="py-3 px-3 gap-2">
        {/* User info */}
        <div className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-bee-gold/20 text-xs font-semibold text-sidebar-foreground">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/40">
              {user?.email.toString()}
            </p>
          </div>
        </div>

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full h-9 rounded-xl gap-2 text-sidebar-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-colors group-data-[collapsible=icon]:w-9 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:px-0"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          title="Sair"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="text-xs font-medium group-data-[collapsible=icon]:hidden">Sair</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
