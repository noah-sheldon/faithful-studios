"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { Video, ImageIcon, Package } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center px-4 py-3 group-data-[state=collapsed]:justify-center">
          <Image
            src="/logo.png"
            alt="Faithful Studios Logo"
            width={28}
            height={28}
            className="min-w-[28px] min-h-[28px]"
          />
          <span className="ml-2 font-semibold text-lg text-sidebar-foreground group-data-[state=collapsed]:hidden">
            Faithful Studios
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
            Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/short-form" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Create Short Form Content
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/posters" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Create Posters
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="/product-showcase"
                    className="flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Create Product Showcase
                    </span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
