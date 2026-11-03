"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
} from "lucide-react";
import { NAV } from "@/constants/Sidebar";

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
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/user/getUser_client";

// const WORKSPACES = [
//   { name: "Momentum", description: "Personal space", initial: "M" },
//   { name: "Studio", description: "Work space", initial: "S" },
// ];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, loading, isLoggedIn } = getUser();

  const name = user?.user_metadata?.user_name ?? "Unknown";
const initials = name.slice(0, 2).toUpperCase();
const verified = user?.user_metadata?.email_verified;

  return (
    <Sidebar collapsible="icon" side="left" >
      <SidebarHeader className="p-3 pt-5">
        <SidebarMenu>
<SidebarMenuItem>
  <div className="flex w-full items-center gap-3">
    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-emerald-600 text-base font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20">
      {user?.user_metadata.user_name?.slice(0, 2).toUpperCase()}
    </div>

    <div className="grid min-w-0 text-left leading-tight">
      <span className="truncate text-lg font-semibold">
        {user?.user_metadata.user_name}
      </span>
      <span className="truncate text-sm text-muted-foreground">
        Personal Space
      </span>
    </div>
  </div>
</SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {NAV.map(({ title, href, icon: Icon }) => {
                const active =
                  href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={title}
                      className="h-12 gap-4 rounded-xl px-4 text-base text-muted-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-foreground [&>svg]:size-5"
                    >
                      <Link href={href}>
                        <Icon />
                        <span>{title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    <SidebarFooter className="p-3">
  <SidebarMenu>
    <SidebarMenuItem>
      {isLoggedIn ? (
        <div
          className="flex items-center gap-3 rounded-2xl border bg-sidebar-accent/40 p-2
                     group-data-[collapsible=icon]:justify-center
                     group-data-[collapsible=icon]:border-transparent
                     group-data-[collapsible=icon]:bg-transparent
                     group-data-[collapsible=icon]:p-0"
        >
          {/* Avatar */}
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-muted text-sm font-semibold">
            {initials}
          </div>

          {/* User info (hidden when sidebar is collapsed) */}
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium leading-tight">{name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {verified ? "Verified" : "Not verified"}
            </p>
          </div>

          {/* Settings (hidden when sidebar is collapsed) */}
          <SidebarMenuButton
            asChild
            tooltip="Settings"
            className="h-8 w-8 flex-none justify-center p-0 group-data-[collapsible=icon]:hidden"
          >
            <Link href="/settings" aria-label="Settings">
              <Settings className="size-4" />
            </Link>
          </SidebarMenuButton>
        </div>
      ) : (
        <Button className="w-full group-data-[collapsible=icon]:hidden">
          Sign in
        </Button>
      )}
    </SidebarMenuItem>
  </SidebarMenu>
</SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}