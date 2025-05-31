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
import Link from "next/link";
import { LayoutDashboard, Video, ImageIcon, Package } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center justify-center px-4 py-3 group-data-[state=collapsed]:justify-center"
        >
          <Image
            src="/logo.png"
            alt="Faithful Studios Logo"
            width={28}
            height={28}
            className="min-w-[28px] min-h-[28px]"
          />
          <span className="ml-2 font-semibold text-lg text-sidebar-foreground group-data-[state=collapsed]:hidden">
            eSky
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Content Studio
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Video Gen */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
            Video Gen
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/short-form" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Short Form Promotion
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/short-form-avatar"
                    className="flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Short Form Avatar
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Image Gen */}
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[state=collapsed]:hidden">
            Image Gen
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/posters" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Posters
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/product-showcase"
                    className="flex items-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Product Showcase
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
