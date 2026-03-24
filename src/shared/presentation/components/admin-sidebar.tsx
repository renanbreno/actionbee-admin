"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
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
  Users,
  Gift,
  Settings,
} from "lucide-react";
import { useAuthContext } from "@/contexts/auth/presentation/providers/auth-provider";
import { useLogout } from "@/contexts/auth/presentation/hooks/use-logout";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  title: string;
  href: string;
  icon?: LucideIcon;
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Anúncios",
    href: "/dashboard/announcements",
    icon: Megaphone,
  },
  {
    title: "Produtos",
    href: "/dashboard/products",
    icon: Package,
    submenu: [
      {
        title: "Lista de Produtos",
        href: "/dashboard/products",
      },
      {
        title: "Categorias",
        href: "/dashboard/products/categories",
      },
      {
        title: "Marcas",
        href: "/dashboard/products/brands",
      },
      {
        title: "Grupos de Produtos",
        href: "/dashboard/products/groups",
      },
      {
        title: "Unidades de Medida",
        href: "/dashboard/units",
      },
    ],
  },
  {
    title: "Pedidos",
    icon: ShoppingCart,
    submenu: [
      {
        title: "Lista de Pedidos",
        href: "/dashboard/orders",
      },
      {
        title: "Carrinhos Abandonados",
        href: "/dashboard/abandoned-carts",
      },
    ],
  },
  {
    title: "Cupons",
    href: "/dashboard/coupons",
    icon: Percent,
  },
  {
    title: "Afiliados",
    icon: Users,
    submenu: [
      {
        title: "Lista de Afiliados",
        href: "/dashboard/affiliates/list",
      },
      {
        title: "Categorias de Afiliados",
        href: "/dashboard/affiliates/categories",
      },
      {
        title: "Bonificações",
        href: "/dashboard/affiliates/bonificacoes",
      },
    ],
  },
  {
    title: "Brindes",
    href: "/dashboard/gift-tiers",
    icon: Gift,
  },
  {
    title: "Representantes",
    href: "/dashboard/representatives",
    icon: Users,
  },
  {
    title: "Vendedores",
    href: "/dashboard/vendedores",
    icon: Users,
  },
  {
    title: "Clientes",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Configurações",
    href: "/dashboard/store-settings",
    icon: Settings,
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
  const { setOpenMobile } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Auto-expand submenus when their routes are active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveRoute = item.submenu.some((sub) =>
          pathname.startsWith(sub.href)
        );
        if (hasActiveRoute && !expandedItems.has(item.title)) {
          setExpandedItems((prev) => new Set(prev).add(item.title));
        }
      }
    });
  }, [pathname]);

  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const isSubmenuActive = (submenu: typeof menuItems[0]["submenu"]) => {
    if (!submenu) return false;
    return submenu.some((item) => pathname.startsWith(item.href));
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => router.push("/login"),
    });
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="h-auto py-4">
        <Link href="/dashboard" onClick={() => setOpenMobile(false)} className="flex items-center gap-3 justify-center group-data-[collapsible=icon]:justify-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bee-gold shrink-0">
            <span className="text-sm font-black text-black">A</span>
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">
              ActionBee
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
              Admin
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <div className="mx-2 h-px bg-sidebar-foreground/20" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const hasSubmenu = "submenu" in item && item.submenu;
                const href = "href" in item ? item.href : undefined;
                const isActive = href
                  ? href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(href)
                  : isSubmenuActive(item.submenu);
                const isExpanded = expandedItems.has(item.title);

                return (
                  <SidebarMenuItem key={item.title}>
                    {hasSubmenu ? (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleSubmenu(item.title)}
                          tooltip={item.title}
                          className="group/item h-10 rounded-lg transition-all duration-150 cursor-pointer text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                        >
                          <item.icon className="h-4 w-4 shrink-0 text-sidebar-foreground/50" />
                          <span className="flex-1">{item.title}</span>
                          <ChevronDown
                            className={cn(
                              "h-3.5 w-3.5 transition-transform duration-200 text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden",
                              isExpanded && "rotate-180",
                            )}
                          />
                        </SidebarMenuButton>
                        {isExpanded && item.submenu && (
                          <SidebarMenuSub className="mt-1">
                            {item.submenu.map((subitem) => {
                              const isSubActive =
                                pathname.startsWith(subitem.href) &&
                                !item.submenu!.some(
                                  (s) =>
                                    s.href !== subitem.href &&
                                    pathname.startsWith(s.href) &&
                                    s.href.length > subitem.href.length,
                                );
                              return (
                                <SidebarMenuSubItem key={subitem.href}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubActive}
                                    className={cn(
                                      "h-9 rounded-md transition-all duration-150",
                                      isSubActive
                                        ? "bg-sidebar-accent text-bee-gold font-semibold"
                                        : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                                    )}
                                  >
                                    <Link href={subitem.href} onClick={() => setOpenMobile(false)}>
                                      {subitem.icon && (
                                        <subitem.icon
                                          className={cn(
                                            "h-3.5 w-3.5",
                                            isSubActive
                                              ? "text-bee-gold"
                                              : "text-sidebar-foreground/50",
                                          )}
                                        />
                                      )}
                                      <span className="flex-1">{subitem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "group/item h-10 rounded-lg transition-all duration-150",
                          isActive
                            ? "bg-sidebar-accent text-bee-gold font-semibold"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        )}
                      >
                        <Link href={item.href!} onClick={() => setOpenMobile(false)}>
                          <item.icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              isActive
                                ? "text-bee-gold"
                                : "text-sidebar-foreground/50",
                            )}
                          />
                          <span className="flex-1">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mx-2 h-px bg-sidebar-foreground/20" />

      <SidebarFooter className="py-3">
        <div className="flex items-center gap-3 justify-center group-data-[collapsible=icon]:justify-center">
          <Avatar className="h-8 w-8 shrink-0 group-data-[collapsible=icon]:hidden">
            <AvatarFallback className="bg-sidebar-accent text-xs font-semibold text-sidebar-foreground">
              {user ? getInitials(user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/40">
              {user?.email.toString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
