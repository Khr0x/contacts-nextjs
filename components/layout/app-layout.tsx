"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HomeIcon,
  UserIcon,
  SettingsIcon,
  LogoutIcon,
  MenuIcon,
  Building01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { authClient, useSession, useActiveOrganization } from "@/lib/auth/auth-client";

const mainNavItems = [
  {
    title: "Inicio",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Contactos",
    href: "/contacts",
    icon: UserIcon,
  },
  {
    title: "Organizaciones",
    href: "/organizations",
    icon: Building01Icon,
  },
];

const settingsNavItems = [
  {
    title: "Configuración",
    href: "/settings",
    icon: SettingsIcon,
  },
];

function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: activeOrganization } = useActiveOrganization();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hidden md:flex">
          <HugeiconsIcon icon={MenuIcon} strokeWidth={2} />
        </SidebarTrigger>
      </div>

      {activeOrganization && (
        <div className="hidden md:flex flex-col text-sm text-muted-foreground">
          <span>{activeOrganization.name}</span>
          <span className="text-xs">{activeOrganization.slug}</span>
        </div>
      )}

      <div className="flex-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-muted">
                <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name ?? "Usuario"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <HugeiconsIcon
                icon={SettingsIcon}
                strokeWidth={2}
                className="mr-2 h-4 w-4"
              />
              Configuración
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onClick={handleSignOut}
          >
            <HugeiconsIcon
              icon={LogoutIcon}
              strokeWidth={2}
              className="mr-2 h-4 w-4"
            />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-sidebar-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="font-semibold">CONTACTOS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon icon={Icon} strokeWidth={2} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <HugeiconsIcon icon={Icon} strokeWidth={2} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
          <span>Versión 1.0.0</span>
        </div>
      </SidebarFooter>
    </>
  );
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <SidebarNav />
        </Sidebar>
        <SidebarRail />
        <SidebarInset>
          <Navbar />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export { Navbar, SidebarNav };
